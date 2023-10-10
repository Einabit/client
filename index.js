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

function writeCommand (socket, command, key) {
  let auxstr = command;
  if (key) auxstr = encrypt(command, key);

  socket.write(auxstr + "\n");
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

  const socket = new net.Socket();
  const args = ["tap", name];
  if (fromTs) args.push(fromTs);
  const command = args.join();
  socket.connect(1337, this.host);
  socket.on("connect", () => writeCommand(socket, command, this.key));
  socket.on("data", d => d.toString().split("\n").filter(EMPTY_STR).forEach(line => change(line)));
  return () => socket.destroy();
}

self.prototype.fetch = function (name, fromTs, toTs, newLineCbk) {
  const socket = new net.Socket();
  const args = ["fetch", name, fromTs, toTs];
  const command = args.join();
  socket.connect(1337, this.host);
  socket.on("connect", () => writeCommand(socket, command, this.key));
  const buffer = [];
  socket.on("data", d => buffer.push.apply(buffer, d.toString().split("\n").filter(EMPTY_STR)));
  if (typeof newLineCbk === "function") {
    socket.on("end", () => buffer.forEach(newLineCbk));
  } else {
    return new Promise(resolve => socket.on("end", () => resolve(buffer)));
  }
}

self.prototype.value = function (name, newLineCbk) {
  const socket = new net.Socket();
  const args = ["value", name];
  const command = args.join();
  socket.connect(1337, this.host);
  socket.on("connect", () => writeCommand(socket, command, this.key));
  let result = null;
  socket.on("data", d => result = d.toString().trim());
  if (typeof newLineCbk === "function") {
    socket.on("end", () => newLineCbk(result));
  } else {
    return new Promise(resolve => socket.on("end", () => resolve(result)));
  }

}

self.prototype.last = function (name, amount, newLineCbk) {
  const socket = new net.Socket();
  const args = ["last", name, amount];
  const command = args.join();
  socket.connect(1337, this.host);
  socket.on("connect", () => writeCommand(socket, command, this.key));
  const buffer = [];
  socket.on("data", d => buffer.push.apply(buffer, d.toString().split("\n").filter(EMPTY_STR)));
  if (typeof newLineCbk === "function") {
    socket.on("end", () => buffer.forEach(d => newLineCbk(d)));
  } else {
    return new Promise(resolve => socket.on("end", () => resolve(buffer)));
  }

}

module.exports = self;
