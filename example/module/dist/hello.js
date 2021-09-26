const _qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  dfs: async (node, prev, parent = null) => {
    if (!node) return;
    let result;
    if (typeof _qvr.func[node.key] === 'function')
      result = await _qvr.func[node.key](
        prev,
        node.key,
        parent,
        _qvr.nodes,
        _qvr.memo,
        _qvr.dfs
      );
    if (result !== undefined && node.next) {
      node.next.forEach(n => {
        _qvr.dfs(_qvr.nodes[n], result, node.key);
      });
    }
  },
  wrap: (callback = res => res) =>
    _qvr.func.forEach(
      (fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args)))
    ),
  setAsRoot: node => (_qvr.root = node),
  run: args => _qvr.dfs(_qvr.root, { ...args, quiver: _qvr })
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
_qvr.setAsRoot(Object.values(_qvr.nodes).find(node => node.type === 'root'));
_qvr.func['HELLO'] = async (prev, current, parent, nodes, memo, goTo) => {
  return 'Hello';
};
_qvr.func['SPACE'] = async (prev, current, parent, nodes, memo, goTo) => {
  return prev + ' ';
};
_qvr.func['WORLD'] = async (prev, current, parent, nodes, memo, goTo) => {
  return prev + 'World';
};
_qvr.func['PRINT'] = async (prev, current, parent, nodes, memo, goTo) => {
  return console.log(prev);
};
_qvr.run();
export default _qvr;
