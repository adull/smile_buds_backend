const mysql = require('mysql');

const pool = mysql.createPool({
    user:      'root',
    password:  'root',
    host:      'localhost',
    port:      (process.env.NODE_ENV == 'production' ? 3306 : 8889),
    database:  'smile_buds'
});

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
            pool.query('UPDATE user SET hobby = ? WHERE identifier = ?', [hobby, identifier], (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    },

    /**
     * Updates a user's password
     * 
     * @param {String} password
     * @param {String} identifier
     * @returns {Promise}
     */
    editProfilePassword: async (password, identifier) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE user SET password = ? WHERE identifier = ?', [password, identifier], (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    },

    /**
     * Updates a user's e-mail notification preference
     * 
     * @param {?} notification Is this an int, boolean, string? Need to double check
     * @param {String} identifier
     * @returns {Promise}
     */
    editProfileEmailNotifications: async (notification, identifier) => {
        return new Promise((resolve, reject) => {
            pool.query('UPDATE user SET email_notifications = ? WHERE identifier = ?', [notification, identifier], (error, result) => {
                if (error) {
                    reject(error);
                }

                resolve(result);
            });
        });
    }
};
