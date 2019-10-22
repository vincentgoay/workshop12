const express = require('express');
const expHbs = require('express-handlebars');
const path = require('path');

const app = express();

app.engine('hbs', expHbs());
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));

const APP_PORT = process.env.PORT | 3000;

app.get('/image', (req, res, next) => {
    res.render('gallery');
})

app.use((req, res) => {
    res.redirect('/error.html');
})

app.listen(APP_PORT, () => {
    console.log(`Server listening on ${ APP_PORT }`);
})