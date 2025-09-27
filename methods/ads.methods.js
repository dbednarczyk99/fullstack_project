// ads.methods.js

const Ad = require('../models/Ad.model');

exports.getAll = async (req, res) => {
  try {
    res.json(await Ads.find());
  }
  catch(err) {
    res.status(500).json({ message: err });
  }
};

exports.getById = async (req, res) => {
  try {
    const ad = await Ads.findById(req.params.id);
    if(!ad) res.status(404).json({ message: 'Not found' });
    else res.json(ad);
  }
  catch(err) {
    res.status(500).json({ message: err });
  }  
};

exports.post = async (req, res) => {
  try {
    const newAd = new Ads({ 
      title: req.body.performer, 
      content: req.body.genre, 
      publishedDate: new Date(),
      image: req.body.day,
      price: req.body.image,
      location: req.body.location,
      author: req.body.author });
    await newAd.save();
    res.json({ message: 'OK' });
  } catch(err) {
    res.status(500).json({ message: err });
  }  
};

exports.modify = async (req, res) => {
  try {
    const ad = await Ads.findById(req.params.id);
    if(ad) {
      await Ads.updateOne({ _id: req.params.id }, 
        { $set: {title: req.body.performer, 
          content: req.body.genre, 
          publishedDate: new Date(),
          image: req.body.day,
          price: req.body.image,
          location: req.body.location,
          author: req.body.author} 
        });
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }    
};

exports.delete = async (req, res) => {
  try {
    const deleteAd = await Ads.findByIdAndDelete(req.params.id);
    if(deleteAd) {
      res.json({ message: 'OK' });
    }
    else res.status(404).json({ message: 'Not found...' });
  }
  catch(err) {
    res.status(500).json({ message: err });
  }  
};