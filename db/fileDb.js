const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '..', 'data', 'recipes.json');

async function readRecipes() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await fs.writeFile(DATA_FILE, '[]', 'utf-8');
      return [];
    }
    throw err;
  }
}

async function writeRecipes(recipes) {
  const json = JSON.stringify(recipes, null, 2);
  await fs.writeFile(DATA_FILE, json, 'utf-8');
}

module.exports = { readRecipes, writeRecipes };
