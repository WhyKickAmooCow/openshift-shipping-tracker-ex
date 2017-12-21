'use strict'
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const config = require('config');
const db = require('../db');

const apiPre = config.get('server.routes.api');

/* GET home page. */
router.get(config.get('server.routes.index'), function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET deliveries*/
router.get(apiPre + 'deliveries', function(req, res, next){ 
  if(req.query.id){
    db.query("SELECT * FROM deliveries WHERE id = $1", [req.query.id])
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        logger.error(err);
        res.send(err);
      });
  }
  
  if(!req.query.size) {    
  }

  if(req.query.start_id) {
    db.query("SELECT * FROM deliveries WHERE id < $1 LIMIT $2", [req.query.start_id, req.query.size])
      .then((data) => {
        res.send(data);
      })
      .catch((err) => {
        logger.error(err);
        res.send(err);
      });
  }
});

/* POST deliveries */
router.post(apiPre + 'deliveries', function(req, res, next) {
  if(!req.query.status){

  }
  if(!req.query.name){

  }

  db.query("INSERT INTO deliveries (status, name) VALUES ($1, $2)", [req.query.status, req.query.name])
    .then((data) => {
      res.send("success");
    })
    .catch((err) => {
      logger.error(err);
      res.send(err);
    });
});

module.exports = router;
