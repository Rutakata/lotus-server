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
app.use(express.json());

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', `http://localhost:${process.env.CLIENT_PORT}`);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/assets', (req, res) => {
  const projectFolder = req.query.project;

  if (projectFolder === undefined) {
    res.status(400).send({
      message: 'Project name URL parameter is missing'
    });
  }else if (projectFolder === '') {
    res.status(400).send({
      message: 'URL parameter project is empty'
    });
  }else {
    const projectDir = process.env.PROJECTS_DIR + projectFolder + '/assets';
    const assets = [];

    fs.readdirSync(projectDir)
      .forEach(file => {
        const fileType = file.split('.')[1];

        if (fileType === 'jpg' || fileType === 'png' || fileType === 'jpeg') {
          assets.push(`../../public/${projectFolder}/assets/${file}`);
        }
      });

    res.status(200).send({assets});
  }  
})

app.get('/projects', (req, res) => {
  const projects = fs
    .readdirSync(process.env.PROJECTS_DIR)
    .filter(function (file) {
      return fs.statSync(process.env.PROJECTS_DIR+'/'+file).isDirectory();
    });

  res.status(200).send({projects});
})

app.post('/projects/create', (req, res) => {
  const projectFolder = req.query.project;
  const projectName = req.body.projectName;

  const config = {
    projectName
  }

  if (projectName === undefined) {
    res.status(400).send({
      message: 'Project name URL parameter is missing'
    });
  }else if (projectName === '') {
    res.status(400).send({
      message: 'URL parameter project is empty'
    });
  }else {
    const projectDir = process.env.PROJECTS_DIR + projectFolder;

    if (!fs.existsSync(projectDir)){
      fs.mkdirSync(projectDir);
      fs.mkdirSync(projectDir + '/assets');
      fs.mkdirSync(projectDir + '/scenes');
      fs.mkdirSync(projectDir + '/text');
      fs.mkdirSync(projectDir + '/audio');
      fs.writeFileSync(projectDir+'/config.json', JSON.stringify(config), err => {
        if (err) {
          console.log(err);
        }
      });
      res.status(200).send({status: SUCCESS});
    }else {
      res.status(400).send({status: 'Project exists'});
    }    
  }
})

app.get('/project/info', (req, res) => {
  const projectFolder = req.query.project;

  if (projectFolder === undefined) {
    res.status(400).send({
      message: 'Project URL parameter is missing'
    });
  }else if (projectFolder === '') {
    res.status(400).send({
      message: 'URL parameter project is empty'
    });
  }else {
    try {
      const data = fs.readFileSync(process.env.PROJECTS_DIR + projectFolder + '/config.json');
      res.status(200).send({data: JSON.parse(data)});
    }catch(error) {
      res.status(400).send({message: 'Error'});
    }
  }
})

app.get('/project/scenes', (req, res) => {
  const projectName = req.query.project;
  // const scene_id = req.query.id;

  if (projectName === undefined) {
    res.status(400).send({
      message: 'Project name URL parameter is missing'
    });
  }else if (projectName === '') {
    res.status(400).send({
      message: 'URL parameter project is empty'
    });
  }else {
    const projectDir = process.env.PROJECTS_DIR + projectName + '/scenes';

    const scenes = [];

    fs.readdirSync(projectDir)
      .forEach(file => {
        const fileType = file.split('.')[1];

        if (fileType === 'json') {
          scenes.push(file);
        }
      });

    res.status(200).send({scenes});
  }
})

app.get('/project/text', (req, res) => {
  const projectFolder = req.query.project;
  // const scene_id = req.query.id;

  if (projectFolder === undefined) {
    res.status(400).send({
      message: 'Project name URL parameter is missing'
    });
  }else if (projectFolder === '') {
    res.status(400).send({
      message: 'URL parameter project is empty'
    });
  }else {
    const projectDir = process.env.PROJECTS_DIR + projectFolder + '/text';

    const text = [];

    fs.readdirSync(projectDir)
      .forEach(file => {
        const fileType = file.split('.')[1];

        if (fileType === 'json') {
          const data = fs.readFileSync(projectDir + "/" + file);
          text.push(JSON.parse(data));
        }
      });

    res.status(200).send(text);
  }
})

app.get('/project/audio', (req, res) => {
  const projectName = req.query.project;
  // const scene_id = req.query.id;

  if (projectName === undefined) {
    res.status(400).send({
      message: 'Project name URL parameter is missing'
    });
  }else if (projectName === '') {
    res.status(400).send({
      message: 'URL parameter project is empty'
    });
  }else {
    const projectDir = process.env.PROJECTS_DIR + projectName + '/audio';

    const audio = [];

    fs.readdirSync(projectDir)
      .forEach(file => {
        const fileType = file.split('.')[1];

        if (fileType === 'json') {
          audio.push(file);
        }
      });

    res.status(200).send({audio});
  }
})

app.listen(process.env.PORT || 3000)