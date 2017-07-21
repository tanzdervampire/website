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

fs.readdirSync('./data/')
    .map(location => fs.readdirSync(`./data/${location}/`).map(fn => { return { 'fn': fn, 'location': location }; }))
    .reduce((a,b) => [...a, ...b])
    .forEach(show => {
        let data = slurpJson(`./data/${show.location}/${show.fn}`);
        const day = moment(data.day, 'DD.MM.YYYY');

        Object.keys(data.cast).forEach(role => {
            let unique = [];
            data.cast[role].forEach((actor, idx) => {
                if (data.cast[role].indexOf(actor) === idx) {
                    unique.push(actor);
                }
            });

            data.cast[role] = unique;
        });

        //fs.renameSync(`./data/${show.location}/${show.fn}`, `./data/${show.location}/${newName}`);
        fs.writeFileSync(`./data/${show.location}/${show.fn}`, JSON.stringify(data, null, 4));
    });
