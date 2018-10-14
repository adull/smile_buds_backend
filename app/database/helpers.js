// Helper functions for interacting with the database, to keep things DRY and whatnot
module.exports = {
    /**
     * A generic helper that returns a Promise for either a result from
     * the database or an error message.
     * 
     * @param {String} query
     * @param {Array}  data
     * @param {Pool}   pool
     * @returns {Promise}
     * @todo Get feedback from Adlai on indentation / readability
     */
    promiseResults: (query, data, pool) => {
        return new Promise((resolve, reject)
            => pool.query(query, data, (error, result)
                => error ? reject(error) : resolve(result)
        ));
    }
}