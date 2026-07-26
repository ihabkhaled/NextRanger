/**
 * Dependency graph gate. This replaces Madge, whose TypeScript peer range is
 * pinned to TypeScript 5 and cannot coexist cleanly with the TS7/TS6 toolchain.
 */

module.exports = {
  forbidden: [
    {
      name: 'no-circular',
      comment: 'The source graph must remain acyclic.',
      severity: 'error',
      from: {},
      to: { circular: true },
    },
    {
      name: 'no-unresolvable',
      comment: 'Every internal import must resolve during graph analysis.',
      severity: 'error',
      from: {},
      to: { couldNotResolve: true },
    },
  ],
  options: {
    includeOnly: '^src/',
    tsConfig: { fileName: 'tsconfig.app.json' },
    doNotFollow: { path: 'node_modules' },
  },
};
