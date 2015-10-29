'use strict';

module.exports = {
  db: {
    host: process.env.DATABASE_HOST || 'localhost',
    port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
    username: process.env.DATABASE_USERNAME, // Must be set in .env
    password: process.env.DATABASE_PASSWORD, // Must be set in .env
    name: process.env.DATABASE_NAME || 'appsumo-challenge'
  },
  auth: {
    google: {
      web: {
        client_secret: process.env.GOOGLE_SECRET, // Must be set in .env
        client_id: process.env.GOOGLE_ID, // Must be set in .env
        client_email: process.env.GOOGLE_EMAIL, // Must be set in .env
        redirect_uri: process.env.GOOGLE_CALLBACK || 'http://localhost:7000/auth/google/callback'
      },
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ]
    }
  },
  home: {
    title: process.env.HOME_TITLE || 'Appsumo Challenge Survey'
  },
  'cookie-secret': process.env.COOKIE_SECRET || 'ub3r-l337-53cr37-6035-h3r3',
  port: process.env.PORT || 4567,
  hostname: process.env.HOSTNAME || 'localhost'
};
