const mongoose = require('mongoose');
const validator = require('validator');

const { MESSAGE_CONSTANTS } = require('./../constants/app-constants');
const logger = require('./../config/log-config');

const MealSchema = new mongoose.Schema({
    chef: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['breakfast', 'lunch', 'dinner']
    },
    diet: {
        type: String,
        default: 'non veg'
    },
    cuisine: {
        type: String
    },
    image: {
        type: String
    },
    options: [{
        description: {
            type: String,
            required: true
        },
        price: {
            required: true,
            type: String
        }
    }]
});

MealSchema.pre('save', function(next) {
    let meal = this;

    meal.options.forEach(element => {
        element.price = Number(element.price).toFixed(2);
    });
    next();
});

const Meal = mongoose.model('meal', MealSchema);

module.exports = { Meal };