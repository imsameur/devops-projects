# DevOps Projects: shared workflow

Version: 1.0 | Updated: 2026-10-03

This is the shared source of project working instructions for any AI assistant. Read this file explicitly; do not assume chat memory or automatic file loading. Follow the user's current task instructions when they change a preference below. Propose an update here when a change should become permanent.

## Learner and scope

- Learner: Sameur; Linux/server administration background, developing practical DevOps skills.
- Explain in simple Bangla, keeping commands and technical names in English. Write portfolio README files in clear English unless requested otherwise.
- Repository: devops-projects. Create a separate descriptive folder for each project.
- Use AWS for the projects. Default OS: Amazon Linux 2023. Confirm the actual OS before package commands. Default learning region: ap-southeast-1, but verify the active region.
- Reuse Mini Shop when appropriate. Extend the existing application only as needed for the learning objective.
- Keep this portfolio separate from KSF job preparation and AI-Driven-DevOps learning.
- Do not invent the next project number, the original 15-project plan, previous completion, or available AWS resources. Ask for missing scope only when needed.

## Start or resume

1. Read this file and the selected project's README.md and PROGRESS.md, if present.
2. Inspect available project files before proposing changes. If repository access is unavailable, request the relevant files or outputs. A link alone does not prove access.
3. Briefly state what is verified, what is unknown, and the next action. Old screenshots and progress notes are historical evidence, not proof that cloud resources still exist.
4. For a new project, give the full breakdown first: objective, prerequisites, architecture, deliverables, stages, verification, documentation, publishing and cleanup.
5. Establish the current machine, OS, connection method and resources from available evidence. Do not repeatedly ask for information already provided.

## Teaching and execution

- Work one step at a time. Do not provide the entire executable lab at once unless the user requests a full reference guide.
- Each step must explain: what we are doing, why, where to run it, the command or file content, expected result, and what output to share.
- Clearly distinguish Windows PowerShell, an EC2 shell, the project directory, and the AWS console.
- Use simple code and explain meaningful configuration choices. Avoid unnecessary components or abstraction.
- Wait for the user's output before advancing to a dependent step. If authorized to execute directly, inspect the actual result yourself and show the evidence before proceeding.
- Troubleshoot the current failure before advancing. Do not label an expected result as an observed result.
- Use the existing project versions and configuration as the starting point. Check official documentation when version-sensitive commands or compatibility are uncertain.
- Update PROGRESS.md at verified milestones and before handoff. When unable to edit it, provide exact replacement text for the user to save.

## Practical safeguards

- Never commit .env, passwords, tokens, private keys, database dumps containing private data, or Terraform state. Use placeholders in .env.example.
- Reuse and extend existing .gitignore rules; do not replace unrelated rules.
- Do not request secrets in chat or include them in screenshots. Redact before publishing.
- Expose only necessary ports. Keep databases internal. Prefer restricted SSH or an appropriate existing access method; do not default SSH to Anywhere.
- Discuss resource sizes and likely cost drivers before creating AWS resources. Do not promise free usage or assume credits cover everything.
- Before deleting resources or volumes, establish the exact project resources, data impact, and user authorization. Never delete unrelated resources.
- Preserve existing files and uncommitted work. Avoid force pushes and blanket git add commands.

## Project stages

1. Plan: scope, architecture, prerequisites, acceptance criteria and resource plan.
2. Prepare: connectivity, OS, tools and isolated project directory.
3. Build: minimal application/configuration in small explained steps.
4. Run: start components, inspect health, logs and connectivity.
5. Verify: meaningful functional checks, plus relevant persistence, failure/recovery or security checks. Skip irrelevant tests with a reason.
6. Document: README, test evidence, screenshots, limitations and cleanup steps.
7. Publish: review the selected changes, scan for secrets, check staged diff, commit and push. Verify the push result; do not infer success from a local commit.
8. Clean up or retain: follow the user's resource decision and verify it. Record cleanup separately from implementation completion.

## Completion and handoff

- README contains the purpose, architecture, prerequisites, setup/run/verify instructions, important configuration, troubleshooting, evidence links, cleanup and limitations.
- Relevant tests have actual recorded results. Use PASS, FAIL, NOT RUN or N/A accurately.
- Screenshots are genuine, readable, sanitized and referenced using relative paths.
- GitHub status is explicit: not committed, committed locally, or push verified, with commit reference when known.
- Infrastructure status is explicit: running intentionally, cleanup pending, cleanup verified, or unknown.
- End a session by updating PROGRESS.md with the last verified milestone, unresolved issue and exact next action. Never claim that the whole project is complete while required work remains.

## Portability

AGENTS.md and CLAUDE.md point here. Their automatic loading depends on the tool and mode. For any new AI conversation, explicitly provide this file, the selected project's PROGRESS.md and README.md, plus relevant source files. Ask the assistant to summarize the rules and next step before continuing. These files improve consistency; they cannot guarantee identical AI behavior.
