const express = require('express');
const router = express.Router();
const authController = require('../Controllers/auth.controller');

/** 
 * @desc Register New User
 * @route /auth/register
 */
router.post('/register', authController.register);

/** 
 * @desc Login User
 * @route /auth/login
 */
router.post('/login', authController.login);

module.exports = router;