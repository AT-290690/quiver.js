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
  setAsRoot: nodeKey => (_qvr.root = nodeKey),
  run: args => _qvr.goTo(_qvr.root, args),
  visit: (current, callback) => {
    if (!_qvr.visited[current]) {
      callback();
      _qvr.visited[current] = true;
    }
  }
};
_qvr.nodes = {
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
  m0: { key: 'm0', next: ['m1'], prev: null, level: 0, type: 'root' },
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
  logger: { key: 'logger', next: [], prev: null, level: 0, type: 'root' },
  amp: { key: 'amp', next: ['amp1'], prev: null, level: 0, type: 'root' },
  amp1: { key: 'amp1', next: [], prev: 'amp', level: 1, type: 'leaf' }
};
_qvr.setAsRoot(_qvr.nodes['root'].key);
_qvr.func['root'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return [];
};
_qvr.func['a0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(1) || prev;
};
_qvr.func['b0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(2) || prev;
};
_qvr.func['c0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(3) || prev;
};
_qvr.func['d0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(4) || prev;
};
_qvr.func['e0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(5) || prev;
};
_qvr.func['f0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev.length < 20 ? goTo('a0', prev) : prev;
};
_qvr.func['a1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(-1) || prev;
};
_qvr.func['b1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(-2) || prev;
};
_qvr.func['c1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(-3) || prev;
};
_qvr.func['d1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(-4) || prev;
};
_qvr.func['e1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return void prev.push(-5) || prev;
};
_qvr.func['f1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev.length < 20 ? goTo('a1', prev) : prev;
};
_qvr.func['g1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return goTo('m0', prev);
};
_qvr.func['m0'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev.map(x => x * 2);
};
_qvr.func['m1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev.map(x => x * 3);
};
_qvr.func['m2'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev.map(x => x * 4);
};
_qvr.func['m3'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return goTo('logger', prev);
};
_qvr.func['toAmp'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return goTo('amp', prev);
};
_qvr.func['logger'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return console.log(prev);
};
_qvr.func['amp'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev.reduce((acc, x) => (acc += Math.abs(x)), 0);
};
_qvr.func['amp1'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return goTo('logger', prev);
};
_qvr.run();
export default _qvr;
