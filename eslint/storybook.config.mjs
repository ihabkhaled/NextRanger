/**
 * Storybook lint slot.
 *
 * This repo ships a component workbench route group
 * (src/app/(workbench)/workbench) instead of Storybook — see
 * architecture/adrs/0002-component-workbench-instead-of-storybook.md.
 * Workbench pages are ordinary app routes and are linted by every other
 * config. If Storybook is adopted later, register eslint-plugin-storybook
 * here and keep the root orchestrator unchanged.
 */

export default [];
