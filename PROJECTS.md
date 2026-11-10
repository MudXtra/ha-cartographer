# Project boundaries

PROJECTS.md is a maintained map of verified facts, not a task list or source of new permission. Never record secrets, real connection strings, or sensitive data.

## Files and paths
- `Realm.slnx` is the solution. SDK policy: `global.json` (10.0.100, `rollForward: latestFeature`). Shared settings: `Directory.Build.props`, `Directory.Packages.props` (central package versions).
- `src/Realm.Web` owns the Blazor Web App (Interactive Server, MudBlazor and MudX), the Ingress hosting, endpoints, theme tokens and the browser assets (`wwwroot/js`, `wwwroot/css`).
- `src/Realm.Domain` owns pure domain logic (places, geometry, snapshots); `src/Realm.Infrastructure` owns Home Assistant ingestion, SQLite persistence (EF Core), avatars and statistics; `src/Realm.Demo` owns Demo mode data.
- Tests: `tests/Realm.Domain.Tests`, `tests/Realm.Ingestion.Tests`, `tests/Realm.Data.Tests`, `tests/Realm.Demo.Tests`, `tests/Realm.Web.Tests` (bUnit) with shared fakes in `tests/Realm.TestKit`; JavaScript tests in `tests/js` (`node:test`); browser tests in `tests/e2e` (Playwright); contract payloads in `tests/contract`.
- Add-on package: `realm/` (`config.yaml`, `DOCS.md`, `CHANGELOG.md`, `translations/`), root `Dockerfile`, `repository.yaml`.
- CI and release: `.github/workflows/ci.yml`, `.github/workflows/release.yml`, `tools/ci/` (see `tools/ci/README.md`).
- Protected: `src/Realm.Web/wwwroot/lib/` (vendored MapLibre; update only through `tools/vendor-maplibre.sh`), `LICENSE`, `LICENSES/`, `THIRD-PARTY-NOTICES.md` (change only with a dependency change), `.github/workflows/release.yml` (changes need approval).

## Verification prerequisites and evidence
Run commands from the repository root. Run a focused test before its full test project; use `--no-build` only after a successful matching build. Use the whole solution only when shared settings, packages or cross-project wiring change. The final report names every command run and its outcome, and every relevant check not run and why.

## Targeted commands

```text
dotnet build <project.csproj> --nologo
dotnet test <test project.csproj> --filter "FullyQualifiedName~<test name>" --nologo --blame-hang --blame-hang-timeout 30s
dotnet test <test project.csproj> --no-build --nologo --blame-hang --blame-hang-timeout 30s
dotnet format <project.csproj> --include <changed files>
npm ci --ignore-scripts
node --test "tests/js/**/*.test.mjs"
npm run typecheck
node tools/ci/guards.mjs
node tools/ci/validate-addon.mjs
node tools/ci/validate-styles.mjs --offline
```

CI (`ci.yml`) additionally runs the full solution in Release, `tools/ci/image-smoke.sh` against the built image, and the Playwright suite against a Demo-mode publish (`npx playwright test --config tests/e2e/playwright.config.ts`). Those need Docker or a Playwright browser; rely on CI for them unless the change touches the image or the browser flow.
