const express = require('express');
const loginRouter = express.Router();

const loginController = require('./../controllers/loginController');


loginRouter
    .route('/')
    .post(loginController.login)

module.exports = loginRouter