const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collection = require("../../config/config");

const resturantSchema = new Schema({
    CAMIS: String,
    ACTION: String,
    VIOLATION_CODE: String,
    VIOLATION_DESCRIPTION: String,
    CRITICAL_FLAG: String,
    SCORE: String,
    INSPECTION_TYPE: String,
    GRADE: String,
    GRADE_DATE: String,
    INSPECTION_TYPE: String,
    RECORD_DATE: String
},{ collection: collection.mongoCollection[1]});

module.exports = mongoose.model(collection.mongoCollection[1], resturantSchema);
