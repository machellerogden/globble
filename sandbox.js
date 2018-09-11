'use strict';
const globble = require('.');

const col = globble.sync('./test/fixtures/**');
const map = globble.sync('./test/fixtures/**', { clobber: true });
globble('./test/fixtures/**').then(v => console.log('acol', v));
globble('./test/fixtures/**', { clobber: true }).then(v => console.log('amap', v));

console.log('col', col);
console.log('map', map);
