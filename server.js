const express = require('express');

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

app.get('/api/dates', (req, res) => {
    return res.json(Object.keys(data));
});

app.get('/api/shows', (req, res) => {
    const date = req.query.date;
    if (!date) {
        res.json({
            'error': 'Missing required parameter.'
        });
        return;
    }

    var shows = data[date] || [];

    var id = 1;
    return res.json(shows.map((show) => {
        show["id"] = id++;
        /* This call doesn't need the entire cast. */
        delete show["cast"];

        return show;
    }));
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});