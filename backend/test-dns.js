const dns = require('dns');

console.log('Testing Node.js DNS resolveSrv...');
dns.resolveSrv('_mongodb._tcp.cluster0.i1lhupw.mongodb.net', (err, addresses) => {
  if (err) {
    console.error('dns.resolveSrv failed:', err);
  } else {
    console.log('dns.resolveSrv succeeded:', addresses);
  }
});
