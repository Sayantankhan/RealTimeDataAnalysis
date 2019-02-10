const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collection = require("../../config/config");

const resturantSchema = new Schema({
    CAMIS: String,
    DBA: String,
    BORO: String,
    BUILDING: String,
    STREET: String,
    ZIPCODE: String,
    PHONE: String,
    CUISINE_DESCRIPTION: String
},{ collection: collection.mongoCollection[0]});

module.exports = mongoose.model(collection.mongoCollection[0], resturantSchema);