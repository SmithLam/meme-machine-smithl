const fs = require("fs");
const path = require("path")

const pathtoData = path.join(__dirname, "../dataOG.json");
const pathtoMemes = path.join(__dirname, "../meme.json");

const loadOriginals = () => {
  try {
    const buffer = fs.readFileSync(pathtoData);
    const string = buffer.toString();
    return JSON.parse(string);
  } catch (err) {
    return [];
  }
};

const loadMemes = () => {
  try {
    const buffer = fs.readFileSync(pathtoMemes);
    const string = buffer.toString();
    return JSON.parse(string);
  } catch (err) {
    return [];
  }
};

const saveOriginals = (data) => {
  fs.writeFileSync(pathtoData, JSON.stringify(data));
};

const saveMemes = (data) => {
  fs.writeFileSync(pathtoMemes, JSON.stringify(data));
};

module.exports = { loadOriginals, loadMemes, saveOriginals, saveMemes };
