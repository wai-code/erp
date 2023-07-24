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
  email TEXT,
  phone TEXT,
  source TEXT,
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
  id INTEGER PRIMARY KEY,
  project_name TEXT,
  product_name TEXT,
  product_model TEXT,
  unit_price DECIMAL(10, 2),
  purchase_quantity INTEGER,
  arrival_quantity INTEGER,
  order_date DATE,
  last_arrival_date DATE,
  purchase_cycle INTEGER,
  shipment_method TEXT,
  shipping_cost DECIMAL(10, 2),
  corresponding_order TEXT,
  purchase_contract TEXT,
  is_completed BOOLEAN,
  loss_quantity INTEGER,
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT
);

CREATE TABLE IF NOT EXISTS inbound_record (
  id INTEGER PRIMARY KEY,
  product_name TEXT,
  product_model TEXT,
  purchase_project TEXT,
  incoming_quantity INTEGER,
  purchase_unit_price DECIMAL(10, 2),
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT
);

CREATE TABLE IF NOT EXISTS inventory (
  id INTEGER PRIMARY KEY,
  product_name TEXT,
  product_model TEXT,
  stock_quantity INTEGER,
  updated_at DATETIME
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

