const express = require('express');

const app = express();

app.set('port', (process.env.PORT || 3001));

if (process.env.NODE_ENV === 'production') {
    app.use(express.static('frontend/build'));
}

app.get("/api/shows", (req, res) => {
    const date = req.query.date;
    if (!date) {
        res.json({
            "error": "Missing required parameter."
        });
        return;
    }

    // TODO Replace dummy
    return res.json([
        {
            "id": "id-1",
            "date": date,
            "time": "Matinée",
            "place": "Stuttgart",
        },
        {
            "id": "id-2",
            "date": date,
            "time": "Soirée",
            "place": "Stuttgart",
        }
    ]);
});

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});