/**
 * Promotes warning-level preset rules to errors without changing rules that
 * are deliberately disabled. This keeps third-party recommended presets under
 * the repository's zero-warning contract as those presets evolve.
 */

function promoteSetting(setting) {
  if (setting === 'warn' || setting === 1) {
    return 'error';
  }

  if (Array.isArray(setting) && (setting[0] === 'warn' || setting[0] === 1)) {
    return ['error', ...setting.slice(1)];
  }

  return setting;
}

export function enforceErrorSeverity(configurations) {
  return configurations.map((configuration) => {
    if (!configuration.rules) {
      return configuration;
    }

    return {
      ...configuration,
      rules: Object.fromEntries(
        Object.entries(configuration.rules).map(([ruleId, setting]) => [
          ruleId,
          promoteSetting(setting),
        ]),
      ),
    };
  });
}
