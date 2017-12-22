'use strict'
const express = require('express');
const router = express.Router();
const logger = require('../logger');
const config = require('config');
const db = require('../db');

const apiRoutes = config.get('server.routes.api');
const apiTable = config.get("db.table.api.deliveries");
const apiDefaultPageSize = config.get("server.api.default_page_size")

/* GET home page. */
router.get(config.get('server.routes.index'), function (req, res, next) {
  res.render('index', {
    title: 'Express'
  });
});

/* GET deliveries BATCH*/
/* QUERY PARAMS:
 *    int page_size: limits batch size (when not set, default is used)
 *    bool from_last: retrieves values in order of last inserted for page_size when true.
 *    int start_id: used when from_last not true. retrieves rows with id <= start_id for page_size
 */
router.get(apiRoutes.get("deliveries"), function (req, res, next) {
  // If page_size not set assume default value
  const pageSize = req.query.page_size ? req.query.page_size : apiDefaultPageSize;

  if (req.query.from_last) {
    db.query(`SELECT * FROM ${apiTable} ORDER BY id DESC LIMIT $1`, [pageSize])
      .then((data) => {
        res.send(data.rows);
      })
      .catch((err) => {
        logger.error(err);
        next(err)
      });
    return;
  }

  if (!req.query.start_id) {
    const err = new Error("When page does not start from last a starting ID must be provided");
    return next(err);
  }

  db.query(`SELECT * FROM ${apiTable} WHERE id <= $1 ORDER BY id DESC LIMIT $2`, [req.query.start_id, pageSize])
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => {
      logger.error(err);
      next(err);
    });
});

/* GET deliveries SINGLE */
router.get(apiRoutes.get("deliveries") + ":id", function (req, res, next) {
  db.query(`SELECT * FROM ${apiTable} WHERE id = $1`, [req.params.id])
    .then((data) => {
      res.send(data.rows);
    })
    .catch((err) => {
      logger.error(err);
      next(err);
    });
})

/* POST deliveries */
router.post(apiRoutes.get("deliveries"), function (req, res, next) {
  if (!req.body.status) {
    const err = new Error("Delivery status not provided");
    return next(err);
  }
  if (!req.body.name) {
    const err = new Error("Delivery name not provided");
    return next(err);
  }

  db.query(`INSERT INTO ${apiTable} (status, name) VALUES ($1, $2) RETURNING *`, [req.body.status, req.body.name])
    .then((data) => {
      res.send(data.rows[0]);
    })
    .catch((err) => {
      logger.error(err);
      next(err);
    });
});

/* PUT deliveries */
router.put(apiRoutes.get("deliveries"), function (req, res, next) {
  db.query(`UPDATE ${apiTable} SET ${req.body.status ? "status = $1" : ""} ${req.body.name ? "name = $2" : ""} WHERE id = $3`, [req.body.status, req.body.name, req.params.id])
    .then((data) => {
      res.send("success");
    })
    .catch((err) => {
      loggger.error(err);
      next(err);
    });
});

/* DELETE deiveries */
router.delete(apiRoutes.get("deliveries") + ":id", function (req, res, next) {
  db.query(`DELETE FROM ${apiTable} WHERE id = $1`, [req.params.id])
    .then((data) => {
      res.send("success")
    })
    .catch((err) => {
      logger.error(err);
      next(err);
    });
});

module.exports = router;