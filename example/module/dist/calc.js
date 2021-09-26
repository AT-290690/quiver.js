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
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return 10;
};
_qvr.func['add'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return prev + 5;
};
_qvr.func['addRes'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return goTo('log', prev);
};
_qvr.func['toMult'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return visit(current).goTo('mult', prev);
};
_qvr.func['mult'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return prev * 22;
};
_qvr.func['multRes'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return goTo('log', prev);
};
_qvr.func['toAdd'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return visit(current).goTo('add', prev);
};
_qvr.func['log'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return console.log(prev);
};
_qvr.goTo(_qvr.root);
export default _qvr;
