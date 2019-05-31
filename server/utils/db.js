const mysql = require('mysql')
const pool = mysql.createPool({
    host: '192.168.13.156',
    port: 3306,
    user: 'wisdom',
    password: '13JWpgaPal9N1ebE',
    database :  'uitest'
  })
  
  let query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
      pool.getConnection(function(err, connection) {
        if (err) {
          reject( err )
        } else {
          connection.query(sql, values, ( err, results, fields) => {
  
            if ( err ) {
              console.log('mysql_err', sql, JSON.stringify(values), err);
              reject( err )
            } else {
              console.log('mysql', sql, JSON.stringify(values), JSON.stringify(results));
              resolve( results )
            }
            connection.release()
          })
        }
      })
    })
  }
  
  module.exports = { query }