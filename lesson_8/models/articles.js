const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articlesSchema = new Schema({
    title: {type: String},
    subtitle: {type: String},
    link: {type: String},
});

module.exports = mongoose.model('Articles', articlesSchema, 'articles');