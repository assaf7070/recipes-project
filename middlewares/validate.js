const { DIFFICULTIES } = require('../models/recipe');

function isNonEmptyString(v, min = 1, max = Infinity) {
  return typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;
}

function isArrayOfNonEmptyStrings(v) {
  return Array.isArray(v) && v.length > 0 && v.every(s => typeof s === 'string' && s.trim().length > 0);
}

function isPositiveNumber(v) {
  return typeof v === 'number' && Number.isFinite(v) && v > 0;
}

function isPositiveInteger(v) {
  return Number.isInteger(v) && v > 0;
}

function validateRecipeBody(req, res, next) {
  const b = req.body;
  const errors = [];

  if (!b || typeof b !== 'object') {
    return res.status(400).json({ error: true, message: 'Body must be a JSON object', statusCode: 400 });
  }

  // title: 3-100
  if (!isNonEmptyString(b.title, 3, 100)) errors.push('title must be 3-100 chars');

  // description: 10-500
  if (!isNonEmptyString(b.description, 10, 500)) errors.push('description must be 10-500 chars');

  // ingredients: array of non-empty strings, at least 1
  if (!isArrayOfNonEmptyStrings(b.ingredients)) errors.push('ingredients must be a non-empty array of strings');

  // instructions: array of non-empty strings, at least 1
  if (!isArrayOfNonEmptyStrings(b.instructions)) errors.push('instructions must be a non-empty array of strings');

  // cookingTime: positive number
  if (!isPositiveNumber(b.cookingTime)) errors.push('cookingTime must be a positive number');

  // servings: positive integer
  if (!isPositiveInteger(b.servings)) errors.push('servings must be a positive integer');

  // difficulty: one of easy/medium/hard
  const diff = String(b.difficulty || '').toLowerCase();
  if (!DIFFICULTIES.includes(diff)) errors.push(`difficulty must be one of: ${DIFFICULTIES.join(', ')}`);

  // rating: optional number 0-5
  if (b.rating !== undefined) {
    const r = Number(b.rating);
    if (!Number.isFinite(r) || r < 0 || r > 5) errors.push('rating must be a number between 0 and 5');
  }

  if (errors.length) {
    return res.status(400).json({ error: true, message: errors.join('; '), statusCode: 400 });
  }

  // normalize trimmed strings/arrays (light clean-up)
  req.validated = {
    title: b.title.trim(),
    description: b.description.trim(),
    ingredients: b.ingredients.map(s => s.trim()),
    instructions: b.instructions.map(s => s.trim()),
    cookingTime: Number(b.cookingTime),
    servings: Number(b.servings),
    difficulty: diff,
    ...(b.rating !== undefined ? { rating: Number(b.rating) } : {})
  };

  next();
}

module.exports = { validateRecipeBody };
