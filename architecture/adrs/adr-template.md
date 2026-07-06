# ADR NNNN: <short imperative title>

- **Status:** <Proposed | Accepted | Deprecated | Superseded by ADR-XXXX>
- **Date:** <YYYY-MM-DD>
- **Deciders:** <names or roles who approved the decision>
- **Related:** <links to rules/, docs/exceptions/, or prior ADRs this touches; "none" if none>

## Context

<What situation forces a decision? Describe the problem in terms of this repository:
which modules, layers, packages, or gates are affected, and what breaks or degrades
if no decision is made. State constraints (stack versions, release gates, boundary
rules) as facts, not opinions. 2–4 paragraphs.>

## Decision

<The decision in one or two sentences, written in the present tense: "We use X for Y."
Then the concrete shape of the decision in this repo: which files/directories it
creates or changes, which ESLint rule or npm script enforces it, which layer owns it.
A decision that nothing enforces is a wish — name the enforcement mechanism.>

## Consequences

### Positive

- <Benefit, stated concretely: what becomes possible, cheaper, or safer.>
- <...>

### Negative / accepted costs

- <Cost we knowingly accept: learning curve, extra indirection, maintenance burden.>
- <...>

### Revisit trigger

<The observable condition under which this decision MUST be re-evaluated with a new
ADR — e.g. "if the wrapped package ships a breaking major", "if the workbench route
can no longer represent a primitive's states". Every ADR has one; "never" is not a trigger.>

## Alternatives considered

### <Alternative A>

<What it is, why it was plausible, and the specific reason it lost. Be fair to it —
future readers must trust that it was genuinely weighed.>

### <Alternative B>

<Same treatment.>

### Do nothing

<What happens if we keep the status quo. Required section — if "do nothing" is
acceptable, the ADR is probably unnecessary.>
