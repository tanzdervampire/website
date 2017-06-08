const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sql = require('sql.js');
const fs = require('fs');
const nodemailer = require('nodemailer');
const uuid = require('uuid/v4');
const octokat = require('octokat');
const moment = require('moment');

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
    return res.json(result[0]['values'].map(production => {
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
    const result = db.exec('SELECT ID, NAME FROM PERSON ORDER BY NAME ASC');
    if (!result[0]) {
        return res.json({});
    }

    let _ = makeUnderscore(result);
    let response = {};
    result[0]['values'].forEach(row => {
        response[row[_('NAME')]] = {
            'id': row[_('ID')],
        };
    });

    return res.json(response);
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
 * Returns a list of dates (YYYY-MM-DD) for which information is available for
 * at least one show on that day.
 */
app.get('/api/shows/dates', (req, res) => {
    const result = db.exec('SELECT DATE( DAY ) AS DAY, COUNT( * ) AS COUNT FROM SHOW GROUP BY DATE( DAY ) ORDER BY DATE( DAY ) ASC');
    if (!result[0]) {
        return res.json({});
    }

    let _ = makeUnderscore(result);
    let response = {};
    result[0]['values'].forEach(row => {
        response[row[_('DAY')]] = {
            'count': row[_('COUNT')],
        };
    });

    return res.json(response);
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
            DATE( "SHOW".DAY ) AS DAY,
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

/**
 * /api/show/:location/:year/:month/:day/:time
 *
 * Returns a specific show.
 */
app.get('/api/show/:location/:year/:month/:day/:time', (req, res) => {
    const { location, year, month, day, time } = req.params;

    const showStatement = db.prepare(`
        SELECT
            "SHOW".ID,
            DATE( "SHOW".DAY ) AS DAY,
            "SHOW".TIME,
            "SHOW".TYPE,
            "PRODUCTION".LOCATION,
            "PRODUCTION".THEATER
        FROM "SHOW"
        INNER JOIN "PRODUCTION" ON "SHOW".PRODUCTION_ID = "PRODUCTION".ID
        WHERE DATE( "SHOW".DAY ) = :date
            AND "SHOW".TIME = :time
            AND "PRODUCTION".LOCATION = :location
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
        let show = showStatement.getAsObject({
            ':date': [year, month, day].join('-'),
            ':time': time,
            ':location': location,
        });

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

        return res.json({
            'id': show['ID'],
            'day': show['DAY'],
            'time': show['TIME'],
            'type': show['TYPE'],
            'location': show['LOCATION'],
            'theater': show['THEATER'],
            'cast': cast,
        });
    } finally {
        showStatement.free();
        castStatement.free();
    }

    return res.json({ 'error': 'Unknown error.' });
});

const submitCastList = async (data) => {
    const featureBranch = `cast-${uuid()}`;

    var octo = new octokat({ token: process.env.API_TOKEN });
    var repo = octo.repos('tdv-casts', 'website');

    const master = await repo.git.refs('heads/master').fetch();
    const baseBranch = await repo.git.refs.create({
        'ref': `refs/heads/${featureBranch}`,
        'sha': master.object.sha,
    });

    const blob = await repo.git.blobs.create({ content: JSON.stringify(data, null, 4) });

    const tree = await repo.git.trees.create({
        'base_tree': baseBranch.object.sha,
        'tree': [
            {
                'path': `database/data/${data.location}/${moment(data.day, 'YYYY-MM-DD').format('DD.MM.YYYY')}-${data.time.replace(/:/, '')}.json`,
                'mode': '100644',
                'type': 'blob',
                'sha': blob.sha,
            }
        ]
    });

    const commit = await repo.git.commits.create({
        'message': `Added show ${data.day} ${data.time} (${data.location})`,
        'tree': tree.sha,
        'parents': [baseBranch.object.sha],
    });

    const updatedBaseBranch = await repo.git.refs(`heads/${featureBranch}`).update({
        'sha': commit.sha,
        'force': false,
    });

    const pr = await octo.fromUrl('/repos/Airblader/playground/pulls').create({
        'title': `Added show ${data.day} ${data.time} (${data.location})`,
        'body': '',
        'head': featureBranch,
        'base': 'master',
    });
};

const submitCastListViaEmail = data => {
    let transporter = nodemailer.createTransport({
        host: process.env.SUBMIT_EMAIL_HOST,
        port: process.env.SUBMIT_EMAIL_PORT,
        secure: false,
        auth: {
            user: process.env.SUBMIT_EMAIL_USER,
            pass: process.env.SUBMIT_EMAIL_PASSWORD,
        }
    });

    let mailOptions = {
        from: '"TanzDerVampire.info" <tdv-submit@airblader.de>',
        to: 'admin@airblader.de',
        subject: `TanzDerVampire.info – ${data.day} ${data.time}`,
        text: JSON.stringify(data, null, 4),
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }

        console.log('Message %s sent: %s', info.messageId, info.response);
    });
};
app.post('/api/shows', bodyParser.json(), (req, res) => {
    const data = req.body;

    // TODO FIXME Validation

    if (process.env.NODE_ENV !== 'production') {
        console.log(`Submitted: ${JSON.stringify(data, null, 4)}`);
        return res.json({});
    }

    try {
        submitCastList(data);
        return res.json({});
    } catch(e) {
        try {
            submitCastListViaEmail(data);
            return res.json({});
        } catch(e) {
            return res.status(500).json({
                'error': e.toString(),
            });
        }
    }
});


/* Route everything else to index.html */
if (process.env.NODE_ENV === 'production') {
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
    });
}

app.listen(app.get('port'), () => {
    console.log(`Find the server at: http://localhost:${app.get('port')}/`);
});