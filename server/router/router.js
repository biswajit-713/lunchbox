const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { check } = require('express-validator/check');

const UserController = require('./../controller/user.controller');
const MealController = require('./../controller/meal.controller');

router.use(bodyParser.json());

router.post('/user', [
    check('email').isEmail(),
    check('password').isLength({ min: 6 }),
    check('password').isAlphanumeric(),
    check('password').matches(/[A-Z]/),
    check('password').matches(/[a-z]/),
    check('password').matches(/[0-9]/),
], UserController.CreateUser);

module.exports = router;