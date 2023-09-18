const usersRouter = require('./users');
const supplierRouter = require('./supplier');
const customerRouter = require('./customer');
const productRouter = require('./product')
const purchaseRouter = require('./purchase')
const purchaseArrivalPlanRouter = require('./purchaseArrivalPlan')
const stockRouter = require('./stock')
const inboundRouter = require('./inbound')

module.exports = [usersRouter, supplierRouter, productRouter, purchaseRouter, customerRouter, purchaseArrivalPlanRouter, stockRouter, inboundRouter];