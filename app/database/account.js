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

                if (i !== keys.length) {
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
