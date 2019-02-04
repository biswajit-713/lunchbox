const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/aboutus', (req, res) => {
    res.sendFile('aboutus.html', {root: __dirname + '/public'});
});

app.listen(`${PORT}`, () => {
    console.log(`server running on port ${PORT}`);
});
