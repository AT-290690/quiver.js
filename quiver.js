import * as fs from 'fs';
const { readFile, mkdir, writeFile } = fs.promises;
export default async file => {
  const buildStandAlone = async (main, graph) => {
    const buildCode = `
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

  const nodes = ${JSON.stringify(graph)};
  const root = Object.values(nodes).find(node => node.type === 'root');
  const run = (method, req,res) => {
    _qvr.dfs(root, { req, res, method, quiver: _qvr }, nodes);
  };
  ${main}
  _qvr.dfs(root);
  `;
    const path = file.split('/');
    const filename = path.pop().split('.qu')[0];
    const dir = path.join('/');
    await mkdir(`./${dir}/dist`, { recursive: true });
    await writeFile(`./${dir}/dist/${filename}.js`, buildCode);
  };

  let prev = null;
  const createTreeMap = (tree, line) => {
    const current = line.trim();
    if (!current) return;
    const level = (line.split(' ').length - 2) / 2;
    console.log('- ' + level + ' > ' + line);
    if (!tree[line.trim()]) {
      tree[current] = {
        key: current,
        next: [],
        level,
        type: 'leaf',
        prev: prev
      };
      prev = current;
    }
  };

  const backTrack = (node, parent, tree) =>
    node &&
    node.prev !== null &&
    parent &&
    (node.level - 1 === parent.level
      ? parent
      : backTrack(node, tree[parent.prev], tree));

  const traverseTreeMap = tree => {
    const values = Object.values(tree);
    values.forEach(current => {
      const parent =
        tree[current.prev] && backTrack(current, tree[current.prev], tree);
      if (parent) {
        parent.next.push(current.key);
        current.prev = parent.key;
        if (parent.level !== 0) {
          parent.type = 'branch';
        } else {
          parent.type = 'root';
        }
      }
    });
  };

  const compileToJs = async () => {
    console.log('Generating tree structure:\n');
    const mainGraphFile = await readFile(file, 'utf8');
    if (!mainGraphFile.trim()) return;
    const arrows = mainGraphFile.split('\n').map(x => x.split('->'));
    const treeMap = {};
    let compiledCode = '';
    arrows.forEach((x, i) => {
      if (x.length === 2) {
        createTreeMap(treeMap, x[0]);
        const expression = x[1]?.trim();
        const body = expression ? 'return ' + expression : '';
        let startBrace = i !== 0 ? '}\n' : '';
        compiledCode += `${startBrace}_qvr.func["${x[0].trim()}"] = async (prev, current, parent, nodes, memo, dfs) => {\n${
          body ? body + '\n' : ''
        }`;
      } else {
        const body = x[0]?.trim().replace(/<- /g, 'return ').split(':=');
        if (body?.length > 1) {
          body[0] = 'const ' + body[0] + '=';
        }
        compiledCode += body ? body.join('') + '\n' : '';
      }
      if (compiledCode && i === arrows.length - 1) compiledCode += '}';
    });
    compiledCode += ';';
    traverseTreeMap(treeMap);
    return { main: compiledCode, graph: treeMap };
  };

  const { main, graph } = await compileToJs();
  await buildStandAlone(main, graph);
  console.log('\n Done!');
};
