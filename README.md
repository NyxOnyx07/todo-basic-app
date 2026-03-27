# Oz Skills

A curated collection of reusable [Agent Skills](https://agentskills.io) for Warp AI agents and Oz.

## What Are Agent Skills?

Agent Skills are markdown files that teach AI agents about your conventions, best practices, and workflows. When you work with agents in Warp, they automatically discover and use these skills to provide context-aware help.

Think of skills as onboarding guides that help agents understand how you work.

## How Skills Work

- **Skills live in `.agents/skills/` directories** - either in your project (`.agents/skills/`) or globally (`~/.agents/skills/`)
- **Each skill is a folder** containing a `SKILL.md` file with YAML frontmatter and markdown content
- **Warp agents automatically discover** and load skills when relevant to your current task

## Using These Skills

To use a skill from this repository:

1. Copy the skill folder (e.g., `docs-update`) from `.agents/skills/` 
2. Paste it into your project's `.agents/skills/` directory, or
3. Paste it into `~/.agents/skills/` to use it across all projects

Warp will automatically detect the new skill on your next interaction.

## Available Skills

| Skill | Description |
|-------|-------------|
| [ci-fix](.agents/skills/ci-fix/) | Diagnose and fix GitHub Actions CI failures. Inspects workflow runs and logs, identifies root causes, and implements minimal fixes. |
| [create-pull-request](.agents/skills/create-pull-request/) | Create a GitHub pull request following project conventions, including commit analysis, branch management, and PR creation via `gh`. |
| [docs-update](.agents/skills/docs-update/) | Automatically review recent code changes and update user-facing documentation to keep it synchronized with the codebase. |
| [github-bug-report-triage](.agents/skills/github-bug-report-triage/) | Triage GitHub bug reports for actionability and identify missing information from the reporter. |
| [github-issue-dedupe](.agents/skills/github-issue-dedupe/) | Detect duplicate GitHub issues using semantic search and keyword matching—run manually or via GitHub Actions. |
| [mcp-builder](.agents/skills/mcp-builder/) | Build high-quality MCP (Model Context Protocol) servers in Python (FastMCP) or Node/TypeScript (MCP SDK). |
| [scheduler](.agents/skills/scheduler/) | Schedule on-device reminders and local actions such as notifications and local scripts. |
| [seo-aeo-audit](.agents/skills/seo-aeo-audit/) | Optimize for search engine visibility, ranking, and AI citations—covers meta tags, structured data, and AEO. |
| [slack-qa-investigate](.agents/skills/slack-qa-investigate/) | Investigate repository questions in read-only mode, providing research-backed answers from the codebase and docs. |
| [terraform-style-check](.agents/skills/terraform-style-check/) | Generate and review Terraform HCL following HashiCorp's official style conventions and best practices. |
| [web-accessibility-audit](.agents/skills/web-accessibility-audit/) | Audit web applications for WCAG 2.0/2.1/2.2 compliance and provide actionable remediation guidance. |
| [web-performance-audit](.agents/skills/web-performance-audit/) | Audit web page performance using Chrome DevTools MCP, covering Core Web Vitals and network optimization. |
| [webapp-testing](.agents/skills/webapp-testing/) | Test local web applications with Playwright—verify frontend functionality, capture screenshots, and inspect browser logs. |

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on adding skills.

## Learn More

- [Agent Skills Specification](https://agentskills.io)
- [Oz Skills Documentation](https://docs.warp.dev/agent-platform/cloud-agents/skills-as-agents)
