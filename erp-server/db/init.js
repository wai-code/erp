const sqlite3 = require('sqlite3').verbose();
const config = require('./config');
const fs = require('fs');

// 打开数据库连接
const sql = `
CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  phone TEXT,
  email TEXT,
  password TEXT,
  image BLOB
);

CREATE TABLE IF NOT EXISTS role (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_role (
  id INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  role_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resource (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  label TEXT NOT NULL,
  icon TEXT,
  type TEXT,
  url TEXT,
  parent_id INTEGER
);

CREATE TABLE IF NOT EXISTS permission (
  id INTEGER PRIMARY KEY,
  role_name TEXT NOT NULL,
  resource_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS supplier (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  contact_name TEXT,
  contact_email TEXT,
  contact_phone TEXT,
  other TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT
);

CREATE TABLE IF NOT EXISTS product (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  standard TEXT,
  supplier_name TEXT,
  purchase_price DECIMAL(10, 2),
  sales_price DECIMAL(10, 2),
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT,
  CONSTRAINT unique_product UNIQUE (name, model)
);

CREATE TABLE IF NOT EXISTS purchase (
  id INTEGER PRIMARY KEY,  -- 主键ID
  order_id TEXT,			-- 关联的三方ID
  type TEXT,       -- 采购类型：// 配件 or 产品
  product_id number,        -- 产品ID
  unit_price DECIMAL(10, 2),  -- 单价（金额，10位整数，2位小数）
  purchase_quantity INTEGER,  -- 采购数量
  plan_quantity INTEGER,  -- 计划发货数量
  arrival_quantity INTEGER,   -- 实际到货数量
  loss_quantity INTEGER,      -- 损耗数量
  pass_rate DECIMAL(2, 6),        -- 产品良率（小数，2位整数，6位小数）
  order_date DATE,            -- 下单日期
  plan_arrival_date DATE,     -- 计划最后到货日期
  last_arrival_date DATE,     -- 实际最后到货日期
  purchase_cycle INTEGER,     -- 采购周期（天数）
  shipping_method TEXT,       -- 运输方式
  shipping_cost DECIMAL(10, 2),  -- 运费（金额，10位整数，2位小数）
  other_cost DECIMAL(10, 2),    -- 其他费用（金额，10位整数，2位小数）
  is_completed BOOLEAN,         -- 是否完成采购
  description TEXT,             -- 描述
  created_at DATETIME,          -- 创建时间
  updated_at DATETIME,          -- 更新时间
  operator TEXT                 -- 操作人员
);

CREATE TABLE IF NOT EXISTS purchase_arrival_plan (
  id INTEGER PRIMARY KEY,  -- 主键ID
  purchase_id INTEGER, -- 订单ID
  plan_quantity INTEGER, -- 批次计划发货数量
  plan_date DATE,  -- 批次计划发货日期
  is_completed BOOLEAN  -- 是否按时发货
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT
);

CREATE TABLE IF NOT EXISTS inbound (
  id INTEGER PRIMARY KEY,
  purchase_id INTEGER, -- 订单ID
  arrival_quantity INTEGER, -- 到货数量
  arrival_date INTEGER, -- 到货时间
  incoming_quantity INTEGER, -- 入库数量
  incoming_date  DATE,		-- 入库日期
  yield DECIMAL(2, 6),        -- 产品良率（小数，2位整数，6位小数）
  shipping_method TEXT,       -- 运输方式
  shipping_cost DECIMAL(10, 2),  -- 运费（金额，10位整数，2位小数）
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT
);

-- 创建客户表
CREATE TABLE customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 客户ID，主键
    name TEXT UNIQUE, -- 客户名称，唯一值字段
    address TEXT, -- 客户地址
    country TEXT, -- 客户国家
    email TEXT, -- 客户邮箱
    phone TEXT, -- 客户电话
    other TEXT, -- 其他信息
    created_time DATETIME, -- 记录创建时间
    updated_time DATETIME, -- 记录更新时间
    operator TEXT -- 操作人
);

-- 创建销售订单表
CREATE TABLE sales_orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键，唯一标识销售订单
    product_id INTEGER, -- 商品ID
    quantity INTEGER, -- 数量
    price REAL, -- 单价
    customer_shipping_fee REAL, -- 客户运费
    actual_shipping_fee REAL, -- 实际运费
    order_date DATE, -- 订单日期
    latest_shipment_date DATE, -- 最晚出货日期
    customer_id INTEGER, -- 客户ID
    shipping_country TEXT, -- 运往国家
    is_invoice_issued BOOLEAN, -- 是否开发票
    is_sample_order BOOLEAN, -- 是否样品单
    other_fees REAL, -- 其他费用
    profit REAL, -- 利润
    exchange_rate REAL, -- 参考汇率
    sales_invoice TEXT, -- 销售发票
    remarks TEXT, -- 备注
    created_time DATETIME, -- 记录创建时间
    updated_time DATETIME, -- 记录更新时间
    operator TEXT -- 操作人
);

-- 创建出货记录表
CREATE TABLE outbound (
    id INTEGER PRIMARY KEY AUTOINCREMENT, -- 主键，唯一标识出货记录
    sales_order_id INTEGER, -- 关联的销售订单ID
    quantity INTEGER, -- 数量
    shipment_date DATE, -- 发货日期
    shipping_id TEXT, -- 运单编号
    shipping_cost REAL, -- 运费
    created_time DATETIME, -- 记录创建时间
    updated_time DATETIME, -- 记录更新时间
    operator TEXT, -- 操作人
    FOREIGN KEY (sales_order_id) REFERENCES sales_orders (id) -- 外键，关联销售订单表中的订单
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY,
  product_id INTEGER, -- 商品ID
  stock_quantity INTEGER, -- 库存数量
  updated_at DATETIME -- 更新时间
);

INSERT INTO user (name, password) VALUES ('5plus', '123456');
INSERT INTO user (name, password) VALUES ('zhangsan', '123456');
INSERT INTO user (name, password) VALUES ('lisi', '123456');
INSERT INTO user (name, password) VALUES ('wangwu', '123456');

INSERT INTO role (name,title) VALUES ('Administrator','管理员');
INSERT INTO role (name,title) VALUES ('Purchaser','采购员');
INSERT INTO role (name,title) VALUES ('Salesperson','销售员');
INSERT INTO role (name,title) VALUES ('Accountant','财务人员');

INSERT INTO user_role (user_name,role_name) VALUES ('5plus','Administrator');
INSERT INTO user_role (user_name,role_name) VALUES ('zhangsan','Purchaser');
INSERT INTO user_role (user_name,role_name) VALUES ('lisi','Salesperson');
INSERT INTO user_role (user_name,role_name) VALUES ('wangwu','Accountant');

INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (10, 'Dashboard', '首页', 'Odometer', 'menu', '/dashboard', NULL);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (20, 'Purchase', '采购管理', 'Odometer', 'menu', NULL, NULL);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (21, 'Supplier', '供应商管理', 'Odometer', 'menu', '/purchase/supplier', 20);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (22, 'Product', '产品管理', 'Odometer', 'menu', '/purchase/product', 20);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (23, 'PurchaseOrder', '采购订单', 'Odometer', 'menu', '/purchase/order', 20);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (30, 'Sales', '销售管理', 'Odometer', 'menu', NULL, NULL);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (31, 'Customer', '客户管理', 'Odometer', 'menu', '/sales/customer', 30);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (32, 'SalesOrder', '销售订单', 'Odometer', 'menu', '/sales/order', 30);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (90, 'System', '系统管理', 'Odometer', 'menu', NULL, NULL);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (91, 'User', '用户管理', 'Odometer', 'menu', '/system/user', 90);
INSERT INTO resource (id, name, label, icon, type, url, parent_id) VALUES (92, 'Permission', '权限管理', 'Odometer', 'menu', '/system/permission', 90);

INSERT INTO permission (role_name, resource_id) VALUES ('Administrator', '10,20,21,22,23,30,31,32,90,91,92');
INSERT INTO permission (role_name, resource_id) VALUES ('Purchaser', '10');
INSERT INTO permission (role_name, resource_id) VALUES ('Salesperson', '10');
INSERT INTO permission (role_name, resource_id) VALUES ('Accountant', '10');

INSERT INTO supplier (name, address, contact_name, contact_email, contact_phone, other) VALUES ('供应商A', '地址A', '联系人A', 'a@a.com', '13900000001', '备注A');
INSERT INTO supplier (name, address, contact_name, contact_email, contact_phone, other) VALUES ('供应商B', '地址B', '联系人B', 'b@b.com', '13900000002', '备注B');
INSERT INTO supplier (name, address, contact_name, contact_email, contact_phone, other) VALUES ('供应商C', '地址C', '联系人C', 'c@c.com', '13900000003', '备注C');

INSERT INTO product (name, model, standard, supplier_name, purchase_price, sales_price) VALUES ('产品A', '型号A', '标准A', '供应商A', 90, 100);
INSERT INTO product (name, model, standard, supplier_name, purchase_price, sales_price) VALUES ('产品B', '型号B', '标准B', '供应商B', 90, 100);
INSERT INTO product (name, model, standard, supplier_name, purchase_price, sales_price) VALUES ('产品C', '型号C', '标准C', '供应商C', 90, 100);
`;

// 初始化数据
function initDB() {
  if (fs.existsSync(config.dbFile)) {
    console.log('数据已存在，无需初始化');
    return;
  }

  console.log('数据库不存在，开始初始化');
  const db = new sqlite3.Database(config.dbFile);
  db.exec(sql, (err) => {
    if (err) {
      console.error(err.message);
    } else {
      console.log('数据库初始化和SQL代码批量执行成功');
    }
  });
  // 关闭数据库连接
  db.close();
}

initDB();

