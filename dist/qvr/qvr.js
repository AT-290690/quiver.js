
export class Quiver {
  memo = {};
  func = {};
  nodes = {};
  root = null;
  visited = {};
  output = [];

  setNodes(nodes) {
    this.nodes = Object.freeze(nodes);
  }

  async goTo(key, args, prev = null) {
    const node = this.nodes[key];
    if (!node) return;
    let result;
    if (typeof this.func[node.key] === 'function') {
      result = await this.func[node.key](args, node.key, prev, node.next, this);
    }
    if (result !== undefined) {
      if (node.next.length === 0) {
        this.output.push({ result, at: node.key, from: node.prev });
      } else {
        for (const n of node.next) {
          await this.goTo(n, result, node.key, this.nodes[n].next);
        }
      }
    }
  }

  tramp(fn) {
    (...args) => {
      let result = fn(...args);
      while (typeof result === 'function') {
        result = result();
      }
      return result;
    };
  }

  reset() {
    this.restart();
    this.memo = {};
  }

  restart() {
    this.output = [];
    this.visited = {};
  }

  out() {
    return this.output;
  }

  setRoot(key) {
    this.root = key;
  }

  getRoot() {
    return this.root;
  }

  visit(key) {
    if (!this.visited[key]) {
      this.visited[key] = true;
      return { goTo: this.goTo, visit: this.visit };
    } else {
      return { goTo: () => undefined, visit: this.visit };
    }
  }

  leave(key) {
    delete this.visited[key];
  }

  shortCircuit(callback) {
    const result = callback();
    return result ? result : undefined;
  }

  ifNotVisited(key, callback) {
    return key in _qvr.visited ? undefined : callback();
  }
}