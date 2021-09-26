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
  START: { key: 'START', next: ['INC'], prev: null, level: 0, type: 'root' },
  INC: { key: 'INC', next: ['LOOP'], prev: 'START', level: 1, type: 'branch' },
  LOOP: { key: 'LOOP', next: ['END'], prev: 'INC', level: 2, type: 'branch' },
  END: { key: 'END', next: [], prev: 'LOOP', level: 3, type: 'leaf' }
};
_qvr.setAsRoot(Object.values(_qvr.nodes).find(node => node.type === 'root'));
_qvr.func['START'] = async (prev, current, parent, nodes, memo, goTo) => {
  return 0;
};
_qvr.func['INC'] = async (prev, current, parent, nodes, memo, goTo) => {
  return ++prev;
};
_qvr.func['LOOP'] = async (prev, current, parent, nodes, memo, goTo) => {
  return prev < 10 ? goTo(nodes[parent], prev) : prev;
};
_qvr.func['END'] = async (prev, current, parent, nodes, memo, goTo) => {
  return console.log(prev);
};
_qvr.run();
export default _qvr;
