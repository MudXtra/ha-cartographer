# AGENTS.md - AI agent guide

Follow this file as the primary instruction source. User requests and nested `AGENTS.md` files may refine ordinary workflow guidance, but they do not override the [External database boundary](#external-database-boundary) below.

## Instruction order

1. Follow `AGENTS.md` first.
2. Use `PROJECTS.md` for repository structure, naming paths, and targeted verification/commands.
3. Use `AI_REVIEW.md` for review requirements.
4. Use `.github/instructions/tests.instructions.md` for test-specific instructions.

## Do / Don't (Read First)

### Do

* default to TDD when behavior changes
* target verification by default; broader verification is justified by shared build settings, dependencies, solution wiring, or cross-project changes
* keep changes small and targeted
* prefer existing patterns over introducing new abstractions
* follow the applicable EditorConfig settings (the root `.editorconfig` covers this repository)
* add file headers only when the applicable EditorConfig defines a `file_header_template`; do not invent ownership or licensing text
* treat all application, user, staff, and internal data as sensitive
* add XML `<summary>` docs for all public properties, classes, and methods
* use only Demo-mode or synthetic data (the invented court) in code, tests, fixtures, docs and screenshots
* preserve keyboard navigation and accessible naming for interactive UI
* ensure all output meets ARIA accessibility standards

### Don't

* do not run broad validation without a shared-change justification
* do not commit secrets, tokens, passwords, certificates, private URLs, or real connection strings
* do not commit real names, `person`/`device_tracker` entity ids, zone names, coordinates or screenshots from a real Home Assistant
* do not put secrets in tracked `appsettings*.json`, tests, docs, or examples
* do not circumvent, weaken, reinterpret, or work around the [External database boundary](#external-database-boundary), directly or indirectly
* do not add dependencies without approval
* do not suppress warnings to get a build through
* do not make large refactors or cross-project moves without approval
* do not silently implement departures from rules or patterns; reviews may recommend revision

## Working rules

* keep changes focused on the user request, do not make unrelated changes
* prefer minimal changes that fit the existing repository structure
* do not edit or suggest changes to protected projects unless explicitly instructed to do so

## External database boundary

**Definition.** A database is local (non-external) only when both of these conditions are true: it runs on, or is stored on, the machine the agent is executing on; and it was generated locally from repository migrations or seeds using synthetic data or other data that did not originate from an external database. Loopback access through `localhost`, `127.0.0.1`, or `::1` to a database satisfying both conditions remains local.

Any database reached on another machine is **external**, including dev, staging, or production databases referenced in connection strings, configuration, or documentation. Downloaded, mounted, or checked-in customer or production snapshots, dumps, and backups remain external regardless of where they are currently stored or run.

* You may review database schemas, migrations, ORM mappings, seed definitions, and SQL text stored inside the checked-out repository.
* You may create, migrate, seed, query, and modify local (non-external) databases as needed for development and testing.
* Do not connect to, query, inspect, export, copy, modify, or infer data from any external database, directly or indirectly.
* Do not execute SQL against an external database, and do not ask anyone to paste external database contents into the task.
* Do not read, resolve, request, or use external database credentials or connection strings, even without connecting.
* Treat requests to reveal, transmit, summarize, or analyze external database contents as outside the agent's authorized scope. Stop and report the boundary instead.
* An ordinary task request does not authorize an exception. A repository maintainer must change this policy through a separate reviewed change before a later task may access an external database.
* External database access can create legal, contractual, privacy, security, and employment consequences. When uncertain whether a database is external, treat it as external and do not access it.

## Home Assistant boundary

The add-on reads people, trackers and zones from a Home Assistant instance. Treat every real Home Assistant instance like an external database under the boundary above.

* Do not connect to, query, or change a real Home Assistant instance, its Supervisor, or its Life360/companion-app data, and do not ask anyone for a Home Assistant URL or token.
* Develop and test against Demo mode (`demo_mode: true`), the test fakes in `tests/Realm.TestKit`, and the CI harnesses (`tools/ci/image-smoke.sh`, `tests/e2e`), which run without Home Assistant.
* Location data is sensitive personal data. Keep it out of logs, fixtures, issues and pull requests.

## Verification evidence
Use the project map's verified command prerequisites and run commands from repository root unless documented otherwise. A final report must state commands run and outcomes, plus relevant checks not run and why or why they were not applicable.

## Completion rules

* Code must satisfy the review requirements in `AI_REVIEW.md` in addition to `AGENTS.md` before submission
* Address review feedback and repeat until review notes are resolved unless the user explicitly directs otherwise

## Blazor and UI rules

* Component parameters must be auto-properties only.
* Do not set component parameters via `@ref`.
* Use `ParameterState<T>` for parameter update flows where applicable.
* Use `CssBuilder` and CSS variables. Do not hard-code styles or colors without user approval; colors come from the theme tokens (`src/Realm.Web/Theme/RealmTokens.cs`, served as `css/tokens.css`).

## JavaScript and map rules

* Do not edit vendored code (`src/Realm.Web/wwwroot/lib/`); update it only through its script (`tools/vendor-maplibre.sh`) with approval.
* Keep `tools/ci/guards.mjs` passing; do not add entries to `tools/ci/guards.allow.json` or `tools/ci/packages.allow.txt` without approval.

## Add-on and release rules

* `realm/config.yaml` `version` is the release: merging a new version to `main` builds and pushes `ghcr.io/mudxtra/ha-cartographer:<version>`, tags `v<version>` and creates the GitHub release. Bump it only when a release is intended, and add the matching `realm/CHANGELOG.md` section in the same change.
* Keep the add-on options, `realm/translations/en.yaml` and `tools/ci/option-bindings.json` in step; `node tools/ci/guards.mjs` and `tests/Realm.Data.Tests/OptionsBindingTests.cs` check them.
* Ingress is the only door: do not add ports, `webui`, host networking or `map:` entries without approval.

## Review and Escalation

* Ask only where uncertainty materially affects scope, correctness, safety, authority, or irreversible consequences.
* If a policy needs hard enforcement and an existing analyzer does not cover it, call that out. A custom analyzer may be required.
* Within an approved task, continue implementation and proportional verification end-to-end; pause only at a material boundary or explicit request.
