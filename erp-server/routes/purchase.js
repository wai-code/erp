const express = require('express');
const { body, validationResult } = require('express-validator');
const { openDB, closeDb } = require('../db');
const router = express.Router();
const _ = require('lodash');


module.exports = router;