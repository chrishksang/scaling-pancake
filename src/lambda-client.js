const AWS = require('aws-sdk')

/**
 * @param args
 * @returns {Lambda}
 * @constructor
 */
function LambdaClient (args) {
  AWS.config.update({
    region: args.region
  })
  if (args.accessKey && args.secretKey) {
    AWS.config.update({
      accessKeyId: args.accessKey,
      secretAccessKey: args.secretKey
    })
  } else if (args.profile) {
    AWS.config.credentials = new AWS.SharedIniFileCredentials({ profile: args.profile })
  } else if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
    AWS.config.update({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
    })
  }

  return new AWS.Lambda()
}

module.exports = LambdaClient
