import * as fs from 'fs';
import { createTreeMap, traverse } from './graph.js';
import { build, errors } from './build.js';
import { logErrorMessage } from './logg.js';
const { readFile } = fs.promises;
export const settings = {
  file: '',
  files: [],
  indentBy: '\t',
  namespace: '__qvr'
};

const parse = (source, tokens) => {
  const rgx = Object.keys(tokens).join('|');
  const TokenRgx = new RegExp(rgx, 'g');
  return source.replace(TokenRgx, matched =>
    tokens[matched] ? tokens[matched] : matched
  );
};

const compileToJs = async () => {
  const mainGraphFile = await readFile(settings.file, 'utf8');
  if (!mainGraphFile.trim()) {
    errors.count++;
    logErrorMessage('Nothing to compile.');
    return { main: '', graph: {} };
  }
  const codeParts = mainGraphFile.split('>>->');
  if (codeParts.length > 2) {
    errors.count++;
    logErrorMessage('There can only be one js block on the top of each file');
  }
  const codeSplit = codeParts.length === 1 ? ['', codeParts[0]] : codeParts;
  const arrows = codeSplit[1]
    .trim()
    .split('\n')
    .map(line => line.split(' ->'));
  const treeMap = {};
  let compiledCode = '';
  arrows.forEach((lambda, index) => {
    if (lambda.length === 2) {
      const key = lambda[0].trim();
      createTreeMap(treeMap, lambda[0]);
      const expression = parse(lambda[1]?.trim(), settings.unaryTokens);
      const body = expression ? 'return ' + expression : '';
      let startBrace = index !== 0 ? '}\n' : '';
      compiledCode += `${startBrace}${
        settings.namespace
      }.arrows["${key}"] = async (value, key, prev, next) => {\n${
        body ? body + '\n' : ''
      }`;
    } else {
      const body = parse(lambda[0]?.trim(), settings.unaryTokens).split(':=');
      if (body?.length > 1) {
        body[0] = 'const ' + body[0] + '=';
      }
      compiledCode += body ? body.join('') + '\n' : '';
    }
    if (compiledCode && index === arrows.length - 1) compiledCode += '}';
  });
  compiledCode += ';';
  traverse(treeMap);
  return { main: codeSplit[0] + '\n' + compiledCode, graph: treeMap };
};

export const compile = async (
  file,
  files = [],
  indentBy = '\t',
  mime,
  namespace
) => {
  console.log('\x1b[1m', '\x1b[34m', `\n < ${file} >\n`, '\x1b[0m');
  settings.file = '.' + file;
  settings.files = files;
  settings.indentBy = indentBy;
  settings.mime = mime ?? 'js';
  settings.namespace = namespace;
  settings.unaryTokens = {
    '<- ': 'return '
  };
  const { main, graph } = await compileToJs();
  if (!main) {
    return;
  }
  await build(main, graph);
};
