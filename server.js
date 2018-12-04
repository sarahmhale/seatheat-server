var express = require('express');
var express_graphql = require('express-graphql');
var { buildSchema } = require('graphql');
import fetch from 'node-fetch'
// GraphQL schema
var schema = buildSchema(`
    type Query {
        sensor: Sensor,
        sensorUnique(nr: Int, floor: Int): Sensor,
        zone(id: String): Zone,
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
        level: Int,
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
    }
};

var app = express();
app.use('/graphql', express_graphql({
    schema: schema,
    rootValue: root,
    graphiql: true
}));
app.listen(4000, () => console.log('Express GraphQL Server Now Running On localhost:4000/graphql'));