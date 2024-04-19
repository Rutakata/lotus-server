const { Router } = require('express');
const assetsRouter = require('./assets.router');

const router = Router();

router.use('/assets', assetsRouter);

module.exports.router = router;