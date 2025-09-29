// auth.routes.js

const express = require('express');
const router = express.Router();
const AuthMethods = require('../methods/auth.methods');
const authMiddleware = require('../utils/authMiddleware');
const { uploadAvatar } = require('../utils/imageUpload');

router.post('/register', uploadAvatar.single('avatar'), AuthMethods.register);
router.post('/login', AuthMethods.login);
router.get('/user', authMiddleware, AuthMethods.getUser);
router.delete('/logout', authMiddleware, AuthMethods.logout);

module.exports = router;