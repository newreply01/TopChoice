# TopChoice Campaign Strategy Game

Version: 1.0

Product: Single-player fictional election campaign strategy game

Runtime: Static HTML, CSS, and JavaScript; deployable on GitHub Pages

## Product Loop

The player is the candidate. A campaign lasts five stages:

1. Candidate setup: enter a candidate name, choose one of three candidate styles, and choose one of three starting resource packs.
2. Campaign team: hire exactly three of five staff specialties. Each member changes starting resources, voter support, or event bonuses.
3. Policy platform: choose exactly three of six fictional policy cards. Policies influence different voter groups.
4. Campaign trail: play four distinct random events from a six-event deck. Choose one response per event, respecting resource costs and any staff or policy synergy.
5. Election night: compare weighted voter-group support against the AI opponent. A simulated share above 50% is a win; otherwise the opponent wins.

A completed game can be restarted with a new event order and a different candidate, team, resource pack, and policy combination.

## Candidate Styles

- Local organizer: starts with an additional volunteer and a small family-support bonus.
- Policy planner: starts with additional public trust.
- Communicator: starts with additional media reach and youth support.

The player may set a fictional candidate name. The current game does not load real candidates, parties, districts, polls, or election data.

## Campaign Resources

- Funds: spent to prepare policy materials, move events indoors, and run public communications.
- Volunteers: spent on field organizing, community events, and local outreach.
- Media reach: spent or gained by rapid response, broadcasts, and public messaging.
- Public trust: a bounded attribute affected by candidate style, policy transparency, and event choices.

Starting packs emphasize field volunteers, balanced resources, or media reach. Team hires add resources and can activate event-specific bonuses. An event option is disabled when its resource cost cannot be paid.

## Team and Policy Systems

Five staff specialties: field organization, policy, media, fundraising, and polling analysis. Exactly three can be hired.

Six policy themes: housing, transportation, education and care, climate resilience, local industry, and fiscal transparency. Exactly three become the campaign platform. Each policy has explicit support effects for fictional voter segments; no policy is treated as objectively correct.

## Random Events

Each game draws four unique events from a six-card deck. Current event themes are weather disruption, candidate forum, transport issue attention, fundraising invitation, policy cost questions, and schedule conflict.

Every event presents two responses, their resource costs, and any staff or platform synergy. The selected response changes resources, trust, and voter-group support. Event text must stay generic and fictional; it must not imply real-world misconduct or attribute unverified claims to real people.

## Election Simulation

The player and AI are compared across four fictional voter groups: young renters, commuting households, families, and local businesses. Each group has a declared weight. Candidate style, hired staff, selected policies, remaining trust/media resources, and event choices modify support. The game applies a small random swing, clamps the final share to a reasonable range, and displays both the overall result and group-level support.

The result is a game outcome, not a poll, forecast, or statement about any real election. The displayed calculation and group weights should remain visible and editable for balance testing.

## Technical Structure

- `index.html`: root redirect to the campaign game.
- `campaign.html`: campaign stage shell, resource rail, election log, and rules dialog.
- `campaign.js`: game data, phase transitions, team/policy selections, event resolution, AI opponent, and election calculation.
- `campaign.css`: campaign board layout and responsive styles.
- `README.md`: preview instructions and current playable rules.
- `PRODUCT_SPEC.md`: design decisions and gameplay contract.

The previous candidate-comparison prototype files remain in the repository as legacy material but are no longer loaded by the root game entry. The current campaign game does not use a backend, account system, or local candidate-data editor.

## Acceptance Criteria

- Root URL opens the campaign game.
- Candidate name, style, and starting resource pack are selectable.
- Exactly three staff and three policy cards are required before continuing.
- Four distinct random events are presented; unaffordable responses cannot be selected.
- Staff and policy synergies affect only their documented event choices.
- The election screen shows both vote shares and all four voter groups; shares total 100% and the winner follows the 50% rule.
- Restart returns to setup and supports a new random event order.
- Desktop and mobile layouts remain usable without horizontal overflow.
- All game characters, policy packages, voters, events, and results are clearly marked fictional.
