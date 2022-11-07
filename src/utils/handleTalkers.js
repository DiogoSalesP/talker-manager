const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

function generateToken() {
  return crypto.randomBytes(8).toString('hex');
}

const userPath = path.resolve(__dirname, '../talker.json');

const getAllTalkers = async () => {
  const response = await fs.readFile(userPath, 'utf-8');
  const users = JSON.parse(response);
  return users;
};

const isValidAuthorization = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ message: 'Token não encontrado' });
  }
  if (authorization.length !== 16 || typeof authorization !== 'string') {
    return res.status(401).json({ message: 'Token inválido' });
  } 

  return next();
};

const isValidName = (req, res, next) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: 'O campo "name" é obrigatório' });
  }
  if (name.length < 3) {
    return res.status(400).json({ message: 'O "name" deve ter pelo menos 3 caracteres' });
  }
  return next();
};

const isValidAge = (req, res, next) => {
  const { age } = req.body;

  if (!age) {
    return res.status(400).json({ message: 'O campo "age" é obrigatório' });
  }
  if (age < 18) {
     return res.status(400).json({ message: 'A pessoa palestrante deve ser maior de idade' });
  }
  
  return next();
};

const isValidTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
    return res.status(400).json({ message: 'O campo "talk" é obrigatório' });
  }

  return next();
};

const isValidTalkWatchedAt = (req, res, next) => {
  const { talk } = req.body;
  const talkWatchedAtValidate = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/;

  if (!talk.watchedAt) {
    return res.status(400).json({ message: 'O campo "watchedAt" é obrigatório' });
  }
  if (!talkWatchedAtValidate.test(talk.watchedAt)) {
    return res.status(400).json({ message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"' });
  }

  return next();
};

const isValidTalkRate = (req, res, next) => {
  const { talk } = req.body;
  if (talk.rate === undefined) {
    return res.status(400).json({ message: 'O campo "rate" é obrigatório' });
  }
  if (talk.rate > 5 || talk.rate < 1 || !Number.isInteger(talk.rate)) {
    return res.status(400).json({ message: 'O campo "rate" deve ser um inteiro de 1 à 5' });
  }

  return next();
};

const registration = async (req, res, next) => {
  const talker = await getAllTalkers();
  const { name, age, talk } = req.body;
  const newData = {
    id: talker[talker.length - 1].id + 1,
    name,
    age,
    talk,
  };
  const allDate = JSON.stringify([...talker, newData]);
  await fs.writeFile(userPath, allDate);
  res.status(201).json(newData);

  return next();
};

const isValidEditedPerson = async (req, res, next) => {
  const talker = await getAllTalkers();
  const useId = req.params.id;
  const { name, age, talk } = req.body;
  const newTalker = talker.find((ele) => ele.id === Number(useId));
  if (newTalker) {
    newTalker.id = Number(useId);
    newTalker.name = name;
    newTalker.age = age;
    newTalker.talk = talk;
  } 
  const allDate = JSON.stringify([...talker, newTalker]);
  await fs.writeFile(userPath, allDate);
  res.status(200).json(newTalker);

  return next();
};

  const removePerson = async (req, res, next) => {
    const talker = await getAllTalkers();
    const useId = req.params.id;
    const newTalker = talker.filter((element) => element.id !== Number(useId));
    const allDate = JSON.stringify(newTalker);
    await fs.writeFile(userPath, allDate);
    res.status(204).end();

    return next();
  };

 module.exports = {
  getAllTalkers,
  isValidAuthorization,
  isValidName,
  isValidAge,
  isValidTalk,
  isValidTalkRate,
  isValidTalkWatchedAt,
  registration,
  generateToken,
  isValidEditedPerson,
  removePerson,
 };