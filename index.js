const net = require("net");

const self = function (host, key) {
  this.host = host;
  // this.key = key; still unused
}

self.prototype.tap = function (name, change, fromTs) {
  const client = new net.Socket();
  const args = ["tap", name];
  if (fromTs) args.push(fromTs);
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => client.write(command));
  client.on("data", d => change(d.toString()));
  return () => client.destroy();
}

self.prototype.fetch = function (name, fromTs, toTs) {
  const client = new net.Socket();
  const args = ["fetch", name, fromTs, toTs];
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => client.write(command));
  const buffer = [];
  client.on("data", d => buffer.push(d.toString()));
  return new Promise(resolve => client.on("end", () => resolve(buffer)));
}

self.prototype.value = function (name) {
  const client = new net.Socket();
  const args = ["fetch", name];
  const command = args.join();
  client.connect(1337, this.host);
  client.on("connect", () => client.write(command));
  return new Promise(resolve => client.on("data", d => resolve(d.toString())));
}

module.exports = self;
