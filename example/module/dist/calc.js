const _qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  visited: {},
  goTo: async (key, args, prev = null) => {
    const node = _qvr.nodes[key];
    if (!node) return;
    let result;
    if (typeof _qvr.func[node.key] === 'function')
      result = await _qvr.func[node.key](args, node.key, prev, node.next, _qvr);
    if (result !== undefined && node.next) {
      node.next.forEach(n => {
        _qvr.goTo(n, result, node.key, _qvr.nodes[n]?.next ?? []);
      });
    }
  },
  wrap: (callback = res => res) =>
    _qvr.func.forEach(
      (fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args)))
    ),
  setRoot: key => (_qvr.root = key),
  getRoot: () => _qvr.root,
  visit: key => {
    if (!_qvr.visited[key]) {
      _qvr.visited[key] = true;
      return { goTo: _qvr.goTo, visit: _qvr.visit };
    } else {
      return { goTo: () => undefined, visit: _qvr.visit };
    }
  }
};
_qvr.nodes = {
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
};
_qvr.setRoot(Object.values(_qvr.nodes).find(node => node.type === 'root').key);
_qvr.func['begin'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return 10;
};
_qvr.func['add'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return args + 5;
};
_qvr.func['addRes'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return goTo('log', args);
};
_qvr.func['toMult'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return visit(key).goTo('mult', args);
};
_qvr.func['mult'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return args * 22;
};
_qvr.func['multRes'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return goTo('log', args);
};
_qvr.func['toAdd'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return visit(key).goTo('add', args);
};
_qvr.func['log'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return console.log(args);
};
_qvr.goTo(_qvr.root);
export default _qvr;
