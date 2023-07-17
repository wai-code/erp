const sqlite3 = require('sqlite3').verbose();
const { createPool } = require('generic-pool');
const config = require('./config')

// 创建数据库连接池
let dbPool = null;

function createDBPool() {
    createPool({
        max: 30,
        min: 5,
        create: () => {
            return new Promise((resolve, reject) => {
                const db = new sqlite3.Database(config.dbFile);
                resolve(db);
            });
        },
        destroy: (db) => {
            return new Promise((resolve, reject) => {
                db.close((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
        }
    });
}

function getDBPool() {
    if (!dbPool) {
        createDBPool();
    }
    return dbPool;
}

module.exports = { pool: getDBPool };