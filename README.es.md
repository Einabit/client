# ¿Qué es este repositorio?

Este repositorio contiene un SDK o librería para comunicarte con nuestros servicios. Para probar el funcionamiento puedes usar el repositorio https://github.com/Einabit/sandbox para levantar un servicio que emule el comportamiento de nuestra API.

# Instalación

Puedes instalar esta librería a través de NPM

`npm install einabit.client.js`

# Primeros pasos

> :warning: Asumiendo que tienes docker CE, Nodejs y NPM instalado en tu máquina local.

Una vez hayas contratado los servicios de Einabit te proveeremos con una API real y un endpoint para integrar tu desarrollo. Mientras tanto puedes lanzar un contenedor de docker en tu máquina que emula el comportamiento de la pasarela real:

Estos son los pasos para empezar a desarrollar en local:

- Crea una carpeta vacía
- Inicia una consola de comandos en la misma
- Crea un fichero de configuración para el sandbox `touch sandbox.config.yml`
- Introduce el siguiente contenido en el mismo:
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
- Inicia un contenedor sandbox con la configuración anterior
```
docker run --rm -d -e CONFIG="$(cat sandbox.config.yml)" -p 1337:1337 --name einabit einabit/sandbox
```
- Crea un projecto de Node `npm init -y`
- Añade el SDK de einabit como dependencia `npm install einabit.client.js`
- Crea un fichero index.js `touch index.js`
- Introduce el siguiente contenido en el mismo:
```js
  const Eina = require("einabit.client.js");

  const cli = new Eina("127.0.0.1", null);

  const close = cli.tap("temp1", d => {
    console.log(d);
  })

  setTimeout(close, 10000);
```
- Ejecuta el script `node index.js`
- Verás el script recibiendo señales del sandbox

Tip: Puedes reiniciar el contenedor pasándole diferentes configuraciones para representar tu caso concreto siguiendo la documentación https://github.com/Einabit/sandbox#quick-start--samples

Conclusion: Mientras nosotros realizamos la instalación tú puedes desarrollar la aplicación del cliente sin preocuparte de la adquisición de datos o del funcionamiento de los dispositivos IoT. Para más información contáctanos: info@einabit.com

# Seguridad

En caso de que el servidor requiera una clave encriptada:

```javascript
  const { KEY } = process.env; // KEY = "6fff68e8f216334f573e1a115bebe72f"
  const cli = new Eina("hosted.einabit.api", KEY);
```

[Explicación en el servicio de pruebas (inglés)](https://github.com/Einabit/sandbox/#optional-encryption)

# Documentación

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
* @param {number?} fromTs          - (optional) if defined the callback will include entries since then
* @param {function} change      - callback being used (value) => void
* @return {function}            - closes the subscription
*/
cl.tap(variable, fromTs?, change)

/**
* fetch                         - gets all entries within the date range
* @param {string} variable      - variable subject
* @param {number} fromTs           - include values from this date
* @param {number} toTs             - include values till this date
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
cl.value(variable, change)

/**
* last                          - returns last N values from the stream
* @param {string} variable      - subject variable
* @param {number} amount        - amount of values to be included
* @param {function} change      - callback being used (last) => void
* @return {promise}             - promise with the last values
*/
cl.last(variable, amount, change)
```
