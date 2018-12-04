import fetch from 'node-fetch'

const {
    GraphQLObjectType,
    GraphQLSchema,
    GraphQLInt,
    GraphQLString,
    GraphQLList,
    GraphQFloat,

} = require('graphql')

const url = `https://daresay.herokuapp.com/nv/plan/3/sensor/5?key=41938416368104621`;

const SensorData = new GraphQLObjectType({
    name: 'sensor',
    fields: () => ({
        time: { type: GraphQLString },
    })
})

const DD = new GraphQLObjectType({
    name: 'dd',
    fields: () => ({
        temperature: { type: GraphQFloat },
        humidity: { type: GraphQLInt },
        light: { type: GraphQLInt },
        pir: { type: GraphQLInt },
        vdd: { type: GraphQLInt },
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'Query',
    fields: {
        sensor: { type: new GraphQLList(SensorData) },
        dd: { type: DD }
    }
}
)
module.exports = new GraphQLSchema({
    query: RootQuery
})