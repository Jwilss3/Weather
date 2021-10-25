const express = require('express');
const hbs = require('express-handlebars');
const path = require ('path');
const getWeather = require('./lib/getWeather');
const app = express();

const indexRouter = require('./routes/indexRouter');
const weatherRouter = require('./routes/weatherRouter');
const errRouter = require ('./routes/errRouter'); 

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.engine('hbs', hbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views', 'layouts'),
    partialsDir: path.join(__dirname, 'views', 'partials')
}));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', '.hbs');
app.get('/', async(req, res) => {
    let data = await getWeather("New York City", "US");
    let name = data.name;
    let temp = data.temp;
    res.render('index', {name, temp});
});

app.get('/weather', (req, res) => {
    res.render('weather');
});
app.post('/weather', async(req, res) => {
    let location = req.body.location;
    let countryCode = req.body.countryCode;
    let data = await getWeather(location, countryCode);
    if (data.cod == '404') {
        res.render('weather', {
            err:'The provided location doesn\'t exist'
        });
        return
    }
    let name = data.name;
    let description = data.weather[0].description;
    let temp = data.main.temp;
    let feels_like = data.main.feels_like;
    res.render('weather', {
        name, 
        data: {description, temp, feels_like}
    });
    console.log(data)
});
app.get('*', (req, res) => {
    res.render('weather');
});
// app.listen(3000, () => {
//     console.log('listening on port 3000')
// });

app.listen(process.env.port || 5000, () => {
    console.log("App is online")
});