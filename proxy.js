const express = require('express');
const axios = require('axios');

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
      res.json(response.data);
    })
    .catch((error) => {
      console.error('Erro na requisição à API externa:', error.message);
      res.status(500).json({ error: 'Erro ao obter dados da API externa' });
    });
});

app.listen(PORT, () => {
  console.log(`Servidor proxy rodando em http://localhost:${PORT}`);
});
