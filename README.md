# appsumo-challenge [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]
> Challenge Application for AppSumo Team


## Install

```sh
$ npm install --save appsumo-challenge
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

## License

MIT © [Paul Ryan](http://simplycomplex.co)


[npm-image]: https://badge.fury.io/js/appsumo-challenge.svg
[npm-url]: https://npmjs.org/package/appsumo-challenge
[travis-image]: https://travis-ci.org/simplycomplexco/appsumo-challenge.svg?branch=master
[travis-url]: https://travis-ci.org/simplycomplexco/appsumo-challenge
[daviddm-image]: https://david-dm.org/simplycomplexco/appsumo-challenge.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/simplycomplexco/appsumo-challenge
