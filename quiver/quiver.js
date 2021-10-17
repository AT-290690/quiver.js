export class Quiver {
  func = {};
  nodes = {};
  current;
  root = null;
  visited = {};
  setNodes(nodes) {
    this.nodes = Object.freeze(nodes);
  }
  go(key) {
    return args => this.goTo(key, args);
  }
  async goTo(key, args, prev = null) {
    if (this.visited[key]) return;
    const node = this.nodes[key];
    this.current = node;
    if (!node) return;
    let result;
    if (this.func[node.key]) {
      result = await this.func[node.key](args, node.key, prev, node.next);
    }
    if (result === undefined) return;
    if (
      node.type === 'leaf' ||
      (node.type === 'root' && node.next.length === 0)
    ) {
      return result;
    } else {
      const out = {};
      for (const n of node.next) {
        out[n] = await this.goTo(n, result, node.key);
      }
      return out;
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
    this.visited = {};
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
  log(...msg) {
    console.log(
      '\x1b[2m',
      `at Node ["${this.current.key}"] from ["${this.current.prev}"]`,
      '\x1b[0m'
    );
    console.log(...msg);
  }
  test = {
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
      console.log('\x1b[32m', `PASS: ${desc}`, '\x1b[0m');
    },
    isEqual: (a, b) => {
      const typeA = typeof a,
        typeB = typeof b;
      if (typeA !== typeB) return false;
      if (typeA === 'number' || typeA === 'string' || typeA === 'boolean') {
        return a === b;
      }
      if (typeA === 'object') {
        const isArrayA = Array.isArray(a),
          isArrayB = Array.isArray(b);
        if (isArrayA !== isArrayB) return false;
        if (isArrayA && isArrayB) {
          if (a.length !== b.length) return false;
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
    tracePath: (leaf, out = '') => {
      out = out === '' ? leaf : leaf + ' -> ' + out;
      if (!this.nodes[leaf].prev) {
        return out;
      }
      return this.test.tracePath(this.nodes[leaf].prev, out);
    },
    root: root => ({
      input: inp => ({
        leaf: leaf => ({
          output: expected => ({
            should: async desc =>
              await this.goTo(root, inp).then(res =>
                res[leaf] === undefined
                  ? this.test.fail(desc, expected, res[leaf])
                  : this.test.isEqual(res[leaf], expected)
                  ? this.test.success(desc)
                  : this.test.fail(desc, expected, res[leaf]) ??
                    console.log(`\t${this.test.tracePath(leaf)}`)
              )
          })
        })
      })
    })
  };
}
