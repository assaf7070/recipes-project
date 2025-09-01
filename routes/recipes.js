const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipesController');
const { validateRecipeBody } = require('../middlewares/validate');

router.get('/', recipes.list);
router.get('/:id', recipes.getById);
router.post('/', validateRecipeBody, recipes.create);


module.exports = router;
