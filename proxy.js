const express = require('express');
const axios = require('axios');
const IMAGE_INFO = require('./src/assets/fruit_image_info.json');

const app = express();
const PORT = 9010;

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:9000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.get('/api/fruit/all', (req, res) => {
  const apiURL = 'https://www.fruityvice.com/api/fruit/all';

  axios.get(apiURL)
    .then((response) => {
      response_data = []
      response.data.forEach(fruit => {
        fruit_element = fruit;

        const img_info = IMAGE_INFO[fruit_element['name']]
        if (img_info) {
          fruit_element['image_info'] = img_info
        } else {
          fruit_element['image_info'] = IMAGE_INFO['default']
        }

        response_data.push(fruit_element);
      });
      res.json(response_data);
    })
    .catch((error) => {
      console.error('Erro na requisição à API externa:', error.message);
      res.status(500).json({ error: 'Erro ao obter dados da API externa' });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor proxy rodando em http://localhost:${PORT}`);
});
