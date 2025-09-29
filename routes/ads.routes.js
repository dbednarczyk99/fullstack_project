// ads.routes.js

const express = require('express');
const router = express.Router();
const AdsMethods = require('../methods/ads.methods');
const { uploadAdImage } = require('../utils/imageUpload');

router.get('/ads', AdsMethods.getAll);
router.get('/ads/:id', AdsMethods.getById);
router.post('/ads', uploadAdImage.single('adImage'), AdsMethods.post);
router.delete('/ads/:id', AdsMethods.delete);
router.put('/ads/:id', AdsMethods.modify);
//router.get('/ads/search/:searchPhrase', AdsMethods.searchResults);

module.exports = router;