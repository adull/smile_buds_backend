const mysql = require('mysql');

const pool = mysql.createPool({
    user:      'root',
    password:  'root',
    host:      'localhost',
    port:      (process.env.NODE_ENV == 'production' ? 3306 : 8889),
    database:  'smile_buds'
});

/**
 * A list of columns in the user table that may be updated
 * ( needs to be updated )
 * @type {String[]}
 */
const userFields = ['username', 'password', 'hobby', 'identifier'];

module.exports = {
    /**
     * Adds a user to the database
     *
     * @param {Object} data An object containing the user's data
     * @returns {Promise} Promise
     */
    create: async (data) => {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO `user` SET ?', data, (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    },

    /**
     * Selects a user from the database.
     * 
     * @param {String|String[]} columns
     * @param {Object} clauses
     * @returns {Promise}
     */
    read: async (columns, clauses = {}) => {
        return new Promise((resolve, reject) => {
            let query = 'SELECT';

            if (typeof columns == 'string') {
                query += ` ${columns}`;
            } else if (typeof columns == 'object') {
                for (let column of columns) {
                    query += ` ${column}`;

                    if (column !== columns[ columns.length - 1 ]) {
                        query += ',';
                    }
                }
            }

            query += ' FROM user';

            if (clauses.length > 0) {
                query += ' WHERE';
                clauses = Object.entries(clauses);

                for (let i = 0; i < clauses.length; i++) {
                    [column, value] = clauses[i];
                    query += ` ${column} = ${value} `;

                    if (i !== clauses.length - 1) {
                        query += 'AND';
                    }
                }
            }

            pool.query(query, (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    },

    /**
     * Updates a user's information
     * 
     * @param {Object} data A map of column => value pairs
     * @param {String} identifier A unique identifier for the user
     * @returns {Promise}
     */
    update: async (data, identifier) => {
        return new Promise((resolve, reject) => {
            let query  = 'UPDATE `user` SET',
                keys   = Object.keys(data),
                values = Object.values(data);

            for (let i = 0; i < keys.length; i++) {
                if (userFields.includes(values[i]) === false) {
                    reject({ error: `${keys[i]} is not a column or is immutable` });
                }

                query += ` ${keys[i]} = ? `;

                if (i !== keys.length - 1) {
                    query += 'AND';
                }
            }

            query += 'WHERE `identifier` = ?';
            values.push(identifier);

            pool.query(query, values, (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    }
};
