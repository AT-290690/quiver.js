const _qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  dfs: async (
    node,
    prev,
    nodes = _qvr.nodes,
    parent = null,
    memo = _qvr.memo
  ) => {
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
    ),
  setAsRoot: node => (_qvr.root = node),
  run: args => _qvr.dfs(_qvr.root, { ...args, quiver: _qvr })
};
_qvr.nodes = {
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
