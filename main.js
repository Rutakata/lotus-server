const express = require('express');
const cors = require('cors');
const { dirname } = require('path');
const fs = require('fs');

const appDir = dirname(require.main.filename);
const app = express();

app.use(cors());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );
  next();
});

app.get('/images', (req, res) => {
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
    const projectDir = "D:/Lotus/client/public/" + projectName + '/assets';
    const images = [];

    fs.readdirSync(projectDir)
      .forEach(file => {
        const fileType = file.split('.')[1];

        if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
          images.push(`../../public/${projectName}/assets/${file}`);
        }
      });

    res.status(200).send({images: images});
  }  
})

app.listen(process.env.PORT || 3000)