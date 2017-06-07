const fs = require('fs');
const moment = require('moment');
const sql = require('sql.js');

const slurp = fn => {
    return fs.readFileSync(fn, {
        encoding: 'utf8'
    });
};

const slurpJson = fn => {
    return JSON.parse(slurp(fn));
};

const toPersonId = (obj, nameToId) => {
    if (typeof obj === 'string' && typeof nameToId[obj] === 'number') {
        return nameToId[obj];
    }

    if (typeof obj === 'object' && typeof obj.name === 'string') {
        return toPersonId(obj.name);
    }

    throw {
        'error': `Could not get person ID for ${obj}`,
    };
};

const getProductionId = (date, location, productions) => {
    let _ = (column) => {
        return productions[0]['columns'].indexOf(column);
    };

    let options = [];
    for (let i = 0; i < productions[0]['values'].length; i++) {
        const production = productions[0]['values'][i];

        if (location && production[_('LOCATION')] !== location) {
            continue;
        }

        let startDate = moment(production[_('START')], 'YYYY-MM-DD HH:mm:ss.SSS');
        const endDate = moment(production[_('END')], 'YYYY-MM-DD HH:mm:ss.SSS');

        if (location) {
            /* If we know the location, allow for preview / premiere */
            startDate = startDate.subtract(2, 'days');
        }

        if (!date.isBefore(startDate) && !date.isAfter(endDate)) {
            /* If a location was specified we have checked it, so return immediately. */
            if (location) {
                return production[_('ID')];
            }

            /* If no location was specified, let's first see how many matches we get. */
            options.push(production[_('ID')]);
        }
    }

    /* If no location was specified, only return a unique match and reject all other cases. */
    if (!location) {
        if (options.length !== 1) {
            throw {};
        }

        return options[0];
    }

    throw {};
};

const db = new sql.Database();

/* Database setup */
(() => {
    db.run(`
        CREATE TABLE PRODUCTION (
            ID       INTEGER PRIMARY KEY AUTOINCREMENT,
            START    DATE DEFAULT NULL,
            END      DATE DEFAULT NULL,
            LOCATION TEXT         NOT NULL,
            THEATER  TEXT DEFAULT NULL
        );`);

    db.run(`
        CREATE TABLE PERSON (
            ID     INTEGER PRIMARY KEY AUTOINCREMENT, 
            NAME   TEXT         NOT NULL, 
            AVATAR TEXT DEFAULT NULL
        );`);

    db.run(`
        CREATE TABLE CAST (
            SHOW_ID   INTEGER NOT NULL,
            ROLE      TEXT    NOT NULL,
            PERSON_ID INTEGER NOT NULL
        );`);

    db.run(`
        CREATE TABLE SHOW (
            ID            INTEGER PRIMARY KEY AUTOINCREMENT,
            PRODUCTION_ID INTEGER NOT NULL,
            DAY           DATE    NOT NULL,
            TIME          TEXT    NOT NULL,
            TYPE          TEXT    NOT NULL
        );`);
})();

/* Store productions */
slurpJson('./productions.json').forEach(production => {
    db.run('INSERT INTO PRODUCTION (START, END, LOCATION, THEATER) VALUES (?, ?, ?, ?);', [
        production.start,
        production.end,
        production.location,
        production.theater
    ]);
});

/* Cache productions */
const productions = db.exec('SELECT * FROM PRODUCTION');

/* Store actors */
slurpJson('./names.json').forEach(name => {
    db.run('INSERT INTO PERSON (NAME) VALUES (?);', [name]);
});

/* Cache names. */
const nameToId = (() => {
    const query = db.exec('SELECT ID, NAME FROM PERSON');

    let out = {};
    query[0]['values'].forEach((entry) => {
        /* Name → ID */
        out[entry[1]] = +entry[0];
    });

    return out;
})();

/* Store shows */
const fnToDate = fn => moment(fn.replace(/\.json$/, ''), 'DD.MM.YYYY-HHmm');
fs.readdirSync('./data/')
    .map(location => fs.readdirSync(`./data/${location}/`).map(fn => { return { 'fn': fn, 'location': location }; }))
    .reduce((a,b) => [...a, ...b])
    .sort((a,b) => fnToDate(a.fn).diff(fnToDate(b.fn)))
    .forEach(show => {
        const data = slurpJson(`./data/${show.location}/${show.fn}`);
        const day = moment(data.day, 'DD.MM.YYYY');

        console.log(`Inserting show ${day} / ${data.time}.`);

        db.run('INSERT INTO SHOW (PRODUCTION_ID, DAY, TIME, TYPE) VALUES (?, ?, ?, ?);', [
            getProductionId(day, data.location, productions),
            day.format('YYYY-MM-DD 00:00:00.0000'),
            data.time,
            data.type,
        ]);

        const showId = db.exec('SELECT ID FROM SHOW ORDER BY ID DESC')[0]['values'][0][0];

        Object.keys(data['cast']).forEach(role => {
            data['cast'][role].forEach(element => {
                if (!element) {
                    return;
                }

                const personId = toPersonId(element, nameToId);
                db.run('INSERT INTO CAST (SHOW_ID, ROLE, PERSON_ID) VALUES (?, ?, ?);', [showId, role, personId ]);
            });
        });
    });

/* Export database */
(() => {
    const data = db.export();
    const buffer = new Buffer(data);

    fs.writeFileSync('generated.sqlite', buffer, (err) => {
        if (err) {
            throw err;
        }
    });
})();