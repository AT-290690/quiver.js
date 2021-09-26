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
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return 'Hello';
};
_qvr.func['SPACE'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return prev + ' ';
};
_qvr.func['WORLD'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return prev + 'World';
};
_qvr.func['PRINT'] = async (
  prev,
  current,
  parent,
  { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }
) => {
  return console.log(prev);
};
_qvr.goTo(_qvr.root);
export default _qvr;
