const express = require('express');
const moment = require('moment');

const fs = require('fs');
let data = {};

fs.readFile("data.json", "utf8", (err, raw) => {
    if (err) {
        throw err;
    }

    data = JSON.parse(raw);
});

const app = express();

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

var toId = function(show) {
    return show['date'] + '|' + show['time'] + '|' + show['place'];
};

var fromId = function(id) {
    const parts = id.split(/\|/);
    if (parts.length !== 3) {
        return null;
    }

    return {
        date: parts[0],
        time: parts[1],
        place: parts[2],
    };
};

/**
 * /api/dates
 *
 * Returns available show dates in format DD.MM.YYYY and in ascending order.
 */
app.get('/api/dates', (req, res) => {
    return res.json(Object.keys(data)
        .sort((a, b) => {
            return a - b;
        })
        .map((unix) => {
            return moment.unix(unix).format('DD.MM.YYYY');
        })
    );
});

/**
 * /api/shows?date=<DD.MM.YYYY>
 */
app.get('/api/shows', (req, res) => {
    const date = req.query.date;
    if (!date) {
        res.json({
            'error': 'Missing required parameter.'
        });
        return;
    }

    var shows = data[moment(date, "DD.MM.YYYY").unix()] || [];

    return res.json(shows.map((show) => {
        return {
            'id': toId(show),
            'date': show['date'],
            'place': show['place'],
            'time': show['time'],
            'unix': show['unix'],
        };
    }));
});

/**
 * /api/cast?id=<id>
 *
 * Returns the entire cast information for a show.
 */
app.get('/api/cast', (req, res) => {
    const id = req.query.id;
    if (!id) {
        res.json({
            'error': 'Missing required parameter.'
        });
        return;
    }

    var parts = fromId(id);
    if (!parts) {
        res.json({
            'error': 'Invalid ID.'
        });
        return;
    }

    const { date, place, time } = parts;
    var shows = data[moment(date, "DD.MM.YYYY").unix()] || [];

    for (var i = 0; i < shows.length; i++) {
        const show = shows[i];
        if (show['date'] !== date || show['place'] !== place || show['time'] !== time) {
            continue;
        }

        return res.json(show);
    }

    return res.json({
        'error': 'Show not found.'
    });
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});