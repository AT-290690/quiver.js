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
_qvr.setRoot(Object.values(_qvr.nodes).find(node => node.type === 'root').key);
_qvr.func['HELLO'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return 'Hello';
};
_qvr.func['SPACE'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return args + ' ';
};
_qvr.func['WORLD'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return args + 'World';
};
_qvr.func['PRINT'] = async (
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
