/**
 * Owner wrapper for `react-virtuoso`. Long lists virtualize through
 * `VirtualizedList`; raw react-virtuoso imports elsewhere are an ESLint
 * boundary violation.
 */

export { VirtualizedList, type VirtualizedListProps } from './virtualized-list';
