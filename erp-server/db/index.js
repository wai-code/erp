const sqlite3 = require('sqlite3').verbose();
const { createPool } = require('generic-pool');
const config = require('./config')

// 创建数据库连接池

function createDBPool() {
    return createPool({
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

let dbPool = null;
function getDBPool() {
    if (!dbPool) {
        dbPool = createDBPool();
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
        closeDb(dbRef);
    }).finally(() => {
        closeDb(dbRef);
    });
}

async function openDB() {
    return await getDBPool().acquire();
}

function closeDb(db) {
    if (db) {
        getDBPool().release(db); // 释放连接回连接池
    }

}

module.exports = { sqlExec, openDB, closeDb };