'use strict';

const express = require('express');
const morgan = require('morgan'); // logging middleware
const dao = require('./dao'); // module for accessing the DB
const cors = require('cors');

const app = new express();
const PORT = 3001;

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());


/** APIs **/
app.get('/api/courses', (req, res) => {
    dao.listCourses()
        .then(courses => res.json(courses))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Database error while retrieving courses" }).end()
        });
});

app.get('/api/incompatibilities', (req, res) => {
    dao.listIncompatibilities()
        .then(incompatibilities => res.json(incompatibilities))
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: "Database error while retrieving courses incompatibilities" }).end()
        });
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}/`));