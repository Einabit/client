const Eina = require("./");

const cli = new Eina("127.0.0.1", null);

const close = cli.tap("auto1", d => {
  console.log(d);
})

setTimeout(() => {
  close()
}, 10000);
