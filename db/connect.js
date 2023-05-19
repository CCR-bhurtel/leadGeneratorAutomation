const { MONGODB } = require('../config/keys');
const mongoose = require('mongoose');

const connectDB = () => {
    return new Promise((resolve, reject) => {
        mongoose
            .connect(MONGODB)
            .then(() => {
                resolve('Database Connected');
            })
            .catch((err) => {
                reject(err);
            });
    });
};

module.exports = connectDB;
