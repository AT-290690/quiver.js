const _qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  visited: {},
  output: [],
  goTo: async (key, args, prev = null) => {
    const node = _qvr.nodes[key];
    if (!node) return;
    let result;
    if (typeof _qvr.func[node.key] === 'function') {
      result = await _qvr.func[node.key](args, node.key, prev, node.next, _qvr);
    }
    if (result !== undefined) {
      if (node.next.length === 0) {
        _qvr.output.push({ result, at: node.key, from: node.prev });
      } else {
        for (const n of node.next) {
          await _qvr.goTo(n, result, node.key, _qvr.nodes[n].next);
        }
      }
    }
  },
  reset: () => {
    _qvr.restart();
    _qvr.memo = {};
  },
  restart: () => {
    _qvr.output = [];
    _qvr.visited = {};
  },
  out: () => _qvr.output,
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
  },
  leave: key => {
    delete _qvr.visited[key];
  }
};
_qvr.nodes = Object.freeze({
  START: { key: 'START', next: ['INC'], prev: null, level: 0, type: 'root' },
  INC: { key: 'INC', next: ['LOOP'], prev: 'START', level: 1, type: 'branch' },
  LOOP: { key: 'LOOP', next: ['END'], prev: 'INC', level: 2, type: 'branch' },
  END: { key: 'END', next: [], prev: 'LOOP', level: 3, type: 'leaf' }
});
_qvr.func['START'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, leave, goTo, wrap, setRoot, getRoot, restart }
) => {
  return 0;
};
_qvr.func['INC'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, leave, goTo, wrap, setRoot, getRoot, restart }
) => {
  return ++args;
};
_qvr.func['LOOP'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, leave, goTo, wrap, setRoot, getRoot, restart }
) => {
  return args < 10 ? goTo(prev, args) : args;
};
_qvr.func['END'] = async (
  args,
  key,
  prev,
  next,
  { nodes, memo, visited, visit, leave, goTo, wrap, setRoot, getRoot, restart }
) => {
  return args;
};
export default async () => {
  _qvr.setRoot(
    Object.values(_qvr.nodes).find(node => node.type === 'root').key
  );
  _qvr.reset();
  await _qvr.goTo(_qvr.root);
  return _qvr.out();
};
