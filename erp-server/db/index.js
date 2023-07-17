const sqlite3 = require('sqlite3').verbose();

// 打开数据库连接
const db = new sqlite3.Database('erp_server.sqlite3');

// 创建表
db.serialize(function () {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT UNIQUE, password TEXT)');
  db.run('CREATE TABLE IF NOT EXISTS roles (ID INTEGER PRIMARY KEY, role_name TEXT NOT NULL UNIQUE)');
  db.run('CREATE TABLE IF NOT EXISTS permissions (ID INTEGER PRIMARY KEY, menu_name TEXT NOT NULL UNIQUE);');
  db.run('CREATE TABLE IF NOT EXISTS role_permissions ( ID INTEGER PRIMARY KEY, role_name TEXT NOT NULL, menu_name TEXT NOT NULL)');
  db.run('CREATE TABLE IF NOT EXISTS user_roles (ID INTEGER PRIMARY KEY, username TEXT NOT NULL, role_name TEXT NOT NULL)');
  db.run(`CREATE TABLE IF NOT EXISTS suppliers (
    ID INTEGER PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    address TEXT,
    email TEXT,
    phone TEXT,
    other TEXT,
    created_time DATETIME,
    updated_time DATETIME,
    operator TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS products (
    ID INTEGER PRIMARY KEY,
    product_name TEXT NOT NULL,
    product_model TEXT NOT NULL,
    supplier_name TEXT,
    purchase_price DECIMAL(10, 2),
    sales_price DECIMAL(10, 2),
    created_time DATETIME,
    updated_time DATETIME,
    operator TEXT,
    CONSTRAINT unique_product UNIQUE (product_name, product_model)
  )`);
});

// 初始化数据
db.serialize(function () {
  // 插入用户数据
  // db.run('INSERT INTO users (name, password) VALUES (?, ?)', ['John Doe', '123456']);
  // db.run("INSERT INTO roles (role_name) VALUES('Administrator'),('Accountant'),('Salesperson'),('Purchaser')");
});

// 关闭数据库连接
db.close();
