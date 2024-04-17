const express = require('express');
const cors = require('cors');
const { dirname } = require('path');

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
  res.send(`../../public/testing/assets/example.png`);
})

app.listen(process.env.PORT || 3000)