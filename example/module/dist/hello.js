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
};
_qvr.setAsRoot(
  Object.values(_qvr.nodes).find(node => node.type === 'root').key
);
_qvr.func['HELLO'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return 'Hello';
};
_qvr.func['SPACE'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev + ' ';
};
_qvr.func['WORLD'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return prev + 'World';
};
_qvr.func['PRINT'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }
) => {
  return console.log(prev);
};
_qvr.run();
export default _qvr;
