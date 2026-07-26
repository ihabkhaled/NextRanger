import { ESLint } from 'eslint';

const SAMPLE_FILES = [
  'src/app/layout.tsx',
  'src/shared/utils/string.utils.ts',
  'src/tests/unit/packages-ui-primitives.test.tsx',
  'next.config.ts',
];

function isWarning(setting) {
  const severity = Array.isArray(setting) ? setting[0] : setting;

  return severity === 1 || severity === 'warn';
}

const eslint = new ESLint();
const warnings = [];

for (const filePath of SAMPLE_FILES) {
  const configuration = await eslint.calculateConfigForFile(filePath);

  for (const [ruleId, setting] of Object.entries(configuration?.rules ?? {})) {
    if (isWarning(setting)) {
      warnings.push(`${filePath}: ${ruleId}`);
    }
  }
}

if (warnings.length > 0) {
  throw new Error(`Every enabled ESLint rule must be an error:\n${warnings.join('\n')}`);
}
