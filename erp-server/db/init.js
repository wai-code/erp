const sqlite3 = require('sqlite3').verbose();
const config = require('./config')

// 打开数据库连接
const db = new sqlite3.Database(config.dbFile);
const sql = `
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT UNIQUE,
  password TEXT
);

CREATE TABLE IF NOT EXISTS roles (
  ID INTEGER PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS permissions (
  ID INTEGER PRIMARY KEY,
  menu_name TEXT NOT NULL UNIQUE,
  url TEXT,
  parent_id INTEGER
);

CREATE TABLE IF NOT EXISTS role_permissions (
  ID INTEGER PRIMARY KEY,
  role_name TEXT NOT NULL,
  menu_name TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS user_roles (
  ID INTEGER PRIMARY KEY,
  user_name TEXT NOT NULL,
  role_name TEXT NOT NULL
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

INSERT INTO users (name, password) VALUES ('John Doe', '123456');
`;

// 初始化数据
db.exec(sql, (err) => {
  if (err) {
    console.error(err.message);
  } else {
    console.log('数据库初始化和SQL代码批量执行成功');
  }
});

// 关闭数据库连接
db.close();
