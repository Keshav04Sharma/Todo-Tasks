const mongodb  =require('mongoose');
const logging = require('../logging/logging');


// connect to MongoDB
const mongoConnect = async (apiReference, config) => {
    try {
        await mongodb.connect(config.url);
        logging.log(apiReference, {EVENT: "Connected to MongoDb", URL: config.url});
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error; // Rethrow the error to handle it later
    }
};

exports.mongoConnect= mongoConnect;