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
