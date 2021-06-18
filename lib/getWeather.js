const fetch = require ('node-fetch');
require('dotenv').config();

const getWeather = async(location=process.env.location, countryCode=process.env.countryCode) => {
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${process.env.APPID}&units=metric`;
    let data = await fetch(url);
    return await data.json();
}

module.exports = getWeather;