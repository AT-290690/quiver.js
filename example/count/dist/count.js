
    const _qvr = { 
    memo: {}, 
    func: {}, 
    nodes: {},
    dfs: async (node, prev, nodes = _qvr.nodes, parent = null, memo = _qvr.memo) => {
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

  _qvr.nodes = {"START":{"key":"START","next":["INC"],"level":0,"type":"root","prev":null},"INC":{"key":"INC","next":["LOOP"],"level":1,"type":"branch","prev":"START"},"LOOP":{"key":"LOOP","next":["END"],"level":2,"type":"branch","prev":"INC"},"END":{"key":"END","next":[],"level":3,"type":"leaf","prev":"LOOP"}};
  const root = Object.values(_qvr.nodes).find(node => node.type === 'root');
  const run = (method, req,res) => {
    _qvr.dfs(root, { req, res, method, quiver: _qvr });
  };
  _qvr.func["START"] = async (prev, current, parent, nodes, memo, dfs) => {
return 0
}
_qvr.func["INC"] = async (prev, current, parent, nodes, memo, dfs) => {
return ++prev
}
_qvr.func["LOOP"] = async (prev, current, parent, nodes, memo, dfs) => {
return prev < 10 ? dfs(nodes[parent], prev) : prev
}
_qvr.func["END"] = async (prev, current, parent, nodes, memo, dfs) => {
return console.log(prev)
};
  _qvr.dfs(root, undefined, _qvr.nodes );
  