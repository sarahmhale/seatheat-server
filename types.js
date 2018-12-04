const {
    GraphQLObjectType,
    GraphQLInt,
    GraphQLString,

} = require('graphql')

export const SensorData = new GraphQLObjectType({
    name: 'SensorData',
    fields: {
        time: { type: GraphQLString },
        ts: { type: GraphQLInt },
        dd: { type: dd }
    }
});

export const dd = new GraphQLObjectType({
    name: 'dd',
    fields: {
        temperature: { type: GraphQLInt },
        humidity: { type: GraphQLInt },
        light: { type: GraphQLInt },
        pir: { type: GraphQLInt },
        vdd: { type: GraphQLInt },

    }
});