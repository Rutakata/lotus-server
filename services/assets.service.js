const fs = require('fs');

module.exports = class AssetsService {
  getAssets(projectName) {
    const projectDir = process.env.PROJECTS_DIR + projectName + '/assets';
    const images = [];

    fs.readdirSync(projectDir)
      .forEach(file => {
        const fileType = file.split('.')[1];

        if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
          images.push(`../../public/${projectName}/assets/${file}`);
        }
      });
    
    return images;
  }
}