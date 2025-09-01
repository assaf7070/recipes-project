const express = require('express');
const router = express.Router();
const recipes = require('../controllers/recipesController');
const { validateRecipeBody } = require('../middlewares/validate');

// READ
router.get('/', recipes.list);
router.get('/:id', recipes.getById);

// CREATE
router.post('/', validateRecipeBody, recipes.create);

// UPDATE
router.put('/:id', validateRecipeBody, recipes.update);

// DELETE
router.delete('/:id', recipes.remove);


module.exports = router;
