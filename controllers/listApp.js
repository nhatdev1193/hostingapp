const listApp = require('../DB/listApp.json');
exports.getListApp = (req, res) => {
  res.json(listApp);
}