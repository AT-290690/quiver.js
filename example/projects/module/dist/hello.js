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
  HELLO: { key: 'HELLO', next: ['SPACE'], prev: null, level: 0, type: 'root' },
  SPACE: {
    key: 'SPACE',
    next: ['WORLD'],
    prev: 'HELLO',
    level: 1,
    type: 'branch'
  },
  WORLD: {
    key: 'WORLD',
    next: ['PRINT'],
    prev: 'SPACE',
    level: 2,
    type: 'branch'
  },
  PRINT: { key: 'PRINT', next: [], prev: 'WORLD', level: 3, type: 'leaf' }
});
_qvr.func['HELLO'] = async (
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
  return 'Hello';
};
_qvr.func['SPACE'] = async (
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
  return args + ' ';
};
_qvr.func['WORLD'] = async (
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
  return args + 'World';
};
_qvr.func['PRINT'] = async (
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
  return args;
};
export default async () => {
  _qvr.setRoot(
    Object.values(_qvr.nodes).find(node => node.type === 'root').key
  );
  _qvr.reset();
  await _qvr.goTo(_qvr.root);
  return _qvr.out();
};
