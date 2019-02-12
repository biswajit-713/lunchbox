const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { MESSAGE_CONSTANTS } = require('./../constants/app-constants');
const logger = require('./../config/log-config');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['chef', 'customer']
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

UserSchema.pre('save', function(next) {
    let user = this;

    if (user.isModified('password')) {
        logger.info(`password has been modified for ${user.email}`);
        bcrypt.genSalt(5, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                logger.info(`password successfully updated for ${user.email}`);
                next();
            });
        });
    } else {
        next();
    }
});

UserSchema.methods.generateAuthToken = function() {
    let user = this;

    let access = 'auth';
    let token = jwt.sign({_id: user._id, access}, `${process.env.JWT_SECRET}`, {expiresIn: '1h'});

    if (user.tokens.length === 0) {
        user.tokens.push({access, token});
    } else {
        user.tokens[0].access = access;
        user.tokens[0].token = token;
    }
    logger.info(`auth token has been generated for ${user.email}`);

    return user.save()
        .then(() => token);
};

UserSchema.methods.toJSON = function() {
    let user = this;

    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email', 'type']);
}

UserSchema.statics.findByCredential = function(requestBody) {
    let User = this;

    return User.findOne({email: requestBody.email, type: requestBody.type})
        .then(user => {
            if (!user) {
                logger.error(`${requestBody.email} not found`);
                return Promise.reject({statusCode: 404});
            }
            if (bcrypt.compareSync(requestBody.password, user.password)) {
                return user.generateAuthToken()
                    .then(token => {
                        logger.info(`${user.email} found in database`);
                        return token;
                    });
            } else{
                logger.error(`${user.email} could not be authenticated`);
                return Promise.reject({statusCode: 401});
            }
        }).catch(err => {
            if (err.statusCode === 404) {
                return Promise.reject({statusCode: err.statusCode, message: MESSAGE_CONSTANTS.USER_NOT_FOUND});
            } else if (err.statusCode === 401) {
                return Promise.reject({statusCode: err.statusCode, message: MESSAGE_CONSTANTS.AUTHENTICATION_FAILED});
            } else {
                logger.error(`${err}`);
                return Promise.reject({statusCode: 500, message: MESSAGE_CONSTANTS.INTERNAL_SERVER_ERROR});
            }
        })
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };