var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
import fetch from 'node-fetch'
const cors = require('cors')


const mock = [
    { house: "Natur", floor: 3, level: 10 },
    { house: "Humanist", floor: 2, level: 8 },
    { house: "Natur", floor: 4, level: 2 }
]

// GraphQL schema
var schema = buildSchema(`
    type Query {
        sensor: Sensor,
        sensorUnique(nr: Int, floor: Int): Sensor,
        zone(id: String): Zone,
        zones: [Zone]
    },
    type Sensor {
        time: String,
        dd: DD
    },
    type DD {
        temperature: Float,
        humidity: Float,
        light: Float,
        pir: Float,
        vdd: Float,
    },
    type Zone {
        house: String,
        level: Float,
        floor: Int

    }
`);

const level = (pir, length) => {

    if (pir / length < 5) {
        return 1
    } if (pir / length < 10) {
        return 2
    } if (pir / length < 15) {
        return 3
    }
    if (pir / length > 15) {
        return 4
    }
}
const floor_level = (level_three, level_four) => {
    let zones = []
    let pir_three = 0;
    for (let i in level_three) {
        pir_three += level_three[i][0].dd.pir
    }
    zones.push({ house: "Natur", floor: 3, level: level(pir_three, level_three.length) })

    let pir_four = 0;
    for (let i in level_four) {
        pir_four = level_four[i][0].dd.pir
    }
    zones.push({ house: "Natur", floor: 4, level: level(pir_four, level_four.length) })


    return (zones.sort((a, b) => a.level - b.level))
}

const root = {
    sensor: () => {
        return fetch(`https://daresay.herokuapp.com/nv/plan/3/sensor/5?key=41938416368104621`).then(
            (resp) => resp.json()).then(resp => resp[0])

    },
    sensorUnique: (_) => {
        return fetch(`https://daresay.herokuapp.com/nv/plan/${_.floor}/sensor/${_.nr}?key=41938416368104621`).then(
            (resp) => resp.json()).then(resp => resp[0]).catch(error => console.log(error))

    },
    zone: (_) => {
        return ({ level: 1 })
    },
    zones: () => {
        return fetch('https://daresay.herokuapp.com/nv/plan/3/all?key=41938416368104621').then((response) =>
            response.json()).then(level_three => {
                return fetch('https://daresay.herokuapp.com/nv/plan/4/all?key=41938416368104621').then((response) =>
                    response.json()).then(level_four => {
                        return floor_level(level_three, level_four)
                    })
            })
    }
};



var app = express();
app.use('/graphql', cors(), express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));