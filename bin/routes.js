const express = require('express');
const authenticationController = require('../controllers/login');
const uploadController = require('../controllers/upload');
const listAppController = require('../controllers/listApp');
const emailController = require('../controllers/sendMail');
module.exports = (app) => {
  const authenticationRoutes = express.Router();
  const uploadRoutes = express.Router();
  const listAppRoutes = express.Router();
  //Authentication Routes
  authenticationRoutes.post('/login', authenticationController.login);

  listAppRoutes.get('/list', listAppController.getListApp);
  listAppRoutes.post('/send-mail', emailController.sendMail);

  // Upload Routes
  uploadRoutes.post('/upload', uploadController.Upload, uploadController.afterUpload);
  app.use('/api/v1', [authenticationRoutes, uploadRoutes, listAppRoutes]);
}