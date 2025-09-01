const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipesController');

// Read-only for Step 1A
router.get('/', recipes.list);
router.get('/:id', recipes.getById);

module.exports = router;
