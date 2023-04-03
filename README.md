# Why spanish? [Versión en Español](README.es.md)

This package is related to einabit.com, we're a Spanish company that provides services in Spain mainland (for the time being). We assume most if not all of our potential clients will prefer Spanish over English :\

However if you're interested in working with us drop me a mail: ciro@einabit.com

# What is this repo all about?

This repo contains an SDK or library which makes easy to query our services. To test its behavior you can simulate with https://github.com/Einabit/sandbox.

# Installation

This library is available through NPM repository

`npm install einabit.client.js`

# Getting started

> :warning: Asuming you've docker CE, Nodejs and NPM installed in your local machine.

Once you've contracted Einabit services we will provide you a real API endpoint to integrate with. For the time being you can start a local docker container that emulates the real API behavior.

These are the steps to start your local development:

- Create an empty folder
- Start a bash terminal within that folder
- Create a config file for the sandbox `touch sandbox.config.yml`
- Fill it with the contents below:
```yml
  temp1:
    value:
      min: 0
      max: 100
      step: 1
    interval:
      ms: 400
      skip: 0
```
- Start a local docker container
```
docker run --rm -d -e CONFIG="$(cat sandbox.config.yml)" -p 1337:1337 --name einabit einabit/sandbox
```
- Create a Node project `npm init -y`
- Add Einabit's SDK as a dependency `npm install einabit.client.js`
- Create a index.js file `touch index.js`
- Fill it with the contents below:
```js
  const Eina = require("einabit.client.js");

  const cli = new Eina("127.0.0.1", null);

  const close = cli.tap("temp1", d => {
    console.log(d);
  })

  setTimeout(close, 10000);
```
- Run the project `node index.js`
- You must see the application receiving signals from the sandbox

Tip: You can reset the container changing the config file to emulate other behaviors as defined here https://github.com/Einabit/sandbox#quick-start--samples

Conclusion: You can develop your own solution without having to wait to any kind of IoT installation. Contact us for more information: info@einabit.com

# Documentation

```js
/**
* Constructor
* @param {string} host          - api address
* @param {string} key           - unique key shared only with you
* @return {Client}              - instance
*/
const cl = new Eina(host, key)

/**
* tap                           - gets current value and creates a subscription
* @param {string} variable      - variable subscription
* @param {int?} fromTs          - (optional) if defined the callback will include entries since then
* @param {function} change      - callback being used (value) => void
* @return {function}            - closes the subscription
*/
cl.tap(variable, fromTs?, change)

/**
* fetch                         - gets all entries within the date range
* @param {string} variable      - variable subject
* @param {int} fromTs           - include values from this date
* @param {int} toTs             - include values till this date
* @param {function} change      - callback being used (value) => void
* @return {promise}             - promise with all data
*/
cl.fetch(variable, fromTs, toTs, change)

/**
* value                         - returns the current value
* @param {string} variable      - subject variable
* @param {function} change      - callback being used (value) => void
* @return {promise}             - promise with the current value
*/
cl.value(variable)
```
