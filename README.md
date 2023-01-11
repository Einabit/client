# Why spanish? [Versión en Español](README.es.md)

This package is related to einabit.com, we're a spanish company that provides services in Spain mainland (for the time being). We asume most if not all of our potential clients will prefer spanish over english :\

However if you're interested in working with us drop me a mail (ciro@einabit.com).

# What is this repo all about?

This repo contains an SDK or library which makes easy to query our services. To test its behavior you can simulate with https://github.com/Einabit/sandbox.

# Installation

This library is available through NPM repository

`npm install einabit.client.js`

# Basic usage

If you have a service available in 127.0.0.1

```js
const Eina = require("einabit.client.js");

const cli = new Eina("127.0.0.1", null);

const close = cli.tap("auto1", d => {
  console.log(d);
})

setTimeout(() => {
  close()
}, 10000);

```

# Documentation

```js
/**
* Constructor
* @param {string} host          - api address
* @param {string} key           - unique key shared with you
* @return {Client}              - instance
*/
const cl = new Eina(host, key)

/**
* tap                           - gets current value and creates a subscription
* @param {string} variable      - variable subscription
* @param {function} change        - callback being used (value) => void
* @param {int?} fromTs          - (optional) if defined the callback will fire for every entry included since that date
* @return {function}            - ends the subscription
*/
cl.tap(variable, change, fromTs?)

/**
* fetch                         - gets all entries within the date range
* @param {string} variable      - variable subject
* @param {int} fromTs           - include values from this date
* @param {int} toTs             - include values till this date
* @return {promise}             - promise with all data
*/
cl.fetch(variable, fromTs, toTs)

/**
* value                         - returns the current value
* @param {string} variable      - subject variable
* @return {promise}             - promise with the current value
*/
cl.value(variable)
```
