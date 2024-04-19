const { Router } = require('express');
const AssetsController = require("../controllers/assets.controller");

const assetsController = new AssetsController();
const router = Router();

router.get('/images', assetsController.getAssets);

module.exports = router;