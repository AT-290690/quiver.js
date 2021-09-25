import * as fs from 'fs';
const { readFile, mkdir, writeFile } = fs.promises;

const library = `const _qvr = { 
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
  }`;
const helpers = `const root = (node) => _qvr.root = node;
const run = (args) => _qvr.dfs(_qvr.root, {...args, quiver: _qvr });`;
const monolithArr = [];
const monolithNodes = [];

export default async (file, files = []) => {
  const buildModular = async (main, graph) => {
    console.log(`\n^____${file}____\n`);
    const buildCode = `${library}
_qvr.nodes = ${JSON.stringify(graph)};
_qvr.root = Object.values(_qvr.nodes).find(node => node.type === 'root');
${helpers}
${main}
run();
export default _qvr`;
    const path = file.split('/');
    const filename = path.pop().split('.go')[0];
    const dir = path.join('/');
    await mkdir(`./${dir}/dist`, { recursive: true });
    await writeFile(`./${dir}/dist/${filename}.js`, buildCode);
    console.log(`${filename}.js is generated!`);
  };
  const buildMonolithic = async (main, graph) => {
    monolithNodes.push(graph);
    monolithArr.push(main);
    if (files.length === monolithNodes.length) {
      console.log(`\n^____${files.join(' -> ')}____\n`);
      const buildCode = `${library}
  _qvr.nodes = ${JSON.stringify(
    monolithNodes.reduce((acc, item) => ({ ...acc, ...item }), {})
  )};
_qvr.root = _qvr.nodes["${
        Object.values(monolithNodes[0]).find(node => node.type === 'root').key
      }"];
${helpers}
${monolithArr.join('\n')}
run();
export default _qvr`;
      const path = file.split('/');
      const filename = path.pop().split('.go')[0];
      const dir = path.join('/');
      await mkdir(`./${dir}/dist`, { recursive: true });
      await writeFile(
        `./${dir}/dist/${files[0].split('.go')[0]}.js`,
        buildCode
      );
      console.log(`${files[0].split('.go')[0]}.js is generated!`);
      monolithArr.length = 0;
      monolithNodes.length = 0;
    }
  };
  let prev = null;
  const createTreeMap = (tree, line) => {
    const current = line.trim();
    if (!current) return;
    const level = line.trimEnd().split('\t').length - 1;
    console.log(
      '- ' + level + ' > ' + Array(level).fill(' ').join('') + current
    );
    if (!tree[line.trim()]) {
      tree[current] = {
        key: current,
        next: [],
        level,
        type: 'root',
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
        if (current.next.length === 0) {
          current.type = 'leaf';
        }
        if (parent.level !== 0) {
          parent.type = 'branch';
        }
      }
    });
  };

  const compileToJs = async () => {
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
        compiledCode += `${startBrace}_qvr.func["${x[0].trim()}"] = async (prev, current, parent, nodes, memo, goTo) => {\n${
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
  files.length
    ? await buildMonolithic(main, graph)
    : await buildModular(main, graph);
};
