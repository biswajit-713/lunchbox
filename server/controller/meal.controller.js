const _ = require('lodash');

const { Meal } = require('./../models/meal');
const logger = require('./../config/log-config');
const { MESSAGE_CONSTANTS } = require('./../constants/app-constants');

const CHEF = 'chef';

const mealController = {
    CreateMeal: (req, res) => {
        if (req.body.userType.toLowerCase() !== CHEF) {
            return Promise.reject({statusCode: 403});
        }
        let mealBody = _.pick(req.body, ['userEmail', 'type', 'diet', 'cuisine', 'image', 'options']);
        mealBody.chef = mealBody.userEmail;
        let meal = new Meal(mealBody);

        meal.save()
            .then(meal => {
                logger.info(`Meal ${meal._id} created by ${meal.chef}`);
                return res.status(201).send({id: `${meal._id}`});
            }).catch(err => {
                logger.error(`error while creating meal. ${JSON.stringify(err)}`);
                logger.error(`Unable to create meal ${JSON.stringify(mealBody)}`);
                return res.status(500).send({message: MESSAGE_CONSTANTS.INTERNAL_SERVER_ERROR});
            });
    }
};

module.exports = mealController;