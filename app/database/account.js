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
            pool.query('INSERT INTO `user` SET ?', data, (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    },

    /**
     * Updates a user's hobby
     * 
     * @param {String} hobby
     * @param {String} identifier
     * @returns {Promise}
     */
    updateHobby: async (hobby, identifier) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE user SET hobby = ? WHERE identifier ?', [hobby, identifier], (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    }
};
