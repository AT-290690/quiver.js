const _qvr = { 
  memo: {}, 
  func: {}, 
  nodes: {},
  root: null,
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
_qvr.nodes = {"root":{"key":"root","next":["a0","a1"],"level":0,"type":"root","prev":null},"a0":{"key":"a0","next":["b0"],"level":1,"type":"branch","prev":"root"},"b0":{"key":"b0","next":["c0"],"level":2,"type":"branch","prev":"a0"},"c0":{"key":"c0","next":["d0"],"level":3,"type":"branch","prev":"b0"},"d0":{"key":"d0","next":["e0"],"level":4,"type":"branch","prev":"c0"},"e0":{"key":"e0","next":["f0"],"level":5,"type":"branch","prev":"d0"},"f0":{"key":"f0","next":[],"level":6,"type":"leaf","prev":"e0"},"a1":{"key":"a1","next":["b1"],"level":1,"type":"branch","prev":"root"},"b1":{"key":"b1","next":["c1"],"level":2,"type":"branch","prev":"a1"},"c1":{"key":"c1","next":["d1"],"level":3,"type":"branch","prev":"b1"},"d1":{"key":"d1","next":["e1"],"level":4,"type":"branch","prev":"c1"},"e1":{"key":"e1","next":["f1"],"level":5,"type":"branch","prev":"d1"},"f1":{"key":"f1","next":["g1"],"level":6,"type":"branch","prev":"e1"},"g1":{"key":"g1","next":[],"level":7,"type":"leaf","prev":"f1"},"m0":{"key":"m0","next":["m1"],"level":0,"type":"root","prev":"g1"},"m1":{"key":"m1","next":["m2"],"level":1,"type":"branch","prev":"m0"},"m2":{"key":"m2","next":["m3","toAmp"],"level":2,"type":"branch","prev":"m1"},"m3":{"key":"m3","next":[],"level":3,"type":"leaf","prev":"m2"},"toAmp":{"key":"toAmp","next":[],"level":3,"type":"leaf","prev":"m2"},"amp":{"key":"amp","next":["amp1"],"level":0,"type":"root","prev":"toAmp"},"amp1":{"key":"amp1","next":[],"level":1,"type":"leaf","prev":"amp"},"logger":{"key":"logger","next":[],"level":0,"type":"leaf","prev":"amp1"}};
_qvr.root = Object.values(_qvr.nodes).find(node => node.type === 'root');
const root = (node) => _qvr.root = node;
const run = (args) => _qvr.dfs(_qvr.root, {...args, quiver: _qvr });
_qvr.func["root"] = async (prev, current, parent, nodes, memo, goTo) => {
return []
}
_qvr.func["a0"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(1)) || prev
}
_qvr.func["b0"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(2)) || prev
}
_qvr.func["c0"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(3)) || prev
}
_qvr.func["d0"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(4)) || prev
}
_qvr.func["e0"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(5)) || prev
}
_qvr.func["f0"] = async (prev, current, parent, nodes, memo, goTo) => {
return prev.length < 20 ? goTo(nodes["a0"], prev) : prev

}
_qvr.func["a1"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(-1)) || prev
}
_qvr.func["b1"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(-2)) || prev
}
_qvr.func["c1"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(-3)) || prev
}
_qvr.func["d1"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(-4)) || prev
}
_qvr.func["e1"] = async (prev, current, parent, nodes, memo, goTo) => {
return void(prev.push(-5)) || prev
}
_qvr.func["f1"] = async (prev, current, parent, nodes, memo, goTo) => {
return prev.length < 20 ? goTo(nodes["a1"], prev) : prev
}
_qvr.func["g1"] = async (prev, current, parent, nodes, memo, goTo) => {
return goTo(nodes["m0"], prev)

}
_qvr.func["m0"] = async (prev, current, parent, nodes, memo, goTo) => {
return prev.map(x => x * 2)
}
_qvr.func["m1"] = async (prev, current, parent, nodes, memo, goTo) => {
return prev.map(x => x * 3)
}
_qvr.func["m2"] = async (prev, current, parent, nodes, memo, goTo) => {
return prev.map(x => x * 4)
}
_qvr.func["m3"] = async (prev, current, parent, nodes, memo, goTo) => {
return goTo(nodes["logger"], prev)
}
_qvr.func["toAmp"] = async (prev, current, parent, nodes, memo, goTo) => {
return goTo(nodes["amp"], prev)

}
_qvr.func["amp"] = async (prev, current, parent, nodes, memo, goTo) => {
return prev.reduce((acc, x) => acc += Math.abs(x), 0)
}
_qvr.func["amp1"] = async (prev, current, parent, nodes, memo, goTo) => {
return goTo(nodes["logger"], prev)

}
_qvr.func["logger"] = async (prev, current, parent, nodes, memo, goTo) => {
return console.log(prev)

};
run();
export default _qvr