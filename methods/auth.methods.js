// auth.methods.js

const User = require('../models/User.model');
const Session = require('../models/Session.model');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const getImageFileType = require('../utils/getImageFileType');

exports.register = async (req, res) => {
  try {
    const { login, password, phone } = req.body;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';

    if( login && typeof login === 'string' && password && typeof password === 'string' && req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType) && phone && typeof phone === 'string') {

      const userWithLogin = await User.findOne({ login });
      if ( userWithLogin ) {
        if ( req.file ) fs.unlinkSync(req.file.path);
        return res.status(409).send({ message: 'User with this login already exists' });
      }
      const user = await User.create({ login, password: await bcrypt.hash(password, 10), avatar: req.file.filename, phone });
      res.status(201).send({ message: 'User created ' + user.login });
    } else {
      if ( req.file ) fs.unlinkSync(req.file.path);
      res.status(400).send({ message: 'Bad request' });
    }
  } catch (err) {
    if ( req.file ) fs.unlinkSync(req.file.path);
    res.status(500).send({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;
    if(login && typeof login === 'string' && password && typeof password === 'string') {
      const user = await User.findOne({ login });
      if (!user) {
        res.status(400).send('Login or password are incorrect');
      } else {
        if (bcrypt.compareSync(password, user.password)) {
            req.session.user = { 
                login: user.login, 
                id: user._id, 
                avatar: user.avatar, 
                phone: user.phone
            };
            res.status(200).send({ message: 'Login successfull'});
        } else {
            res.status(400).send('Login or password are incorrect');
        }
      }
    }
  } catch (err) {
    res.status(500).send({ message: err.message })
  }
};

exports.logout = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== "production") {
      await Session.deleteMany({});
      res.status(200).send({ message: 'Session closed!'}); 
    }
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.getUser = async (req, res) => {
  res.status(200).send({ user: req.session.user});
};