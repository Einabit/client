const net = require("net");
const crypto = require("crypto");

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
  let encrypted = cipher.update(text, "utf-8", "hex");
  encrypted += cipher.final("hex");
  const combinedData = iv.toString("hex") + encrypted;
  return combinedData;
}

const EMPTY_STR = d => !!d;

function writeCommand (client, command, key) {
  if (key) {
    const encryptedData = encrypt(command, key);
    client.write(encryptedData);
  } else {
    client.write(command);
  }
}

const self = function (host, key) {
  this.host = host;
  this.key = key;
}

self.prototype.tap = function (name, ...aux) {
  let fromTs, change;

  if (typeof aux[0] === "number" && typeof aux[1] === "function") {
    fromTs = aux[0];
    change = aux[1];
  } else {
    fromTs = null;
    change = aux[0];
  }

  const client = new net.Socket();
  const args = ["tap", name];
  if (fromTs) args.push(fromTs);
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => writeCommand(client, command, this.key));
  client.on("data", d => d.toString().split("\n").filter(EMPTY_STR).forEach(line => change(line)));
  return () => client.destroy();
}

self.prototype.fetch = function (name, fromTs, toTs, newLineCbk) {
  const client = new net.Socket();
  const args = ["fetch", name, fromTs, toTs];
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => writeCommand(client, command, this.key));
  const buffer = [];
  client.on("data", d => buffer.push.apply(buffer, d.toString().split("\n").filter(EMPTY_STR)));
  if (typeof newLineCbk === "function") {
    client.on("end", () => buffer.forEach(newLineCbk));
  } else {
    return new Promise(resolve => client.on("end", () => resolve(buffer)));
  }
}

self.prototype.value = function (name, newLineCbk) {
  const client = new net.Socket();
  const args = ["value", name];
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => writeCommand(client, command, this.key));
  let result = null;
  client.on("data", d => result = d.toString().trim());
  if (typeof newLineCbk === "function") {
    client.on("end", () => newLineCbk(result));
  } else {
    return new Promise(resolve => client.on("end", () => resolve(result)));
  }

}

self.prototype.last = function (name, amount, newLineCbk) {
  const client = new net.Socket();
  const args = ["last", name, amount];
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => writeCommand(client, command, this.key));
  const buffer = [];
  client.on("data", d => buffer.push.apply(buffer, d.toString().split("\n").filter(EMPTY_STR)));
  if (typeof newLineCbk === "function") {
    client.on("end", () => buffer.forEach(d => newLineCbk(d)));
  } else {
    return new Promise(resolve => client.on("end", () => resolve(buffer)));
  }

}

module.exports = self;
