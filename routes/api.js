const express = require('express');
const router = express.Router();

const Tortilla = require('../models/Tortilla');

/* GET home page. */
router.get('/tortillas', async (req, res, next) => {
  const { username } = req.query;
  try {
    const alltortillas = await Tortilla.find().populate('creator');
    const filteredTortillas = alltortillas.filter(tortillas => {
      return tortillas.creator.username === username;
    });
    if (!filteredTortillas.length) {
      res.status(404);
      res.json({ message: 'Tortillas not found for that user' });
      return;
    }

    res.json(filteredTortillas);
  } catch (error) {
    next(error);
  }
});

router.post('/tortillas/create', async (req, res, next) => {
  const tortilla = req.body;
  if (!tortilla.size || !tortilla.name || !tortilla.special) {
    res.status(400);
    res.json({ message: 'Make sure you include name, size and special' });
    return;
  }
  tortilla.creator = '5c7d43a6969a25a12d596b11';
  try {
    await Tortilla.create(tortilla);
    res.status(204);
    res.json();
    res.redirect('/');
  } catch (error) {
    next(error);
  }
});

module.exports = router;
