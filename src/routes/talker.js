const { Router } = require('express');

const { 
  isValidAuthorization,
  isValidName,
  isValidAge,
  isValidTalk,
  registration,
  isValidTalkRate,
  isValidTalkWatchedAt,
  isValidEditedPerson,
  removePerson,
  getAllTalkers, 
} = require('../middlewares/handleTalkers.js');

const talkerRoute = Router();
talkerRoute.get('/search', isValidAuthorization, async (req, res) => {
  const { q } = req.query;
  const talkers = await getAllTalkers();
  const search = talkers
    .filter((talker) => talker.name
    .includes(q));
    return res.status(200).json(search);
});

talkerRoute.get('/:id', async (req, res) => {
  const { id } = req.params;
  const users = await getAllTalkers();
  const useId = users.find((element) => element.id === Number(id));
  if (useId) {
    return res.status(200).json(useId);
  } 
  return res.status(404).send({ message: 'Pessoa palestrante não encontrada' });
});

talkerRoute.get('/', async (_req, res) => {
  const users = await getAllTalkers();
  if (users) {
     return res.status(200).json(users);
  } 
     return res.status(200).json([]);
});

talkerRoute.post('/', isValidAuthorization, isValidName, isValidAge, isValidTalk,
  isValidTalkWatchedAt, isValidTalkRate, registration, (req, res) => {
    const body = req;
    return res.status(200).json(body);
});

talkerRoute.put('/:id', isValidAuthorization, isValidName, isValidAge, isValidTalk,
isValidTalkWatchedAt, isValidTalkRate, isValidEditedPerson,
  (_req, res) => res.status(200));

talkerRoute.delete('/:id', isValidAuthorization, removePerson, (_req, res) => res.status(204));

module.exports = talkerRoute;