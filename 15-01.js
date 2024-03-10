const express = require('express');
const exphbs  = require('express-handlebars');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();

const hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        cancelButton: function() {
            return '<a href="/" class="btn btn-secondary mt-3">Отказаться</a>';
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


let directory = [];
let serverAdress = "http://localhost:3000";

fs.readFile('phonebook.json', (err, data) => {
    if (err) throw err;
    directory = data ? JSON.parse(data) : [];
});



app.get('/', (req, res) => {
    res.render('index', { directory: directory });
});

app.get('/add', (req, res) => {
    res.render('add');
});

app.post('/add', (req, res) => {
    const newEntry = req.body;
    if (!Array.isArray(directory)) {
        directory = [];
    }
    directory.push(newEntry);
    fs.writeFile('phonebook.json', JSON.stringify(directory), err => {
        if (err) throw err;
        res.redirect('/');
    });
});


app.get('/update', (req, res) => {
    const name = req.query.name;
    const entry = directory.find(entry => entry.name === name);
    res.render('update', entry);
});


app.post('/update', (req, res) => {
    const updatedEntry = req.body;
    const index = directory.findIndex(entry => entry.id === updatedEntry.id);
    directory[index] = updatedEntry;
    fs.writeFile('phonebook.json', JSON.stringify(directory), err => {
        if (err) throw err;
        res.redirect('/');
    });
});

app.post('/delete', (req, res) => {
    const name = req.body.name;
    directory = directory.filter(entry => entry.name !== name);
    fs.writeFile('phonebook.json', JSON.stringify(directory), err => {
        if (err) throw err;
        res.redirect('/');
    });
});
  

app.listen(3000, () => console.log(serverAdress));
