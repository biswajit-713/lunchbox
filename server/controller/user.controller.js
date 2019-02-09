const _ = require('lodash');
const { validationResult } = require('express-validator/check');

const { User } = require('./../models/user');

const userController = {
    CreateUser: (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).json({ errors: errors.array() })
        }

        const userBody = _.pick(req.body, ['type', 'email', 'password']);
        let user = new User(userBody);

        user.save()
            .then(user => {
                return user.generateAuthToken();
            }).then(token => {
                res.status(201).header('x-auth', token).send({id: user._id, email: user.email, type: user.type});
            })
            .catch(err => {
                res.status(400).send(err);
            })
    }
};

module.exports = userController;