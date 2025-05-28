import https from 'https';
import dns from 'dns';

https.globalAgent.options.lookup = (hostname, options, callback) => {
  return dns.lookup(hostname, { family: 4, hints: dns.ADDRCONFIG }, callback);
};

import axios from 'axios';

axios.get('https://api.bitget.com/api/v2/spot/public/time')
  .then(res => {
    console.log('Bitget API works:', res.data);
  })
  .catch(err => {
    console.error('Still blocked?', err.message);
  });
