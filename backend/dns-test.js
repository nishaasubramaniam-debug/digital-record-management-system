const dns = require("dns");

dns.resolveSrv("_mongodb._tcp.nishaa.7tlns7d.mongodb.net", (err, addresses) => {
  if (err) {
    console.error("DNS Error:", err);
  } else {
    console.log(addresses);
  }
});