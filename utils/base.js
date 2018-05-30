const jwt = require('jsonwebtoken')
const logger = require('../logger')

const base = {}

base.checkToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, 'shared-secret', (err, decoded) => {
      if (err) {
        reject(false)
      }
      if (!decoded) {
        reject(false)
      } else {
        resolve(true)
      }
    });
  })
}

module.exports = base