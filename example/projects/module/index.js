import calc from './dist/calc.js';
import count from './dist/count.js';
import hello from './dist/hello.js';
import monolith from './dist/monolith.js';

const labeledLog = (name, msg) =>
  console.log(`---- ${name} ------------\n`, msg, `\n`);

calc().then(out => labeledLog('calc', out));
count().then(out => labeledLog('count', out));
hello().then(out => labeledLog('hello', out));
monolith().then(out => labeledLog('monolith', out));
