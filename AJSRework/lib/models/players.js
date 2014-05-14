'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var PlayersSchema = new Schema({});



mongoose.model('Players', PlayersSchema, 'Players');
