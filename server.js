const express = require('express');
const expHbs = require('express-handlebars');
const path = require('path');
const fs = require('fs');

const app = express();

app.engine('hbs', expHbs());
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('views/images'));

const APP_PORT = process.env.PORT | 3000;
const imageDir = path.join(__dirname, '/views/images');

let imagesArr = [];

app.get('/image', (req, res, next) => {
    fs.readdir(imageDir, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        const dispImg = files[Math.floor(Math.random() * files.length)];
        const dispImgPath = path.join(imageDir, `${dispImg}`);
        console.log(`ImgPath: ${dispImgPath}`);

        // Return html fragment
        res.status(200);
        res.type('text/html');
        res.send(`<img src="${dispImg}" width="80%" height="auto"></img>`);
    });
})

app.get('/image2', (req, res, next) => {
    fs.readdir(imageDir, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        const dispImg = files[Math.floor(Math.random() * files.length)];
        const dispImgPath = path.join(imageDir, `${dispImg}`);
        console.log(`ImgPath: ${dispImgPath}`);

        //Render handlebars gallery view in html
        res.render('gallery', {
            imageSrc: dispImg
        });
    });
})

app.get('/random-image', (req, res, next) => {
    fs.readdir(imageDir, function (err, files) {
        //handling error
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }

        const filename = files[Math.floor(Math.random() * files.length)];
        const filePath = path.join(imageDir, `${filename}`);
        console.log(`ImgPath: ${filePath}`);

        // Return image file 
        res.sendFile(filePath);
    });
})

app.use((req, res) => {
    res.redirect('/error.html');
})

app.listen(APP_PORT, () => {
    console.log(`Server listening on ${APP_PORT}`);
})