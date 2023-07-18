const sqlite3 = require('sqlite3').verbose();
const { createPool } = require('generic-pool');
const config = require('./config')

// 创建数据库连接池
let dbPool = null;

function createDBPool() {
    dbPool = createPool({
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

function sqlExec(callback) {
    let dbRef = null;
    getDBPool().acquire().then((db) => {
        // 执行数据库操作
        callback(db);
        dbRef = db;
    }).catch((err) => {
        console.error('Failed to acquire database connection:', err);
        if (dbRef) {
            dbPool.release(dbRef); // 释放连接回连接池
        }
    }).finally(() => {
        if (dbRef) {
            dbPool.release(dbRef); // 释放连接回连接池
        }
    });
}

module.exports = {sqlExec};