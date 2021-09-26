import server from './dist/server.js';

server().then(out => console.log(`---- server ------------\n`, out, `\n`));
