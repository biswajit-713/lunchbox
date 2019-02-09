const _ = require('lodash');
const { validationResult } = require('express-validator/check');

const { User } = require('./../models/user');
const logger = require('./../config/log-config');

const userController = {
    CreateUser: (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            logger.error(`unable to create user with information ${JSON.stringify(req.body)} due to error ${JSON.stringify(errors.array())}`);
            return res.status(422).json({ errors: errors.array() })
        }

        const userBody = _.pick(req.body, ['type', 'email', 'password']);
        let user = new User(userBody);

        user.save()
            .then(user => {
                return user.generateAuthToken();
            }).then(token => {
                let returnValue = {id: user._id, email: user.email, type: user.type};
                logger.info(`user created successfully. ${JSON.stringify(returnValue)}`);
                res.status(201).header('x-auth', token).send(returnValue);
            })
            .catch(err => {
                logger.error(`unable to create user due to ${JSON.stringify(err)}`);
                res.status(400).send(err);
            })
    }
};

module.exports = userController;