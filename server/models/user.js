const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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
        bcrypt.genSalt(5, (err, salt) => {
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
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

    user.tokens.push({access, token});

    return user.save()
        .then(() => token);
};

UserSchema.methods.toJSON = function() {
    let user = this;

    let userObject = user.toObject();
    return _.pick(userObject, ['_id', 'email', 'type']);
}

const User = mongoose.model('User', UserSchema);

module.exports = { User };