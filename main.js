require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { dirname } = require('path');
const fs = require('fs');
const router = require('./routes/routes.router');

const appDir = dirname(require.main.filename);
const app = express();

const SUCCESS = 'SUCCESS';
const ERROR = 'ERROR';

app.use(cors());
// app.use(router);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', `http://localhost:${process.env.CLIENT_PORT}`);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/assets', (req, res) => {
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
    const projectDir = process.env.PROJECTS_DIR + projectName + '/assets';
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

app.get('/projects/create', (req, res) => {
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
    const projectDir = process.env.PROJECTS_DIR + projectName;

    if (!fs.existsSync(projectDir)){
      fs.mkdirSync(projectDir);
      fs.mkdirSync(projectDir + '/assets');
      res.status(200).send({status: SUCCESS});
    }else {
      res.status(400).send({status: ''});
    }    
  }
})

app.listen(process.env.PORT || 3000)