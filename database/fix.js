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

/* Store shows */
const fnToDate = fn => moment(fn.replace(/\.json$/, ''), 'DD.MM.YYYY-HHmm');
fs.readdirSync('./data/')
    .map(location => fs.readdirSync(`./data/${location}/`).map(fn => { return { 'fn': fn, 'location': location }; }))
    .reduce((a,b) => [...a, ...b])
    .sort((a,b) => fnToDate(a.fn).diff(fnToDate(b.fn)))
    .forEach(show => {
        const data = slurpJson(`./data/${show.location}/${show.fn}`);
        const day = moment(data.day, 'DD.MM.YYYY');

        const newName = `${day.format('DD.MM.YYYY')}-${data.time.replace(/:/, '')}.json`;
        fs.renameSync(`./data/${show.location}/${show.fn}`, `./data/${show.location}/${newName}`);
    });
