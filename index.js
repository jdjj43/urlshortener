require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }));

// Basic Configuration
const port = process.env.PORT || 3000;

//1  Conectar a mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGO_URI, { });

//2 Creamos el esquema para la base de datos
const urlShortSchema = new mongoose.Schema({
  url: { type: String, required: true }
});

// 3 creamos un objeto url
const UrlShort = mongoose.model("UrlShort", urlShortSchema);

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.post('/api/shorturl/', function (req, res) {
  //cheackear si existe en base de datos
  const execute = async() => {
    try {
      const data = await UrlShort.findOne({ url: req.body.url });
      if(!data) {
        UrlShort.create({
          url: req.body.url
        });
        const newData = await UrlShort.findOne({url: req.body.url});
        res.json({original_url: newData.url, short_url: newData._id});
      }
      if(data) {
        res.json({original_url: data.url, short_url: data._id});
      }
    } catch (error) {
      console.log(error);
    }
  }
  execute();
});

app.get('/api/shorturl/:id', (req, res) => {
  const execute = async() => {
    try {
      const data = await UrlShort.findById(req.params.id);
      res.redirect(data.url);
    } catch (error) {
      console.log(error);
    }
  }
  execute();
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
