const express = require('express');
const UserDB = require('../DB/user.json');
const _ = require('lodash');

exports.login = (req, res) => {
  const userParams = {
    email: req.body.username,
    password: req.body.password
  }
  const user = _.find(UserDB, (user) => {
    return _.isEqual(user, userParams)
  });

  if (user) {
    res.status(200).send('Login Successfull')
  } else {
    res.status(403).send('Login Again')
  }
};
