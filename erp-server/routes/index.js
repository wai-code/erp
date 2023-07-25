
const usersRouter = require('./users');
const supplierRouter = require('./supplier');
const productRouter = require('./product')
const purchaseRouter = require('./purchase')

module.exports = [usersRouter, supplierRouter, productRouter, purchaseRouter];