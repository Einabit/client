# Why spanish?

This package is related to einabit.com, we're a spanish company that provides services in Spain mainland (for the time being). We asume most if not all of our potential clients will prefer spanish over english :\

However if you're interested in working with us drop me a mail (ciro@einabit.com).

# ¿Qué es este repositorio?

Este repositorio contiene un SDK o librería para comunicarte con nuestros servicios. Para probar el funcionamiento puedes usar el repositorio https://github.com/Einabit/sandbox para levantar un servicio que emule el comportamiento de nuestra API.

# Instalación

Puedes instalar esta librería a través de NPM

`npm install einabit.client.js`

# Uso básico

Suponiendo que tengas levantado un servicio sandbox en 127.0.0.1

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

# Documentación

```js
/**
* Constructor                   - devuelve la instancia configurada
* @param {string} host          - dirección url donde se aloja la pasarela de datos
* @param {string} key           - clave única proporcionada por @einabit
* @return {Client}              - instancia configurada
*/
const cl = new Eina(host, key)

/**
* tap                           - devuelve el valor actual y suscribe a cambios
* @param {string} variable      - la variable a la que nos vamos a suscribir
* @param {function} change        - callback que informa sobre los cambios (value) => void
* @param {int?} fromTs          - (opcional) incluir valores desde la fecha indicada
* @return {function}            - cancela la suscripción
*/
cl.tap(variable, change, fromTs?)

/**
* fetch                         - devuelve los registros entre las fechas indicadas
* @param {string} variable      - la variable que vamos a consultar
* @param {int} fromTs           - incluir valores desde la fecha indicada
* @param {int} toTs             - incluir valores hasta la fecha indicada
* @return {promise}             - promesa que resuelve los datos
*/
cl.fetch(variable, fromTs, toTs)

/**
* value                         - devuelve el valor actual de la variable
* @param {string} variable      - la variable que vamos a consultar
* @return {promise}             - promesa que resuelve el valor actual
*/
cl.value(variable)
```
