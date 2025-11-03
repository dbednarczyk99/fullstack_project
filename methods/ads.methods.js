// ads.methods.js

const Ad = require('../models/Ad.model');
const getImageFileType = require('../utils/getImageFileType');
const fs = require('fs');

exports.getAll = async (req, res) => {
  try {
    res.json(await Ad.find().populate('author'));
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id).populate('author');
    if(!ad) res.status(404).json({ message: 'Not found' });
    else res.json(ad);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }  
};

exports.post = async (req, res) => {
  try {
    const { title, content, price, location, author } = req.body;
    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';

    if (
      title && typeof title === 'string'
      && content && typeof content === 'string'
      && req.file && ['image/png', 'image/jpeg', 'image/gif'].includes(fileType)
      && price && typeof price === 'string'
      && location && typeof location === 'string'
      && author && typeof author === 'string'
    ) {
      const newAd = await Ad.create({ 
        title, 
        content,
        publishedDate: new Date(),
        image: req.file.filename,
        price,
        location,
        author 
      });
      return res.status(201).send({ message: 'Ad created', adId: newAd._id});

    } else {
      if ( req.file ) fs.unlinkSync(req.file.path);
      return res.status(400).send({ message: 'Bad request' });
    }

  } catch(err) {
    if ( req.file ) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err });
  }  
};

exports.modify = async  (req, res) => {
  try {
    const { title, content, price, location, author } = req.body;
    const ad = await Ad.findById(req.params.id);
    console.log(ad);
    console.log(req);

    if (!ad) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Ad not found' });
    }

    const fileType = req.file ? await getImageFileType(req.file) : 'unknown';

    const priceOk = price !== undefined && (typeof price === 'string' || typeof price === 'number');
    const authorOk = author !== undefined && (typeof author === 'string' || typeof author === 'object');

    console.log(title, content, price, location, author);
    if (
      title && typeof title === 'string'

    ) {
      let updatedFields = {
        title,
        content,
        publishedDate: new Date(),
        price,
        location,
        author
      };

      if (req.file) {
        if (['image/png', 'image/jpeg', 'image/gif'].includes(fileType)) {
          updatedFields.image = req.file.filename;

          if (ad.image) {
            const oldImagePath = `./public/uploads/${ad.image}`;
            if (fs.existsSync(oldImagePath)) {
              fs.unlinkSync(oldImagePath);
            }
          }
        } else {
          fs.unlinkSync(req.file.path);
          return res.status(400).json({ message: 'Invalid file type' });
        }
      }
      const updatedAd = await Ad.findByIdAndUpdate(
        req.params.id,
        { $set: updatedFields },
        { new: true }
      ).populate('author');
      return res.status(201).send({ message: 'Ad edited', adId: updatedAd._id });

    } else {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Bad request' });
    }
  } catch (err) {
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: err });
  }
};


exports.delete = async (req, res) => {
  try {
    const deleteAd = await Ad.findByIdAndDelete(req.params.id);
    if(deleteAd) {
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }  
};

exports.getSearch = async (req, res) => {
  try {
    const { title } = req.query;
    if(title && typeof title === 'string') {
      const searchResults = await Ad.find({ title: { $regex: title, $options: 'i' } }).populate('author');
      res.json(searchResults);
    } else {
      res.status(400).json({ message: 'Bad request' });
    }
  } catch(err) {
    res.status(500).json({ message: err });
  }
};