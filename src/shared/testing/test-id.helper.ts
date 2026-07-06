/**
 * Build derived test ids for repeated elements (e.g. `article-card-42`).
 */
export function buildIndexedTestId(baseTestId: string, suffix: string | number): string {
  return `${baseTestId}-${suffix}`;
}
