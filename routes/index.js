'use strict'
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const config = require('config');

/* GET home page. */
router.get(config.get('server.routes.index'), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
