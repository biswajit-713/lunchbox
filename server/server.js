const express = require('express');
const bodyParser = require('body-parser');

const logger = require('./config/log-config');
const { mongoose } = require('./db/db-config');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/aboutus', (req, res) => {
    res.sendFile('aboutus.html', {root: __dirname + '/public'});
    logger.info(`${req.ip} - ${req.method} - ${req.originalUrl}`);
});

app.listen(`${PORT}`, () => {
    logger.info(`server running on port ${PORT}`);
});
