export class Quiver {
  func = {};
  nodes = {};
  root = null;
  logOn = false;
  visited = {};
  output = {};

  setNodes(nodes) {
    this.nodes = Object.freeze(nodes);
  }
  go(key) {
    return args => this.goTo(key, args);
  }
  async goTo(key, args, prev = null) {
    if (this.visited[key]) return;
    const node = this.nodes[key];
    if (!node) return;
    let result;
    if (this.func[node.key]) {
      result = await this.func[node.key](args, node.key, prev, node.next);
    }
    if (result === undefined) return;
    if (
      (this.logOn && node.type === 'leaf') ||
      (node.type === 'root' && node.next.length === 0)
    ) {
      this.output[node.key] = { result, at: node.key, from: node.prev };
    } else {
      for (const n of node.next) {
        await this.goTo(n, result, node.key);
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
  }

  restart() {
    this.output = {};
    this.visited = {};
  }

  out() {
    if (!this.logOn) return 'Log is turned off!';
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
    return key in this.visited ? undefined : callback();
  }

  test = {
    setup: (key, VALUE) => {
      this.logOn = true;
      const root = this.root;
      this.setRoot(key);
      this.goTo(root, VALUE);
    },
    fail: (desc, a, b) => {
      console.log(
        '\x1b[31m',
        `FAIL: ${desc}`,
        '\x1b[32m',
        `\n\tExpected: ${typeof a === 'object' ? JSON.stringify(a) : a}`,
        '\x1b[31m',
        `\n\tRecieved: ${typeof b === 'object' ? JSON.stringify(b) : b}`,
        '\x1b[0m'
      );
    },
    success: desc => {
      console.log('\x1b[32m', `SUCCESS: ${desc}`, '\x1b[0m');
    },
    isEqual: (a, b) => {
      const typeA = typeof a,
        typeB = typeof b;
      if (typeA !== typeB) return false;
      if (typeA === 'number' || typeA === 'string' || typeA === 'boolean')
        return a === b;
      if (typeA === 'object') {
        const isArrayA = Array.isArray(typeA),
          isArrayB = Array.isArray(typeB);
        if (isArrayA !== isArrayB) return false;
        if (isArrayA && isArrayB) {
          return a.every((item, index) => this.test.isEqual(item, b[index]));
        } else {
          for (const key in a) {
            if (!this.test.isEqual(a[key], b[key])) {
              return false;
            }
          }
          return true;
        }
      }
    },
    root: root => ({
      with: inp => ({
        leaf: leaf => ({
          with: expected => ({
            should: async desc =>
              await this.goTo(root, inp).then(() =>
                this.output[leaf]?.result === undefined
                  ? this.test.fail(desc, expected, this.output[leaf]?.result)
                  : this.test.isEqual(this.output[leaf].result, expected)
                  ? this.test.success(desc)
                  : this.test.fail(desc, expected, this.output[leaf].result)
              )
          })
        })
      })
    })
  };
}
