const { readRecipes, writeRecipes } = require('../db/fileDb');
const { v4: uuidv4 } = require('uuid');

// GET /api/recipes
async function list(req, res, next) {
    try {
        const all = await readRecipes();
        const { difficulty, maxCookingTime, search } = req.query;
        let result = all;

        if (difficulty) {
            result = result.filter(r => String(r.difficulty).toLowerCase() === String(difficulty).toLowerCase());
        }
        if (maxCookingTime) {
            const max = Number(maxCookingTime);
            if (!Number.isFinite(max) || max <= 0) {
                return res.status(400).json({ error: true, message: 'maxCookingTime must be a positive number', statusCode: 400 });
            }
            result = result.filter(r => Number(r.cookingTime) <= max);
        }
        if (search) {
            const s = String(search).toLowerCase();
            result = result.filter(r =>
                String(r.title || '').toLowerCase().includes(s) ||
                String(r.description || '').toLowerCase().includes(s)
            );
        }

        res.json(result);
    } catch (e) {
        next(e);
    }
}

// GET /api/recipes/:id
async function getById(req, res, next) {
    try {
        const all = await readRecipes();
        const found = all.find(r => r.id === req.params.id);
        if (!found) {
            return res.status(404).json({ error: true, message: 'Recipe not found', statusCode: 404 });
        }
        res.json(found);
    } catch (e) {
        next(e);
    }
}

// POST /api/recipes
async function create(req, res, next) {
    try {
        const data = req.validated; // from validate middleware
        const all = await readRecipes();

        const newRecipe = {
            id: uuidv4(),
            ...data,
            createdAt: new Date().toISOString()
        };

        all.push(newRecipe);
        await writeRecipes(all);

        res.status(201).json(newRecipe);
    } catch (e) {
        next(e);
    }
}


// PUT /api/recipes/:id  (full update; uses same validation as POST)
async function update(req, res, next) {
    try {
        const all = await readRecipes();
        const idx = all.findIndex(r => r.id === req.params.id);
        if (idx === -1) {
            return res.status(404).json({ error: true, message: 'Recipe not found', statusCode: 404 });
        }

        const current = all[idx];
        const data = req.validated; // full, validated payload

        const updated = {
            ...current,               // keep anything non-updated (e.g., createdAt if not in schema)
            ...data,                  // apply new fields
            id: current.id,           // never change id
            createdAt: current.createdAt // preserve original creation time
        };

        all[idx] = updated;
        await writeRecipes(all);
        res.json(updated);
    } catch (e) { next(e); }
}

// DELETE /api/recipes/:id
async function remove(req, res, next) {
    try {
        const all = await readRecipes();
        const idx = all.findIndex(r => r.id === req.params.id);
        if (idx === -1) {
            return res.status(404).json({ error: true, message: 'Recipe not found', statusCode: 404 });
        }

        all.splice(idx, 1);
        await writeRecipes(all);
        res.status(204).send();
    } catch (e) { next(e); }
}

module.exports = { list, getById, create, update, remove };
