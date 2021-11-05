import {
  logBoldMessage,
  logErrorIndentationLevel,
  logErrorAlreadyExists
} from './logg.js';
import { settings } from './compiler.js';
import { errors } from './build.js';

const backTrack = (node, parent, tree) =>
  node && parent && node.prev !== null && node.level - 1 === parent.level
    ? parent
    : node.level !== 0
    ? parent.prev && backTrack(node, tree[parent.prev], tree)
    : null;

let prev = null;
let group = -1;
export const createTreeMap = (tree, line) => {
  const current = line.trim();
  if (!current) return;
  const level = line.trimEnd().split(settings.indentBy).length - 1;
  logBoldMessage(
    '- ' + level + ' > ' + Array(level).fill(' ').join('') + current
  );
  if (!tree[current]) {
    tree[current] = {
      key: current,
      next: [],
      prev,
      level,
      group,
      type: 'root'
    };
    prev = current;
  } else {
    const line = Object.values(tree).findIndex(node => node.key === current);
    logErrorAlreadyExists({ key: current, prev, level }, settings.file, line);
    errors.count++;
  }
};

export const traverse = tree => {
  const values = Object.values(tree);
  values.forEach(current => {
    const parent = backTrack(current, tree[current.prev], tree);
    if (!parent && current.level === 0) {
      current.prev = null;
      group++;
    }
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
        logErrorIndentationLevel(current, settings.file, line);
        errors.count++;
      }
    }
    current.group = group;
  });
};
