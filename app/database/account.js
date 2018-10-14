const mysql = require('mysql');
const DatabaseHelper = require('./helpers');

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
    create: async (data) => DatabaseHelper.promiseResults('INSERT INTO user SET ?', data, pool),

    /**
     * Updates a user's hobby
     * 
     * @param {String} hobby
     * @param {String} identifier
     * @returns {Promise}
     */
    updateHobby: async (hobby, id) => DatabaseHelper.promiseResults('UPDATE user SET hobby = ? WHERE identifier = ?', [hobby, id], pool),

    /**
     * Updates a user's password
     * 
     * @param {String} password
     * @param {String} identifier
     * @returns {Promise}
     */
    updatePassword: async (password, id) => DatabaseHelper.promiseResults('UPDATE user SET password = ? WHERE identifier = ?', [password, id], pool),

    /**
     * Updates a user's e-mail notification preference
     * 
     * @param {?} notification Is this an int, boolean, string? Need to double check
     * @param {String} identifier
     * @returns {Promise}
     */
    updateEmailNotifications = async (notification, id) => DatabaseHelper.promiseResults('UPDATE user SET email_notifications = ? WHERE identifier = ?', [notification, id], pool),

    /**
     * Checks the database to see if an e-mail exists
     * 
     * @param {String} email
     * @returns {Promise}
     */
    emailExists: async (email) => DatabaseHelper.promiseResults('SELECT email FROM user WHERE email = ?', [email], pool)
};
