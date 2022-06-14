'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const { check, validationResult } = require('express-validator'); // validation middleware
const dao = require('./dao'); // module for accessing the DB
const passport = require('passport'); // auth middleware
const LocalStrategy = require('passport-local').Strategy; // username and password for login
const session = require('express-session'); // enable sessions
const userDao = require('./user-dao'); // module for accessing the users in the DB
const cors = require('cors');

/*** Set up Passport ***/

// set up the "username and password" login strategy
// by setting a function to verify username and password
passport.use(new LocalStrategy(
    function (username, password, done) {
        userDao.getUser(username, password).then((user) => {
            if (!user)
                return done(null, false, { error: 'Incorrect username and/or password.' });

            return done(null, user);
        })
    }
));


// serialize and de-serialize the user (user object <-> session)
// we serialize the user id and we store it in the session: the session is very small in this way
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// starting from the data in the session, we extract the current (logged-in) user
passport.deserializeUser((id, done) => {
    userDao.getUserById(id)
        .then(user => {
            done(null, user); // this will be available in req.user
        }).catch(err => {
            done(err, null);
        });
});


const app = new express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

// custom middleware: check if a given request is coming from an authenticated user
const isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated())
        return next();

    return res.status(401).json({ error: 'not authenticated' });
}

// set up the session
app.use(session({
    // by default, Passport uses a MemoryStore to keep track of the sessions
    secret: 'a secret sentence not to share with anybody and anywhere, used to sign the session ID cookie',
    resave: false,
    saveUninitialized: false
}));

// then, init passport
app.use(passport.initialize());
app.use(passport.session());


/** APIs **/

// GET /api/courses
app.get('/api/courses', (req, res) => {
    dao.listCourses()
        .then(courses => res.json(courses))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Database error while retrieving courses" }).end()
        });
});

// GET /api/incompatibilities
app.get('/api/incompatibilities', (req, res) => {
    dao.listIncompatibilities()
        .then(incompatibilities => res.json(incompatibilities))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Database error while retrieving courses incompatibilities" }).end()
        });
});

// GET /api/studyplan
app.get('/api/studyplan', isLoggedIn, async (req, res) => {
    try {
        const result = await dao.listStudyPlan(req.user.id);
        if (result.error) {
            res.status(404).json(result);
        } else {
            res.json(result);
        }
    } catch {
        console.log(err);
        res.status(500).json({ error: "Database error while retrieving studyplan" }).end()
    }
});

// POST /api/studyplan
// TODO:checks
app.post('/api/studyplan', isLoggedIn, [
    check('courses').custom((studyplan, { req }) => {
        console.log();
        return dao.listCourses()
            .then(courses => {
                // uso il piano di studi nel body solo per sapere quali corsi si vogliono aggiungere
                // prendo i dati effettivi dei corsi dal db
                const realstudyplan = courses.filter((c) => {
                    return studyplan.some(s => { return c.code === s.code });
                })

                // check credits
                const currentCredits = realstudyplan.reduce((count, c) => count + c.credits, 0);
                const maxCredits = req.user.isFullTime ? 80 : 40;
                const minCredits = req.user.isFullTime ? 40 : 20;
                if (minCredits > currentCredits || maxCredits < currentCredits) {
                    console.log(`Credits for your current plan must be between ${minCredits} and ${maxCredits}, current: ${currentCredits} `);
                    throw new Error("Error in credits sum");
                }

                // check propedeutics

                for (let course of realstudyplan) {
                    if (course.propedeuticcourse) {
                        if (!realstudyplan.find(c => c.code === course.propedeuticcourse)) {
                            throw new Error(`Missing propedeutic course ${course.propedeuticcourse} for course ${course.code}`);
                        }
                    }


                    // check muxStudentsEnrolled
                    if (course.maxstudentsenrolled && (course.studentsenrolled >= course.maxstudentsenrolled)) {
                        console.log(`${course.code} reached max capacity`);
                        throw new Error(`${course.code} reached max capacity`);
                    }
                }
            }).catch((err) => {
                throw new Error(err);
            });
    })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array()});
    }

    try {
        await dao.addStudyPlan(req.body.courses, req.user.id);
        res.status(201).end();
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the creation of studyplan.` });
    }
});

// DELETE /api/studyplan
app.delete('/api/studyplan', isLoggedIn, async (req, res) => {
    try {
        await dao.deleteStudyPlan(req.user.id);
        res.status(204).end();
    } catch (err) {
        console.log(err);
        res.status(503).json({ error: `Database error during the deletion of studyplan.` });
    }
});

// PUT /api/studyplan/enrollment
app.put('/api/studyplan/enrollment', isLoggedIn, [
    check('enrollment').isInt({ min: 0, max: 1 })
], async (req, res) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }

    try {
        await dao.updateUserEnrollment(req.body.enrollment, req.user.id)
        res.status(200).end();
    } catch {
        console.log(err);
        res.status(503).json({ error: 'Database error during enrollment update.' })
    }
});

/** Users APIs **/

// POST /sessions 
// login
app.post('/api/sessions', function (req, res, next) {
    passport.authenticate('local', (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            // display wrong login messages
            return res.status(401).json(info);
        }
        // success, perform the login
        req.login(user, (err) => {
            if (err)
                return next(err);

            // req.user contains the authenticated user, we send all the user info back
            // this is coming from userDao.getUser()
            return res.json(req.user);
        });
    })(req, res, next);
});

// DELETE /sessions/current 
// logout
app.delete('/api/sessions/current', (req, res) => {
    req.logout(() => { res.end(); });
});

// GET /sessions/current
// check whether the user is logged in or not
app.get('/api/sessions/current', (req, res) => {
    if (req.isAuthenticated()) {
        res.status(200).json(req.user);
    } else {
        res.status(401).json({ error: 'Unauthenticated user!' });
    }
});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));