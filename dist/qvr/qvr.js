export const qvr = {
  memo: {},
  func: {},
  nodes: {},
  root: null,
  visited: {},
  output: []
};
qvr.tramp =
  fn =>
  (...args) => {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
qvr.goTo = async (key, args, prev = null) => {
  const node = qvr.nodes[key];
  if (!node) return;
  let result;
  if (typeof qvr.func[node.key] === 'function') {
    result = await qvr.func[node.key](args, node.key, prev, node.next, qvr);
  }
  if (result !== undefined) {
    if (node.next.length === 0) {
      qvr.output.push({ result, at: node.key, from: node.prev });
    } else {
      for (const n of node.next) {
        await qvr.goTo(n, result, node.key, qvr.nodes[n].next);
      }
    }
  }
};
qvr.reset = () => {
  qvr.restart();
  qvr.memo = {};
};
qvr.restart = () => {
  qvr.output = [];
  qvr.visited = {};
};
qvr.out = () => qvr.output;
qvr.setNodes = nodes => (qvr.nodes = Object.freeze(nodes));
qvr.setRoot = key => (qvr.root = key);
qvr.getRoot = () => qvr.root;
qvr.visit = key => {
  if (!qvr.visited[key]) {
    qvr.visited[key] = true;
    return { goTo: qvr.goTo, visit: qvr.visit };
  } else {
    return { goTo: () => undefined, visit: qvr.visit };
  }
};
qvr.leave = key => {
  delete qvr.visited[key];
};
qvr.shortCircuit = callback => {
  const result = callback();
  return result ? result : undefined;
};
qvr.ifNotVisited = (key, callback) =>
  key in qvr.visited ? undefined : callback();
