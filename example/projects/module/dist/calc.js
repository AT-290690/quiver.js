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
  begin: {
    key: 'begin',
    next: ['add', 'mult'],
    prev: null,
    level: 0,
    type: 'root'
  },
  add: {
    key: 'add',
    next: ['addRes', 'toMult'],
    prev: 'begin',
    level: 1,
    type: 'branch'
  },
  addRes: { key: 'addRes', next: [], prev: 'add', level: 2, type: 'leaf' },
  toMult: { key: 'toMult', next: [], prev: 'add', level: 2, type: 'leaf' },
  mult: {
    key: 'mult',
    next: ['multRes', 'toAdd'],
    prev: 'begin',
    level: 1,
    type: 'branch'
  },
  multRes: { key: 'multRes', next: [], prev: 'mult', level: 2, type: 'leaf' },
  toAdd: { key: 'toAdd', next: [], prev: 'mult', level: 2, type: 'leaf' },
  log: { key: 'log', next: [], prev: 'toAdd', level: 0, type: 'root' }
});
_qvr.func['begin'] = async (
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
  return 10;
};
_qvr.func['add'] = async (
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
  return args + 5;
};
_qvr.func['addRes'] = async (
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
  return goTo('log', args);
};
_qvr.func['toMult'] = async (
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
  return visit(key).goTo('mult', args);
};
_qvr.func['mult'] = async (
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
  return args * 22;
};
_qvr.func['multRes'] = async (
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
  return goTo('log', args);
};
_qvr.func['toAdd'] = async (
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
  return visit(key).goTo('add', args);
};
_qvr.func['log'] = async (
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
