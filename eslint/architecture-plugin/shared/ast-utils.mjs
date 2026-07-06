/**
 * AST helpers shared by the frontend-architecture rules.
 */

/** True when an identifier name follows the React hook naming convention. */
export function isHookName(name) {
  return /^use[A-Z0-9]/.test(String(name));
}

/** React built-in hooks that must never appear in presentational components. */
export const REACT_BUILTIN_HOOKS = new Set([
  'useState',
  'useEffect',
  'useLayoutEffect',
  'useMemo',
  'useCallback',
  'useRef',
  'useContext',
  'useReducer',
  'useTransition',
  'useDeferredValue',
  'useId',
  'useSyncExternalStore',
  'useImperativeHandle',
  'useInsertionEffect',
  'useActionState',
  'useOptimistic',
  'use',
]);

/** True when the value node is a function expression of any kind. */
export function isFunctionValue(node) {
  return (
    node !== null &&
    node !== undefined &&
    (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression')
  );
}

/** Node.js built-in module prefixes that must never reach client bundles. */
const NODE_BUILTIN_MODULES = new Set([
  'assert',
  'buffer',
  'child_process',
  'cluster',
  'crypto',
  'dgram',
  'dns',
  'events',
  'fs',
  'http',
  'http2',
  'https',
  'net',
  'os',
  'path',
  'perf_hooks',
  'process',
  'querystring',
  'readline',
  'stream',
  'string_decoder',
  'tls',
  'tty',
  'url',
  'util',
  'v8',
  'vm',
  'worker_threads',
  'zlib',
]);

/** True when an import specifier targets a Node.js built-in. */
export function isNodeBuiltinImport(importPath) {
  const specifier = String(importPath);

  if (specifier.startsWith('node:')) {
    return true;
  }

  const [head] = specifier.split('/');

  return NODE_BUILTIN_MODULES.has(head ?? '');
}
