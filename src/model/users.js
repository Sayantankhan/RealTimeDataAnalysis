const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const collection = require("../../config/config");

const userSchema = new Schema({
    name: String,
    image_url: String,
    email: String,
    userId: String,
    accessToken: String,
    expiresIn: Number,
    reauthorize_required_in: Number,
    signedRequest: String
},{ collection: collection.mongoCollection[2]});

module.exports = mongoose.model(collection.mongoCollection[2], userSchema);