# Claude Code

This project uses the Payload CMS skill at `.claude/skills/payload/`.
Start with `.claude/skills/payload/SKILL.md` for a quick reference, then see `.claude/skills/payload/reference/` for detailed docs.

## Product: tok-scan

- The product name is always **tok-scan**. "Mahob" in the design guide is only sample restaurant data.
- Read [`docs/README.md`](docs/README.md) first: it holds the module list, build order and tenancy model (Organization → Outlets).
- Before building any module, read its spec in `docs/modules/`, and follow the tenant scoping rules in [`docs/modules/14-organization-tenant.md`](docs/modules/14-organization-tenant.md) §5.
- Visual design source of truth: `Tok_UIUX_Design_Guide.pdf` (28 pages). `Mahob_UIUX_Design_Guide.pdf` is the older single-restaurant version.
- Code layout: feature modules in `src/modules/<module>/<submodule>/`. Read [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) before adding code.
- Formatting: Prettier with **5-space indentation**.
- Package manager: yarn only, never npm.
