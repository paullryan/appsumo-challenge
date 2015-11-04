# appsumo-challenge [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Challenge Application for AppSumo Team


## Install

```sh
$ git clone <this-repo>
$ cd appsumo-challenge
$ npm install
```


## Usage

### Configuration
Utilizes [dotenv](https://github.com/motdotla/dotenv) for configuration variables.

**Example .env file:**
```sh
DATABASE_NAME=cool_db
DATABASE_USERNAME=your database username
DATABASE_PASSWORD=your database password

GOOGLE_SECRET=google client secret from developer console
GOOGLE_ID=google client id from developer console
GOOGLE_EMAIL=email address for google account
COOKIE_SECRET=A really secret secret
```

Requires a mysql with the database in DATABASE_NAME(default=appsumo-challenge) created.  

_Note: Google credentials are for Google OAuth 2, see [API documentation for more information](https://github.com/paullryan/appsumo-challenge/tree/master/api#module_middleware/passport-google), you can ignore this OAuth setup by just having dummy values for the gogle credentials_

### In Development:

```sh
npm install -g gulp
gulp serve
```

### In Production

I highly recommend you use a manager like pm2 to manage the process restarts however all that's needed is.
```sh
node lib
```

## API documentation

[API Docs](api)

## Testing

```sh
npm test
```

You can also run a testing watch to quickly add more tests by running

```sh
gulp mocha-watch
```

## Suggested Future Improvements

_Note: I have paths for each of these ready from other applications I've built but am leaving them out for brevity sake_

* Finish Facebook authentication
* Create user management in admin section
* Switch to a SPA for the management console
  * Breakout the SPA into it's own module and test server
  * Link back to the test server in dev or utilize webpack version in prod
* Have the ability to create multiple survey's and reference them through pretty links (e.g. <server>/my-best-survey-ever)

## License

MIT © [Paul Ryan](http://simplycomplex.co)


[travis-image]: https://travis-ci.org/paullryan/appsumo-challenge.svg?branch=master
[travis-url]: https://travis-ci.org/paullryan/appsumo-challenge
[daviddm-image]: https://david-dm.org/paullryan/appsumo-challenge.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/paullryan/appsumo-challenge
