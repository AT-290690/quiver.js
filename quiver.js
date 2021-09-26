import * as fs from 'fs';
const { readFile, mkdir, writeFile } = fs.promises;

const library = `const _qvr = { 
  memo: {}, 
  func: {}, 
  nodes: {},
  root: null,
  visited: {},
  goTo: async (key, prev, parent = null) => {
      const node = _qvr.nodes[key];
      if (!node) return;
      let result;
      if (typeof _qvr.func[node.key] === 'function')
          result = await _qvr.func[node.key](
          prev,
          node.key,
          parent,
          _qvr);
      if (result !== undefined && node.next) {
        node.next.forEach(n => {
          _qvr.goTo(n, result, node.key);
        });
      }
    },
    wrap: (callback = res => res) =>
      _qvr.func.forEach((fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args)))),
    setAsRoot: (nodeKey) => _qvr.root = nodeKey,
    run: (args) => _qvr.goTo(_qvr.root, args),
    visit: (current, callback) => {
      if (!_qvr.visited[current]) {
			  callback();
				_qvr.visited[current] = true;
			}
    }
  }`;

const monolithArr = [];
const monolithNodes = [];

export default async (file, files = []) => {
  const buildModular = async (main, graph) => {
    console.log(`\n^____${file}____\n`);
    const buildCode = `${library}
_qvr.nodes = ${JSON.stringify(graph)};
_qvr.setAsRoot(Object.values(_qvr.nodes).find(node => node.type === 'root').key)
${main}
_qvr.run();
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
      const root = Object.values(monolithNodes[0]).find(
        node => node.type === 'root'
      ).key;
      console.log(`\n[${root}]^____${files.join(' -> ')}____\n`);
      const buildCode = `${library}
  _qvr.nodes = ${JSON.stringify(
    monolithNodes.reduce((acc, item) => ({ ...acc, ...item }), {})
  )};
_qvr.setAsRoot(_qvr.nodes["${root}"].key);
${monolithArr.join('\n')}
_qvr.run();
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
    if (!tree[current]) {
      tree[current] = {
        key: current,
        next: [],
        prev,
        level,
        type: 'root'
      };
      prev = current;
    }
  };

  const backTrack = (node, parent, tree) =>
    node &&
    parent &&
    node.prev !== null &&
    (node.level - 1 === parent.level
      ? parent
      : backTrack(node, tree[parent.prev], tree));

  const traverseTreeMap = tree => {
    const values = Object.values(tree);
    values.forEach(current => {
      const parent = backTrack(current, tree[current.prev], tree);
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
    const arrows = mainGraphFile.split('\n').map(line => line.split('->'));
    const treeMap = {};
    let compiledCode = '';
    arrows.forEach((lambda, index) => {
      if (lambda.length === 2) {
        const key = lambda[0].trim();
        createTreeMap(treeMap, lambda[0]);
        const expression = lambda[1]?.trim();
        const body = expression ? 'return ' + expression : '';
        let startBrace = index !== 0 ? '}\n' : '';
        compiledCode += `${startBrace}_qvr.func["${key}"] = async (prev, current, parent, { nodes, memo, visited, visit, goTo, run, wrap, setAsRoot }) => {\n${
          body ? body + '\n' : ''
        }`;
      } else {
        const body = lambda[0]?.trim().replace(/<- /g, 'return ').split(':=');
        if (body?.length > 1) {
          body[0] = 'const ' + body[0] + '=';
        }
        compiledCode += body ? body.join('') + '\n' : '';
      }
      if (compiledCode && index === arrows.length - 1) compiledCode += '}';
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
