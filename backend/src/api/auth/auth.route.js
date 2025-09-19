const express = require('express');
const router = express.Router();
const authController = require('./auth.controller');
const rateLimiter = require('../../middlewares/rateLimiter.middleware');

router.post('/register', rateLimiter, authController.registerUser);

router.post('/login', rateLimiter, authController.loginUser);

router.get('/activate/:token', authController.activateAccount);

router.post('/refresh-token', authController.refreshToken);

router.post('/logout', authController.logoutUser);

module.exports = router;