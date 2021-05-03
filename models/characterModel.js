const mongoose = require('mongoose');
const { Schema } = require("mongoose");

const Character = new Schema({
    name: {type:String},
    race: {type:String},
    class: {type:String},
    level: {type:Number},
    strength: {type:Number},
    agility: {type:Number},
    intellect: {type:Number},
    ishidden: {type:Boolean},
    imagename: {type:String}
}, {
    versionKey: false
});

module.exports = mongoose.model('Character', Character, 'characters');