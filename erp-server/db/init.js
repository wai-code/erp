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
  ID INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS user_role (
  ID INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  role_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS resource (
  ID INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  type TEXT,
  url TEXT,
  parent_id INTEGER
);

CREATE TABLE IF NOT EXISTS permission (
  ID INTEGER PRIMARY KEY,
  role_name TEXT NOT NULL,
  reource_id TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS suppliers (
  ID INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  address TEXT,
  email TEXT,
  phone TEXT,
  other TEXT,
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT
);

CREATE TABLE IF NOT EXISTS products (
  ID INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  model TEXT NOT NULL,
  supplier_name TEXT,
  purchase_price DECIMAL(10, 2),
  sales_price DECIMAL(10, 2),
  created_at DATETIME,
  updated_at DATETIME,
  operator TEXT,
  CONSTRAINT unique_product UNIQUE (name, model)
);

CREATE TABLE IF NOT EXISTS purchases (
  ID INTEGER PRIMARY KEY,
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

CREATE TABLE IF NOT EXISTS inbound_records (
  ID INTEGER PRIMARY KEY,
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
  ID INTEGER PRIMARY KEY,
  product_name TEXT,
  product_model TEXT,
  stock_quantity INTEGER,
  updated_at DATETIME
);

INSERT INTO user (name, password) VALUES ('5plus', '123456');
INSERT INTO user (name, password) VALUES ('zhangsan', '123456');
INSERT INTO user (name, password) VALUES ('lisi', '123456');
INSERT INTO user (name, password) VALUES ('wangwu', '123456');

INSERT INTO role (name) VALUES ('Administrator');
INSERT INTO role (name) VALUES ('Purchaser');
INSERT INTO role (name) VALUES ('Salesperson');
INSERT INTO role (name) VALUES ('Accountant');

INSERT INTO user_role (user_name,role_name) VALUES ('5plus','Administrator');
INSERT INTO user_role (user_name,role_name) VALUES ('zhangsan','Purchaser');
INSERT INTO user_role (user_name,role_name) VALUES ('lisi','Salesperson');
INSERT INTO user_role (user_name,role_name) VALUES ('wangwu','Accountant');
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

