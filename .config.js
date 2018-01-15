if(process.env.NODE_ENV === 'development') require('dotenv').load()

module.exports = {
  stripe: process.env.STRIPE,
  connectionString: `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:5432/${process.env.DB_DATABASE}`,
  secret: process.env.SECRET,
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENTID,
    clientSecret: process.env.AUTH0_SECRET,
  },
  youtubeKey: process.env.YOUTUBE_KEY,
}