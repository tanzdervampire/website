const express = require('express');
const sql = require('sql.js');
const fs = require('fs');

const app = express();

const dbBuffer = fs.readFileSync('db.sqlite');
const db = new sql.Database(dbBuffer);

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

process.on('exit', () => {
    if (db) {
        db.close();
    }
});

/**
 * Returns a function which maps a column name to the appropriate index.
 * @private
 */
const makeUnderscore = function (result) {
    return function (column) {
        return result[0]['columns'].indexOf(column);
    };
};

/**
 * /api/productions
 *
 * Returns a list of productions.
 */
app.get('/api/productions', (req, res) => {
    const result = db.exec('SELECT START, END, LOCATION, THEATER FROM PRODUCTION ORDER BY DATE( START ) ASC, DATE( END ) ASC');
    if (!result[0]) {
        return res.json({});
    }

    let _ = makeUnderscore(result);
    return res.json(result[0]['values'].map((production) => {
        return {
            'start': production[_('START')],
            'end': production[_('END')],
            'location': production[_('LOCATION')],
            'theater': production[_('THEATER')],
        };
    }));
});

/**
 * /api/actors
 *
 * Returns a list of all actors.
 */
app.get('/api/actors', (req, res) => {
    const result = db.exec('SELECT NAME FROM PERSON ORDER BY NAME ASC');
    if (!result[0]) {
        return res.json({});
    }

    let _ = makeUnderscore(result);
    return res.json(result[0]['values'].map((actor) => {
        return actor[_('NAME')];
    }));
});

/**
 * /api/shows/stats
 *
 * Returns statistics about the dataset of shows.
 */
app.get('/api/shows/stats', (req, res) => {
    const result = db.exec('SELECT COUNT( * ) AS CNT FROM SHOW');
    if (!result[0]) {
        return res.json({});
    }

    let _ = makeUnderscore(result);
    return res.json({
        'count': result[0]['values'][0][_('CNT')],
    });
});

/**
 * /api/shows/dates
 *
 * Returns a (sorted) list of dates (YYYY-MM-DD) for which information is available for
 * at least one show on that day.
 */
app.get('/api/shows/dates', (req, res) => {
    const result = db.exec('SELECT DISTINCT( DATE( DAY ) ) AS DAY FROM SHOW ORDER BY DATE( DAY ) ASC');
    if (!result[0]) {
        return res.json({});
    }

    let _ = makeUnderscore(result);
    return res.json(result[0]['values'].map((value) => {
        return value[_('DAY')];
    }));
});

/**
 * /api/shows/:year/:month/:day
 *
 * Returns all shows on the specified day.
 */
app.get('/api/shows/:year/:month/:day', (req, res) => {
    const { year, month, day } = req.params;

    const showStatement = db.prepare(`
        SELECT
            "SHOW".ID,
            "SHOW".DAY,
            "SHOW".TIME,
            "SHOW".TYPE,
            "PRODUCTION".LOCATION,
            "PRODUCTION".THEATER
        FROM "SHOW"
        INNER JOIN "PRODUCTION" ON "SHOW".PRODUCTION_ID = "PRODUCTION".ID
        WHERE DATE( "SHOW".DAY ) = :day
        ORDER BY DATETIME( "SHOW".TIME ) ASC, "SHOW".TYPE ASC
    `);

    const castStatement = db.prepare(`
        SELECT
            "PERSON".ID,
            "CAST".ROLE,
            "PERSON".NAME
        FROM "CAST"
        INNER JOIN PERSON ON "CAST".PERSON_ID = "PERSON".ID
        WHERE "CAST".SHOW_ID = :show
        ORDER BY "CAST".ROLE ASC, "PERSON".NAME ASC
    `);

    let result = [];
    try {
        showStatement.bind({
            ':day': [year, month, day].join('-'),
        });

        while (showStatement.step()) {
            let show = showStatement.getAsObject();

            let cast = {};
            castStatement.bind({
                ':show': show['ID'],
            });
            while (castStatement.step()) {
                let person = castStatement.getAsObject();
                cast[person['ROLE']] = cast[person['ROLE']] || [];
                cast[person['ROLE']].push({
                    'id': person['ID'],
                    'name': person['NAME'],
                });
            }

            result.push({
                'id': show['ID'],
                'day': show['DAY'],
                'time': show['TIME'],
                'type': show['TYPE'],
                'location': show['LOCATION'],
                'theater': show['THEATER'],
                'cast': cast,
            });
        }
    } finally {
        showStatement.free();
        castStatement.free();
    }

    return res.json(result);
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});
