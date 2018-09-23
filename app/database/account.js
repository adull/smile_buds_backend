const mysql = require('mysql');

/**
 * Contains functionality pertaining to user accounts and settings.
 *
 * Example: In routes/signup.js, the create() method will be called in lieu of db.signup():
 * 
 * ```
 * const User = require('./database/account.js')
 * // ...
 * User.create({foo: 'bar'})
 *  .then(results => {})
 *  .catch(error => {})
 * ```
 * 
 * (This comment may be removed after this change is approved or rejected)
 */
module.exports = {
    /**
     * Adds a user to the database
     *
     * @param {Object} data An object containing the user's data
     * @returns {Promise} Promise
     */
    create: (data) => {
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