const _qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  visited: {},
  goTo: async (key, prev, parent = null) => {
    const node = _qvr.nodes[key];
    if (!node) return;
    let result;
    if (typeof _qvr.func[node.key] === 'function')
      result = await _qvr.func[node.key](prev, node.key, parent, _qvr);
    if (result !== undefined && node.next) {
      node.next.forEach(n => {
        _qvr.goTo(n, result, node.key);
      });
    }
  },
  wrap: (callback = res => res) =>
    _qvr.func.forEach(
      (fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args)))
    ),
  setRoot: nodeKey => (_qvr.root = nodeKey),
  getRoot: () => _qvr.root,
  visit: current => {
    if (!_qvr.visited[current]) {
      _qvr.visited[current] = true;
      return { goTo: _qvr.goTo, visit: _qvr.visit };
    } else {
      return { goTo: () => undefined, visit: _qvr.visit };
    }
  }
};
_qvr.nodes = {
  SERVER: { key: 'SERVER', next: [], prev: null, level: 0, type: 'root' },
  REQUEST: { key: 'REQUEST', next: [], prev: null, level: 0, type: 'root' },
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
  }
};
_qvr.setRoot(_qvr.nodes['SERVER'].key);
_qvr.func['SERVER'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
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
      url: (prev, url) => prev.url.split('?')[0] === url || void 0,
      method: (prev, method) => prev.method === method || void 0
    },
    end: res => ({
      status: status =>
        res.writeHead(status, { 'Content-Type': 'application/json' }) && {
          send: data => res.end(JSON.stringify(data))
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
_qvr.func['REQUEST'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  const { method, req, res, init } = prev;
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
_qvr.func['CAT'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (prev.match.url(prev, '/cat') && prev) || void 0;
};
_qvr.func['CAT[GET]'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (prev.match.method(prev, 'GET') && prev) || void 0;
};
_qvr.func['CAT[GET][all](validate)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (!('id' in prev.query) && prev) || void 0;
};
_qvr.func['CAT[GET][all](send)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return prev
    .end(prev.res)
    .status(200)
    .send(prev.toJSON(await prev.fs.readFile(prev.DB_PATH, 'utf8')));
};
_qvr.func['CAT[GET][id](validate)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return ('id' in prev.query && prev) || void 0;
};
_qvr.func['CAT[GET][id](send)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  const data = await prev.fs.readFile(prev.DB_PATH, 'utf8');
  const json = prev.toJSON(data);
  prev.tryCatch(
    () => {
      if (!json[prev.query.id]) {
        throw new Error('Cat not found');
      } else {
        prev.end(prev.res).status(200).send(json[prev.query.id]);
      }
    },
    message => prev.end(prev.res).status(404).send({ message })
  );
};
_qvr.func['CAT[POST]'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (prev.match.method(prev, 'POST') && prev) || void 0;
};
_qvr.func['CAT[POST](validate)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  if (!prev.body)
    return void prev
      .end(prev.res)
      .status(403)
      .send({ message: 'No data provided!' });
  prev.body = prev.toJSON(prev.body);
  if (!prev.body.name || !prev.body.age || !prev.body.breed)
    return void prev
      .end(prev.res)
      .status(403)
      .send({ message: 'Missing some or all fields.' });
  return prev;
};
_qvr.func['CAT[POST](send)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  const data = await prev.fs.readFile(prev.DB_PATH, 'utf8');
  const json = prev.toJSON(data);
  const id = Object.keys(json).length;
  json[id] = { ...prev.body, id };
  await prev.fs.writeFile(prev.DB_PATH, prev.toString(json));
  prev.end(prev.res).status(200).send({ message: 'Cat added!' });
};
_qvr.func['CAT[PUT]'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (
    (prev.match.method(prev, 'PUT') && 'id' in prev.query && prev) || void 0
  );
};
_qvr.func['CAT[PUT](validate)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  if (!prev.body)
    return void prev
      .end(prev.res)
      .status(403)
      .send({ message: 'No data provided!' });
  prev.body = prev.toJSON(prev.body);
  if (!prev.body.age)
    return void prev
      .end(prev.res)
      .status(403)
      .send({ message: 'Missing some or all fields.' });
  return prev;
};
_qvr.func['CAT[PUT](send)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  const data = await prev.fs.readFile(prev.DB_PATH, 'utf8');
  const { id } = prev.query;
  const json = prev.toJSON(data);
  if (!json[id])
    return void prev
      .end(prev.res)
      .status(404)
      .send({ message: 'Cat not found!' });
  json[id] = { ...json[id], age: prev.body.age };
  await prev.fs.writeFile(prev.DB_PATH, prev.toString(json));
  prev.end(prev.res).status(200).send({ message: 'Cat updated!' });
};
_qvr.func['CAT[DELETE]'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (prev.match.method(prev, 'DELETE') && prev) || void 0;
};
_qvr.func['CAT[DELETE](validate)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (
    ('id' in prev.query && prev) ||
    void prev.end(prev.res).status(403).send({ message: 'No id provided!' })
  );
};
_qvr.func['CAT[DELETE](send)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  const data = await prev.fs.readFile(prev.DB_PATH, 'utf8');
  const json = prev.toJSON(data);
  const { id } = prev.query;
  if (!json[id])
    return prev.end(prev.res).status(403).send({ message: 'Cat not found!' });
  delete json[id];
  await prev.fs.writeFile(prev.DB_PATH, prev.toString(json));
  prev.end(prev.res).status(200).send({ message: 'Cat deleted!' });
};
_qvr.func['AGE'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (prev.match.url(prev, '/age') && prev) || void 0;
};
_qvr.func['AGE[POST]'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return (prev.match.method(prev, 'POST') && prev) || void 0;
};
_qvr.func['AGE[POST](validate)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  prev.body = prev.toJSON(prev.body);
  if (!prev.body)
    return void prev
      .end(prev.res)
      .status(403)
      .send({ message: 'No data provided' });
  const date = new Date(prev.body.date);
  if (!(date.getTime() === date.getTime()))
    return void prev
      .end(prev.res)
      .status(403)
      .send({ message: 'Invalid date!' });
  return { ...prev, date };
};
_qvr.func['AGE[POST](send)'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  const today = new Date();
  const birthDate = prev.date;
  let age = today.getFullYear() - birthDate.getFullYear();
  const month = today.getMonth() - birthDate.getMonth();
  if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return prev.end(prev.res).status(200).send(age);
};
_qvr.goTo(_qvr.root);
export default _qvr;
