const express = require('express');
const signUpRouter = express.Router();

const signUpController = require('../controllers/signUpController');

signUpRouter
    .route('/')
    .post(signUpController.createUser);

module.exports = signUpRouter;