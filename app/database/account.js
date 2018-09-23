const mysql = require('mysql');

module.exports = {
    /**
     * Adds a user to the database
     *
     * @param {Object} data An object containing the user's data
     * @returns {Promise} Promise
     */
    create: async (data) => {
        return new Promise((resolve, reject) => {
            pool.query('INSERT INTO `user` SET ?', data, (error, results) => {
                if (error) {
                    reject(error);
                }

                resolve(results);
            });
        });
    }
};
