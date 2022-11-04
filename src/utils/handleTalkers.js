const { readFile } = require('fs').promises;
const path = require('path');

const userPath = path.resolve(__dirname, '../talker.json');

const getAllTalkers = async () => {
  const response = await readFile(userPath, 'utf-8');
  const users = JSON.parse(response);
  console.log(users);
  return users;
};
 module.exports = {
  getAllTalkers,
 };