const AssetsService = require('../services/assets.service');

const assetsService = new AssetsService();

module.exports = class AssetsController {
  getAssets(req, res) {
    const projectName = req.query.project;

    if (projectName === undefined) {
      res.status(400).send({
        message: 'Project name URL parameter is missing'
      });
    }else if (projectName === '') {
      res.status(400).send({
        message: 'URL parameter project is empty'
      });
    }else {
      const images = assetsService.getAssets(projectName);
      res.status(200).send({images: images});
    }  
  }
}