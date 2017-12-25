const { Command } = require('sylphy')
const weather = require('yahoo-weather')

class Weather extends Command {
    constructor (...args) {
        super (...args, {
            name: 'weather',
            group: 'utility',
            aliases: ['w'],
            cooldown: 2,
            options: {guildsOnly: true},
            usage: [
                { name: 'city', displayName: 'city', type: 'string', optional: false },
                { name: 'tempunit', displayName: 'tempunit', type: 'string', optional: true, last: true }
            ]
        })
    }

    handle ({ args, client, msg }, responder) {
        const city = args.city
        const tempunit = args.tempunit

        weather(city, tempunit).then(info => {
            const url = info.item.link
            const imageurl = info.item.description
            if (info === null) return responder.send(`:no_entry_sign: couldnt find weather on ${city}`)

            return responder.send(' ', {embed: {
                color: 0x66dac3,
                title: `Yahoo! Weather Info on ${info.location.city}, ${info.location.country}~`,
                url: url.substr(url.lastIndexOf("*") + 1),
                thumbnail: {
                    url: info.item.description.slice(19, 56)
                },
                fields: [{
                    name: ':thermometer: Temperature',
                    value: `${info.item.condition.temp} °${info.units.temperature}`,
                    inline: true
                },
                {
                    name: ':droplet: Humidity',
                    value: `${info.atmosphere.humidity}`,
                    inline: true
                },
                {
                    name: ':dash: Wind Speed',
                    value: `${info.wind.speed} ${info.units.speed}`,
                    inline: true
                },
                {
                    name: ':umbrella: Conditions',
                    value: `${info.item.condition.text}`,
                    inline: true
                },
                {
                    name: ':sunny: Todays High',
                    value: `${info.item.forecast[0].high} °${info.units.temperature}`,
                    inline: true
                },
                {
                    name: ':cloud: Todays Low',
                    value: `${info.item.forecast[0].low} °${info.units.temperature}`,
                    inline: true
                },
                {
                    name: ':sunrise: Sunrise',
                    value: `${info.astronomy.sunrise}`,
                    inline: true
                },
                {
                    name: ':city_sunset: Sunset',
                    value: `${info.astronomy.sunset}`,
                    inline: true
                }],
                timestamp: new Date(),
                footer: {
                    text: `${info.item.title} `
                }
            }})
        })
    }
}

module.exports = Weather