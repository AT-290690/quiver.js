import * as fs from 'fs';
import { createTreeMap, traverse } from './graph.js';
import { build } from './build.js';
const { readFile } = fs.promises;

export const settings = {
  file: '',
  files: [],
  indentBy: '\t',
  unaryTokens: {
    '<- ': 'return ',
    '#': '__qvr.go',
    '#!': '__qvr.leave',
    '!#': '__qvr.visit'
  }
};
const parse = (source, tokens) => {
  const rgx = Object.keys(tokens).join('|');
  const TokenRgx = new RegExp(rgx, 'g');
  return source.replace(TokenRgx, matched => {
    if (tokens[matched]) {
      return tokens[matched];
    } else {
      return matched;
    }
  });
};

const compileToJs = async () => {
  const mainGraphFile = await readFile(settings.file, 'utf8');
  if (!mainGraphFile.trim()) return;
  const arrows = mainGraphFile.split('\n').map(line => line.split('->'));
  const treeMap = {};
  let compiledCode = '';
  arrows.forEach((lambda, index) => {
    if (lambda.length === 2) {
      const key = lambda[0].trim();
      createTreeMap(treeMap, lambda[0]);
      const expression = parse(lambda[1]?.trim(), settings.unaryTokens);
      const body = expression ? 'return ' + expression : '';
      let startBrace = index !== 0 ? '}\n' : '';
      compiledCode += `${startBrace}__qvr.func["${key}"] = async (VALUE, KEY, PREV, NEXT) => {\n${
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
  return { main: compiledCode, graph: treeMap };
};

export const compile = async (file, files = [], indentBy = '\t', mime) => {
  console.log('\x1b[1m', '\x1b[34m', `\n < ${file} >\n`, '\x1b[0m');
  settings.file = '.' + file;
  settings.files = files;
  settings.indentBy = indentBy;
  settings.mime = mime ?? 'js';
  const { main, graph } = await compileToJs();
  await build(main, graph);
};
