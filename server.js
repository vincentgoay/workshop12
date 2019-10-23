const express = require('express');
const expHbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');
const asciify = require('asciify-image');

const app = express();

app.engine('hbs', expHbs());
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join('views','images')));

const APP_PORT = process.env.PORT | 3000;
const imageDir = path.join(__dirname, 'views', 'images');

const ascOptions = {
    fit: 'box',
    width: '100',
    height: '100',
    color: false
}

let imagesArr = [];
let imagesArrAbsPath = [];
let imagesArrPath = [];

fs.readdir(imageDir, function (err, files) {
    //handling error
    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }

    files.forEach((file) => {
        imagesArr.push(file);
        imagesArrPath.push(path.join(imageDir, file));
        imagesArrAbsPath.push(path.join('views', 'images', file));
    })

    console.log(imagesArr);
    console.log(imagesArrPath);
    console.log(imagesArrAbsPath);
});

function randomGenerator(length) {
    return Math.floor(Math.random() * length);
}

app.get('/image', (req, res, next) => {
    const randomNumber = randomGenerator(imagesArr.length);

    res.format({
        'text/html': () => {
            res.status(200);
            res.type('text/html');
            res.send(`<img src="${imagesArr[randomNumber]}" width="80%" height="auto"></img>`);
        },
        'images/jpeg': () => {
            res.status(200);
            res.type('images/jpeg');
            res.sendFile(imagesArrPath[randomNumber]);
        },
        'application/json': () => {
            res.status(200);
            res.type('application/json');
            res.json({
                imageUrl: imagesArrPath[randomNumber]
            })
        },
        'text/plain': () => {
            console.log(`Path: ${imagesArrAbsPath[randomNumber]}`);
            asciify(imagesArrPath[randomNumber], ascOptions, (err, asciified) => {
                if (err) {
                    console.log(`Error: ${err}`);
                    throw err;
                }
                console.log(asciified)
                res.status(200);
                res.type('text/plain');
                res.send(asciified);
            })
        },
        'default': () => {
            res.status(406);
            res.send(`<h1>Not Acceptable</h1>`);
        }
    })
})

app.get('/image/ascii-art', (req, res, next) => {
    const randomNumber = randomGenerator(imagesArr.length);

    asciify(imagesArrPath[randomNumber], ascOptions, (err, asciified) => {
        if (err) {
            console.log(`Error: ${err}`);
            throw err;
        }
        console.log(asciified)
        res.status(200);
        res.render('ascii-art', {
            asciified: asciified
        })
    })
})

app.get('/image-handlebars', (req, res, next) => {
    const randomNumber = randomGenerator(imagesArr.length);

    //Render handlebars gallery view in html
    res.render('gallery', {
        imageSrc: imagesArr[randomNumber]
    });
})

app.use((req, res) => {
    res.redirect('/error.html');
})

app.listen(APP_PORT, () => {
    console.log(`Server listening on ${APP_PORT}`);
})