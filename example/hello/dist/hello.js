const _qvr = {
  memo: {},
  func: {},
  dfs: async (node, prev, nodes, parent, memo = _qvr.memo) => {
    if (!node) return;
    let result;
    if (typeof _qvr.func[node.key] === 'function')
      result = await _qvr.func[node.key](
        prev,
        node.key,
        parent,
        nodes,
        memo,
        _qvr.dfs
      );
    if (result !== undefined && node.next) {
      node.next.forEach(n => {
        _qvr.dfs(nodes[n], result, nodes, node.key, memo, _qvr.func);
      });
    }
  },
  wrap: (callback = res => res) =>
    _qvr.func.forEach(
      (fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args)))
    )
};

const nodes = {
  HELLO: { key: 'HELLO', next: ['SPACE'], level: 0, type: 'root', prev: null },
  SPACE: {
    key: 'SPACE',
    next: ['WORLD'],
    level: 1,
    type: 'branch',
    prev: 'HELLO'
  },
  WORLD: {
    key: 'WORLD',
    next: ['PRINT'],
    level: 2,
    type: 'branch',
    prev: 'SPACE'
  },
  PRINT: { key: 'PRINT', next: [], level: 3, type: 'leaf', prev: 'WORLD' }
};
const root = Object.values(nodes).find(node => node.type === 'root');
const run = (method, req, res) => {
  _qvr.dfs(root, { req, res, method, quiver: _qvr }, nodes);
};
_qvr.func['HELLO'] = async (prev, current, parent, nodes, memo, dfs) => {
  return 'Hello';
};
_qvr.func['SPACE'] = async (prev, current, parent, nodes, memo, dfs) => {
  return prev + ' ';
};
_qvr.func['WORLD'] = async (prev, current, parent, nodes, memo, dfs) => {
  return prev + 'World';
};
_qvr.func['PRINT'] = async (prev, current, parent, nodes, memo, dfs) => {
  return console.log(prev);
};
_qvr.dfs(root, undefined, nodes);
