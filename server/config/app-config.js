const env = process.env.NODE_ENV || 'development';

if (env === 'development' || env === 'test') {
    let envConfig = require('./config.json');
    let config = envConfig[env];
    
    Object.keys(config).forEach(key => {
        process.env[key] = config[key];
    });
}
