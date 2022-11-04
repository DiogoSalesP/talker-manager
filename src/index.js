const express = require('express');
const bodyParser = require('body-parser');
const { getAllTalkers } = require('./utils/handleTalkers');

const app = express();
app.use(bodyParser.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const users = await getAllTalkers();
  if (users) {
     return res.status(200).json(users);
  } 
     return res.status(200).json([]);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const users = await getAllTalkers();
  const useId = users.find((element) => element.id === Number(id));
  if (useId) {
    return res.status(200).json(useId);
  } 
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});