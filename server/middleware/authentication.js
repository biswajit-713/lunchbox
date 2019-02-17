const {User} = require('./../models/user');
const { MESSAGE_CONSTANTS } = require('./../constants/app-constants');

const authenticateRequest = (req, res, next) => {
    let token = req.header('x-auth');
    
    User.findByToken(token)
        .then((user) => {
            if (!user) {
                return Promise.reject({statusCode: 404});
            }
            req.body.userEmail = user.email;
            req.body.userType = user.type;
            next();
        }).catch(err => {
            console.log(err.statusCode);
            if (err.statusCode == 404) {
                return Promise.reject({statusCode: err.statusCode, message: MESSAGE_CONSTANTS.USER_NOT_FOUND});
            }
            next();
        });
}

module.exports = { authenticateRequest };