var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
import fetch from 'node-fetch'
const cors = require('cors')

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
        level: Int,
        floor: String

    }
`);


const root = {
    sensor: () => {
        return fetch(`https://daresay.herokuapp.com/nv/plan/3/sensor/5?key=41938416368104621`).then(
            (resp) => resp.json()).then(resp => resp[0])

    },
    sensorUnique: (_) => {
        return fetch(`https://daresay.herokuapp.com/nv/plan/${_.floor}/sensor/${_.nr}?key=41938416368104621`).then(
            (resp) => resp.json()).then(resp => resp[0])

    },
    zone: (_) => {
        return ({ level: 1 })
    },
    zones: () => {
        return ([{ house: "Natur", floor: "3", level: 10 }, { house: "Natur", floor: "3", level: 2 }])

    }
};

var app = express();
app.use('/graphql', cors(), express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));