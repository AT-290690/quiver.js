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
  root: { key: 'root', next: ['a0', 'a1'], prev: null, level: 0, type: 'root' },
  a0: { key: 'a0', next: ['b0'], prev: 'root', level: 1, type: 'branch' },
  b0: { key: 'b0', next: ['c0'], prev: 'a0', level: 2, type: 'branch' },
  c0: { key: 'c0', next: ['d0'], prev: 'b0', level: 3, type: 'branch' },
  d0: { key: 'd0', next: ['e0'], prev: 'c0', level: 4, type: 'branch' },
  e0: { key: 'e0', next: ['f0'], prev: 'd0', level: 5, type: 'branch' },
  f0: { key: 'f0', next: [], prev: 'e0', level: 6, type: 'leaf' },
  a1: { key: 'a1', next: ['b1'], prev: 'root', level: 1, type: 'branch' },
  b1: { key: 'b1', next: ['c1'], prev: 'a1', level: 2, type: 'branch' },
  c1: { key: 'c1', next: ['d1'], prev: 'b1', level: 3, type: 'branch' },
  d1: { key: 'd1', next: ['e1'], prev: 'c1', level: 4, type: 'branch' },
  e1: { key: 'e1', next: ['f1'], prev: 'd1', level: 5, type: 'branch' },
  f1: { key: 'f1', next: ['g1'], prev: 'e1', level: 6, type: 'branch' },
  g1: { key: 'g1', next: [], prev: 'f1', level: 7, type: 'leaf' },
  m0: { key: 'm0', next: ['m1'], prev: 'g1', level: 0, type: 'root' },
  m1: { key: 'm1', next: ['m2'], prev: 'm0', level: 1, type: 'branch' },
  m2: {
    key: 'm2',
    next: ['m3', 'toAmp'],
    prev: 'm1',
    level: 2,
    type: 'branch'
  },
  m3: { key: 'm3', next: [], prev: 'm2', level: 3, type: 'leaf' },
  toAmp: { key: 'toAmp', next: [], prev: 'm2', level: 3, type: 'leaf' },
  amp: { key: 'amp', next: ['amp1'], prev: 'toAmp', level: 0, type: 'root' },
  amp1: { key: 'amp1', next: [], prev: 'amp', level: 1, type: 'leaf' },
  logger: { key: 'logger', next: [], prev: 'amp1', level: 0, type: 'root' }
});
_qvr.func['root'] = async (
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
  return [];
};
_qvr.func['a0'] = async (
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
  return void args.push(1) || args;
};
_qvr.func['b0'] = async (
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
  return void args.push(2) || args;
};
_qvr.func['c0'] = async (
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
  return void args.push(3) || args;
};
_qvr.func['d0'] = async (
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
  return void args.push(4) || args;
};
_qvr.func['e0'] = async (
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
  return void args.push(5) || args;
};
_qvr.func['f0'] = async (
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
  return args.length < 20 ? goTo('a0', args) : args;
};
_qvr.func['a1'] = async (
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
  return void args.push(-1) || args;
};
_qvr.func['b1'] = async (
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
  return void args.push(-2) || args;
};
_qvr.func['c1'] = async (
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
  return void args.push(-3) || args;
};
_qvr.func['d1'] = async (
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
  return void args.push(-4) || args;
};
_qvr.func['e1'] = async (
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
  return void args.push(-5) || args;
};
_qvr.func['f1'] = async (
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
  return args.length < 20 ? goTo('a1', args) : args;
};
_qvr.func['g1'] = async (
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
  return goTo('m0', args);
};
_qvr.func['m0'] = async (
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
  return args.map(x => x * 2);
};
_qvr.func['m1'] = async (
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
  return args.map(x => x * 3);
};
_qvr.func['m2'] = async (
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
  return args.map(x => x * 4);
};
_qvr.func['m3'] = async (
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
  return goTo('logger', args);
};
_qvr.func['toAmp'] = async (
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
  return goTo('amp', args);
};
_qvr.func['amp'] = async (
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
  return args.reduce((acc, x) => (acc += Math.abs(x)), 0);
};
_qvr.func['amp1'] = async (
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
  return goTo('logger', args);
};
_qvr.func['logger'] = async (
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
