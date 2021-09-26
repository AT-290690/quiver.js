import * as fs from 'fs';
const { readFile, mkdir, writeFile } = fs.promises;
const library = `const _qvr = { 
  memo: {}, 
  func: {}, 
  nodes: {},
  root: null,
  visited: {},
  goTo: async (key, args, prev = null) => {
      const node = _qvr.nodes[key];
      if (!node) return;
      let result;
      if (typeof _qvr.func[node.key] === 'function')
          result = await _qvr.func[node.key](
          args,
          node.key,
          prev,
          node.next,
          _qvr);
      if (result !== undefined && node.next) {
        node.next.forEach(n => {
          _qvr.goTo(n, result, node.key, _qvr.nodes[n]?.next ?? []);
        });
      }
    },
    wrap: (callback = res => res) =>
      _qvr.func.forEach((fn, i) => (_qvr.func[i] = (...args) => callback(fn(...args)))),
    setRoot: (key) => _qvr.root = key,
    getRoot: () => _qvr.root,
    visit: (key) => {
      if (!_qvr.visited[key]) {
				_qvr.visited[key] = true;
        return { goTo: _qvr.goTo, visit: _qvr.visit }
			} else {
        return { goTo: () => undefined, visit: _qvr.visit }
      }
    }
  }`;
const logBoldMessage = msg => console.log('\x1b[1m', msg);
const logErrorMessage = msg =>
  console.log('\x1b[31m', '\x1b[1m', msg, '\x1b[0m');
const logSuccessMessage = msg =>
  console.log('\x1b[32m', '\x1b[1m', msg, '\x1b[0m');
const logWarningMessage = msg =>
  console.log('\x1b[33m', '\x1b[1m', msg, '\x1b[0m');
const logErrorIndentationLevel = (node, file, line) =>
  console.log(
    '\x1b[31m',
    '\x1b[1m',
    `${node.key} should be exactly 1 indentation from the parent!`
  ) ||
  console.log('\x1b[31m', `   Near ${node.prev}`) ||
  console.log(
    '\x1b[31m',
    '\x1b[1m',
    `  At file: ${file} line: ${line + 1} indentation: ${node.level}`,
    '\x1b[0m'
  );

const logErrorAlreadyExists = (node, file, line) =>
  console.log('\x1b[31m', '\x1b[1m', `${node.key} already exist!`) ||
  console.log('\x1b[31m', `   Near ${node.prev}`) ||
  console.log(
    '\x1b[31m',
    '\x1b[1m',
    `  file: ${file} line: ${line + 1} indentation: ${node.level}`,
    '\x1b[0m'
  );

const monolithArr = [];
const monolithNodes = [];
let errorCount = 0;
export default async (file, files = []) => {
  console.log('\x1b[1m', '\x1b[34m', `\n < ${file} >\n`, '\x1b[0m');
  const buildModular = async (main, graph) => {
    logWarningMessage(`\n< ${file} >\n`);
    const buildCode = `${library}
_qvr.nodes = ${JSON.stringify(graph)};
_qvr.setRoot(Object.values(_qvr.nodes).find(node => node.type === 'root').key)
${main}
_qvr.goTo(_qvr.root);
export default _qvr`;
    const path = file.split('/');
    const filename = path.pop().split('.go')[0];
    const dir = path.join('/');
    await mkdir(`./${dir}/dist`, { recursive: true });
    await writeFile(`./${dir}/dist/${filename}.js`, buildCode);
    logSuccessMessage(`${filename}.js is generated!`);
    errorCount
      ? logErrorMessage(
          errorCount === 1
            ? `Found ${errorCount} error!`
            : `Found ${errorCount} errors!`
        )
      : logSuccessMessage(`No errors found!`);
    errorCount = 0;
  };
  const buildMonolithic = async (main, graph) => {
    monolithNodes.push(graph);
    monolithArr.push(main);
    if (files.length === monolithNodes.length) {
      const root = Object.values(monolithNodes[0]).find(
        node => node.type === 'root'
      ).key;
      logWarningMessage(`\n< [${root}] ${files.join(' -> ')} >\n`);
      const buildCode = `${library}
  _qvr.nodes = ${JSON.stringify(
    monolithNodes.reduce((acc, item) => ({ ...acc, ...item }), {})
  )};
_qvr.setRoot(_qvr.nodes["${root}"].key);
${monolithArr.join('\n')}
_qvr.goTo(_qvr.root);
export default _qvr`;
      const dubs = new Set();
      monolithNodes.forEach(collection => {
        const array = Object.values(collection);
        array.forEach((current, index) => {
          if (dubs.has(current.key)) {
            logErrorAlreadyExists(current, file, index);
            errorCount++;
          } else {
            dubs.add(current.key);
          }
        });
      });
      const path = file.split('/');
      const filename = path.pop().split('.go')[0];
      const dir = path.join('/');
      await mkdir(`./${dir}/dist`, { recursive: true });
      await writeFile(
        `./${dir}/dist/${files[0].split('.go')[0]}.js`,
        buildCode
      );
      logSuccessMessage(`${files[0].split('.go')[0]}.js is generated!`);
      errorCount
        ? logErrorMessage(
            errorCount === 1
              ? `Found ${errorCount} error!`
              : `Found ${errorCount} errors!`
          )
        : logSuccessMessage(`No errors found!`);
      errorCount = 0;
      monolithArr.length = 0;
      monolithNodes.length = 0;
    }
  };
  let prev = null;
  const createTreeMap = (tree, line) => {
    const current = line.trim();
    if (!current) return;
    const level = line.trimEnd().split('\t').length - 1;
    logBoldMessage(
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
    } else {
      const line = Object.values(tree).findIndex(node => node.key === current);
      logErrorAlreadyExists({ key: current, prev, level }, file, line);
      errorCount++;
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
      } else if (current.level !== 0) {
        const diff = current.level - tree[current.prev]?.level;
        if (diff !== 1) {
          const line = Object.values(tree).findIndex(
            node => node.key === current.key
          );
          logErrorIndentationLevel(current, file, line);
          errorCount++;
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
        compiledCode += `${startBrace}_qvr.func["${key}"] = async (args, key, prev, next, { nodes, memo, visited, visit, goTo, wrap, setRoot, getRoot }) => {\n${
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
