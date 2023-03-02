import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { query } from '../config/db';
import logger from '../utils/logger';
import emptyOrRows from '../utils/helpers';

export default function expressApp() {
  const app = express();
  const router = express.Router();

  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({ extended: true }));

  const routerBasePath = `/.netlify/functions/api/`;

  router.get('/', async (req, res, next) => {
    try {
      res.json(['Hello World']);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.get('/users', async (req, res, next) => {
    try {
      const sql = 'SELECT * FROM `Users`';
      const rows = await query(sql);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.post('/users', async (req, res, next) => {
    try {
      const sql =
        'INSERT INTO `Users` (uid, displayName, email, providerId, photoURL, creationTime, lastSignInTime, timesLoggedIn) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      const {
        uid,
        displayName,
        email,
        providerId,
        photoURL,
        creationTime,
        lastSignInTime,
        timesLoggedIn,
      } = req.body;
      const rows = await query(sql, [
        uid,
        displayName,
        email,
        providerId,
        photoURL,
        creationTime,
        lastSignInTime,
        timesLoggedIn,
      ]);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.put('/users', async (req, res, next) => {
    try {
      const sql =
        'UPDATE `Users` SET displayName = ?, lastSignInTime = ?, timesLoggedIn = ? WHERE `uid` = ?';
      const { displayName, lastSignInTime, timesLoggedIn, uid } = req.body;
      const rows = await query(sql, [
        displayName,
        lastSignInTime,
        timesLoggedIn,
        uid,
      ]);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.get('/user/:uid', async (req, res, next) => {
    try {
      const sql = 'SELECT * FROM `Users` WHERE `uid` = ?';
      const { uid } = req.params;
      const rows = await query(sql, [uid]);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.delete('/user/:uid', async (req, res, next) => {
    try {
      const sql = 'DELETE FROM `Users` WHERE `uid` = ?';
      const { uid } = req.params;
      const rows = await query(sql, [uid]);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.get('/access_logs', async (req, res, next) => {
    try {
      const sql = 'SELECT * FROM `Access_Logs`';
      const rows = await query(sql);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.get('/access_logs/:uid', async (req, res, next) => {
    try {
      const sql = 'SELECT `entry` FROM `Access_Logs` WHERE `uid` = ?';
      const { uid } = req.params;
      const rows = await query(sql, [uid]);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.post('/access_logs', async (req, res, next) => {
    try {
      const sql = 'INSERT INTO `Access_Logs` (uid, entry) VALUES (?, ?)';
      const { uid, entry } = req.body;
      const rows = await query(sql, [uid, entry]);
      const data = emptyOrRows(rows);
      res.json(data);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  router.get('*', async (req, res, next) => {
    try {
      res.status(404).json(['Invalid URL']);
    } catch (err) {
      res.status(500).json([]);
      next(err);
    }
  });

  app.use(morgan(logger));
  app.use(routerBasePath, router);

  return app;
}
