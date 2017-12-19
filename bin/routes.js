const express = require('express');
const authenticationController = require('../controllers/login');
const uploadController = require('../controllers/upload');

module.exports = (app) => {
  const authenticationRoutes = express.Router();
  const uploadRoutes = express.Router();
  //Authentication Routes
  authenticationRoutes.post('/login', authenticationController.login);

  // Upload Routes
  uploadRoutes.post('/upload', uploadController.Upload, uploadController.afterUpload);
  app.use('/api/v1', [authenticationRoutes, uploadRoutes]);
}