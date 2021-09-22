
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
          _qvr.dfs);
      if (result !== undefined && node.next) {
        node.next.forEach(n => {
          _qvr.dfs(nodes[n], result, nodes, node.key, memo, _qvr.func);
        });
      }
    },
    wrap: (callback = res => res) =>
    _qvr.func.forEach((fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args))))
   }

  const nodes = {"START":{"key":"START","next":["INC"],"level":0,"type":"root","prev":null},"INC":{"key":"INC","next":["LOOP"],"level":1,"type":"branch","prev":"START"},"LOOP":{"key":"LOOP","next":[],"level":2,"type":"leaf","prev":"INC"}};
  const root = Object.values(nodes).find(node => node.type === 'root');
  const run = (method, req,res) => {
    _qvr.dfs(root, { req, res, method, quiver: _qvr }, nodes);
  };
  _qvr.func["START"] = async (prev, current, parent, nodes, memo, dfs) => {
return 0
}
_qvr.func["INC"] = async (prev, current, parent, nodes, memo, dfs) => {
return ++prev
}
_qvr.func["LOOP"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev < 10 ? dfs(nodes[parent], prev, nodes) : console.log(prev)
};
  _qvr.dfs(root, undefined, nodes);
  