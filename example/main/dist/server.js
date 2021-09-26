const _qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  visited: {},
  output: [],
  goTo: async (key, args, prev = null) => {
    const node = _qvr.nodes[key];
    if (!node) return;
    let result;
    if (typeof _qvr.func[node.key] === 'function') {
      result = await _qvr.func[node.key](args, node.key, prev, node.next, _qvr);
    }
    if (result !== undefined) {
      if (node.next.length === 0) {
        _qvr.output.push({ result, at: node.key, from: node.prev });
      } else {
        for (const n of node.next) {
          await _qvr.goTo(n, result, node.key, _qvr.nodes[n].next);
        }
      }
    }
  },
  reset: () => {
    _qvr.restart();
    _qvr.memo = {};
  },
  restart: () => {
    _qvr.output = [];
    _qvr.visited = {};
  },
  out: () => _qvr.output,
  setRoot: key => (_qvr.root = key),
  getRoot: () => _qvr.root,
  visit: key => {
    if (!_qvr.visited[key]) {
      _qvr.visited[key] = true;
      return { goTo: _qvr.goTo, visit: _qvr.visit };
    } else {
      return { goTo: () => undefined, visit: _qvr.visit };
    }
  },
  leave: key => {
    delete _qvr.visited[key];
  },
  shortCircuit: callback => {
    const result = callback();
    return result ? result : undefined;
  },
  ifNotVisited: (key, callback) =>
    key in _qvr.visited ? undefined : callback()
};
_qvr.nodes = Object.freeze({
  SERVER: { key: 'SERVER', next: [], prev: null, level: 0, type: 'root' },
  AGE: { key: 'AGE', next: ['AGE[POST]'], prev: null, level: 0, type: 'root' },
  'AGE[POST]': {
    key: 'AGE[POST]',
    next: ['AGE[POST](validate)'],
    prev: 'AGE',
    level: 1,
    type: 'branch'
  },
  'AGE[POST](validate)': {
    key: 'AGE[POST](validate)',
    next: ['AGE[POST](send)'],
    prev: 'AGE[POST]',
    level: 2,
    type: 'branch'
  },
  'AGE[POST](send)': {
    key: 'AGE[POST](send)',
    next: [],
    prev: 'AGE[POST](validate)',
    level: 3,
    type: 'leaf'
  },
  CAT: {
    key: 'CAT',
    next: ['CAT[GET]', 'CAT[POST]', 'CAT[PUT]', 'CAT[DELETE]'],
    prev: null,
    level: 0,
    type: 'root'
  },
  'CAT[GET]': {
    key: 'CAT[GET]',
    next: ['CAT[GET][all](validate)', 'CAT[GET][id](validate)'],
    prev: 'CAT',
    level: 1,
    type: 'branch'
  },
  'CAT[GET][all](validate)': {
    key: 'CAT[GET][all](validate)',
    next: ['CAT[GET][all](send)'],
    prev: 'CAT[GET]',
    level: 2,
    type: 'branch'
  },
  'CAT[GET][all](send)': {
    key: 'CAT[GET][all](send)',
    next: [],
    prev: 'CAT[GET][all](validate)',
    level: 3,
    type: 'leaf'
  },
  'CAT[GET][id](validate)': {
    key: 'CAT[GET][id](validate)',
    next: ['CAT[GET][id](send)'],
    prev: 'CAT[GET]',
    level: 2,
    type: 'branch'
  },
  'CAT[GET][id](send)': {
    key: 'CAT[GET][id](send)',
    next: [],
    prev: 'CAT[GET][id](validate)',
    level: 3,
    type: 'leaf'
  },
  'CAT[POST]': {
    key: 'CAT[POST]',
    next: ['CAT[POST](validate)'],
    prev: 'CAT',
    level: 1,
    type: 'branch'
  },
  'CAT[POST](validate)': {
    key: 'CAT[POST](validate)',
    next: ['CAT[POST](send)'],
    prev: 'CAT[POST]',
    level: 2,
    type: 'branch'
  },
  'CAT[POST](send)': {
    key: 'CAT[POST](send)',
    next: [],
    prev: 'CAT[POST](validate)',
    level: 3,
    type: 'leaf'
  },
  'CAT[PUT]': {
    key: 'CAT[PUT]',
    next: ['CAT[PUT](validate)'],
    prev: 'CAT',
    level: 1,
    type: 'branch'
  },
  'CAT[PUT](validate)': {
    key: 'CAT[PUT](validate)',
    next: ['CAT[PUT](send)'],
    prev: 'CAT[PUT]',
    level: 2,
    type: 'branch'
  },
  'CAT[PUT](send)': {
    key: 'CAT[PUT](send)',
    next: [],
    prev: 'CAT[PUT](validate)',
    level: 3,
    type: 'leaf'
  },
  'CAT[DELETE]': {
    key: 'CAT[DELETE]',
    next: ['CAT[DELETE](validate)'],
    prev: 'CAT',
    level: 1,
    type: 'branch'
  },
  'CAT[DELETE](validate)': {
    key: 'CAT[DELETE](validate)',
    next: ['CAT[DELETE](send)'],
    prev: 'CAT[DELETE]',
    level: 2,
    type: 'branch'
  },
  'CAT[DELETE](send)': {
    key: 'CAT[DELETE](send)',
    next: [],
    prev: 'CAT[DELETE](validate)',
    level: 3,
    type: 'leaf'
  },
  REQUEST: { key: 'REQUEST', next: [], prev: null, level: 0, type: 'root' }
});
_qvr.func['SERVER'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const init = {
    imports: {
      fs: await import('fs'),
      URL: await import('url'),
      http: await import('http')
    },
    routes: {
      '/cat': 'CAT',
      '/age': 'AGE'
    },
    match: {
      url: (args, url) => args.url.split('?')[0] === url || void 0,
      method: (args, method) => args.method === method || void 0
    },
    end: res => ({
      status: status =>
        res.writeHead(status, { 'Content-Type': 'application/json' }) && {
          send: data => void res.end(JSON.stringify(data))
        }
    }),
    toJSON: (json, ...args) => JSON.parse(json, ...args),
    toString: (json, ...args) => JSON.stringify(json, ...args),
    tryCatch: (trier, catcher) => {
      let output;
      try {
        output = trier();
      } catch (err) {
        output = catcher(err.message);
      }
      return output;
    },
    DB_DIR: './example/main/dist/db/',
    DB_FILE: 'cats.json'
  };

  const PORT = 8075;
  const start = (req, res) => {
    const method = req.method;
    const urlParsed = init.imports.URL.parse(req.url);
    const query = urlParsed.query;
    if (req.url === '/favicon.ico') {
      res.writeHead(200, { 'Content-Type': 'image/x-icon' });
      return res.end();
    }

    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      if (method !== 'GET' && body) {
        req.body = body;
      }
      restart();
      req.query = query;
      goTo(getRoot(), { method, req, res, init });
    });
  };

  const server = init.imports.http.createServer();
  server.listen(PORT, () => console.log('http://localhost:' + PORT));
  server.on('request', start);

  const { mkdir, writeFile, access } = init.imports.fs.promises;

  await access(init.DB_DIR + init.DB_FILE).catch(async () => {
    await mkdir(init.DB_DIR, { recursive: true });
    await writeFile(
      init.DB_DIR + init.DB_FILE,
      `{"0": { "breed": "Siamese", "age": 3, "name": "Purr Mclaw" }}`
    );
  });
  setRoot('REQUEST');
};
_qvr.func['AGE'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (args.match.url(args, '/age') && args) || void 0;
};
_qvr.func['AGE[POST]'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (args.match.method(args, 'POST') && args) || void 0;
};
_qvr.func['AGE[POST](validate)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  args.body = args.toJSON(args.body);
  if (!args.body)
    return void args
      .end(args.res)
      .status(403)
      .send({ message: 'No data provided' });
  const date = new Date(args.body.date);
  if (!(date.getTime() === date.getTime()))
    return void args
      .end(args.res)
      .status(403)
      .send({ message: 'Invalid date!' });
  return { ...args, date };
};
_qvr.func['AGE[POST](send)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const today = new Date();
  const birthDate = args.date;
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return args.end(args.res).status(200).send(age);
};
_qvr.func['CAT'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (args.match.url(args, '/cat') && args) || void 0;
};
_qvr.func['CAT[GET]'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (args.match.method(args, 'GET') && args) || void 0;
};
_qvr.func['CAT[GET][all](validate)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (!('id' in args.query) && args) || void 0;
};
_qvr.func['CAT[GET][all](send)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return args
    .end(args.res)
    .status(200)
    .send(args.toJSON(await args.fs.readFile(args.DB_PATH, 'utf8')));
};
_qvr.func['CAT[GET][id](validate)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return ('id' in args.query && args) || void 0;
};
_qvr.func['CAT[GET][id](send)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const data = await args.fs.readFile(args.DB_PATH, 'utf8');
  const json = args.toJSON(data);
  args.tryCatch(
    () => {
      if (!json[args.query.id]) {
        throw new Error('Cat not found');
      } else {
        args.end(args.res).status(200).send(json[args.query.id]);
      }
    },
    message => args.end(args.res).status(404).send({ message })
  );
};
_qvr.func['CAT[POST]'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (args.match.method(args, 'POST') && args) || void 0;
};
_qvr.func['CAT[POST](validate)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  if (!args.body)
    return void args
      .end(args.res)
      .status(403)
      .send({ message: 'No data provided!' });
  args.body = args.toJSON(args.body);
  if (!args.body.name || !args.body.age || !args.body.breed)
    return void args
      .end(args.res)
      .status(403)
      .send({ message: 'Missing some or all fields.' });
  return args;
};
_qvr.func['CAT[POST](send)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const data = await args.fs.readFile(args.DB_PATH, 'utf8');
  const json = args.toJSON(data);
  const id = Object.keys(json).length;
  json[id] = { ...args.body, id };
  await args.fs.writeFile(args.DB_PATH, args.toString(json));
  args.end(args.res).status(200).send({ message: 'Cat added!' });
};
_qvr.func['CAT[PUT]'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (
    (args.match.method(args, 'PUT') && 'id' in args.query && args) || void 0
  );
};
_qvr.func['CAT[PUT](validate)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  if (!args.body)
    return void args
      .end(args.res)
      .status(403)
      .send({ message: 'No data provided!' });
  args.body = args.toJSON(args.body);
  if (!args.body.age)
    return void args
      .end(args.res)
      .status(403)
      .send({ message: 'Missing some or all fields.' });
  return args;
};
_qvr.func['CAT[PUT](send)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const data = await args.fs.readFile(args.DB_PATH, 'utf8');
  const { id } = args.query;
  const json = args.toJSON(data);
  if (!json[id])
    return void args
      .end(args.res)
      .status(404)
      .send({ message: 'Cat not found!' });
  json[id] = { ...json[id], age: args.body.age };
  await args.fs.writeFile(args.DB_PATH, args.toString(json));
  args.end(args.res).status(200).send({ message: 'Cat updated!' });
};
_qvr.func['CAT[DELETE]'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (args.match.method(args, 'DELETE') && args) || void 0;
};
_qvr.func['CAT[DELETE](validate)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  return (
    ('id' in args.query && args) ||
    void args.end(args.res).status(403).send({ message: 'No id provided!' })
  );
};
_qvr.func['CAT[DELETE](send)'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const data = await args.fs.readFile(args.DB_PATH, 'utf8');
  const json = args.toJSON(data);
  const { id } = args.query;
  if (!json[id])
    return args.end(args.res).status(403).send({ message: 'Cat not found!' });
  delete json[id];
  await args.fs.writeFile(args.DB_PATH, args.toString(json));
  args.end(args.res).status(200).send({ message: 'Cat deleted!' });
};
_qvr.func['REQUEST'] = async (
  args,
  key,
  prev,
  next,
  {
    nodes,
    memo,
    visited,
    visit,
    ifNotVisited,
    leave,
    goTo,
    setRoot,
    getRoot,
    restart,
    out,
    shortCircuit
  }
) => {
  const { method, req, res, init } = args;
  const {
    match,
    end,
    imports,
    routes,
    toJSON,
    tryCatch,
    toString,
    DB_DIR,
    DB_FILE
  } = init;
  const { fs } = imports;
  const { body, query, url } = req;
  const queries =
    query
      ?.split('&')
      .map(q => {
        const [key, value] = q.split('=');
        return { [key]: value };
      })
      .reduce((acc, item) => ({ ...acc, ...item }), {}) || {};
  const service = {
    method,
    body,
    query: queries,
    res,
    url,
    fs: fs.promises,
    match,
    end,
    toJSON,
    toString,
    tryCatch,
    DB_PATH: DB_DIR + DB_FILE
  };
  goTo(routes[url.split('?')[0]], service);
};
export default async () => {
  _qvr.setRoot(_qvr.nodes['SERVER'].key);
  _qvr.reset();
  await _qvr.goTo(_qvr.root);
  return _qvr.out();
};
