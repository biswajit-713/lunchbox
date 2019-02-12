const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true,
                server: { socketOptions: {connectTimeoutMS: 0, socketTimeoutMS: 0}} });
mongoose.set('bufferCommands', false);
module.exports = {
    mongoose
};