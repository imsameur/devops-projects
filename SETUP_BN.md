# Workflow kit setup

এই kit-এ reusable repository instructions ও templates আছে। Existing repository-তে কোনো পরিবর্তন বা GitHub push এই kit তৈরির মাধ্যমে হয়নি।

## ১. Files বসানো

ZIP extract করো। workflow-kit folder-এর ভেতরের files ও templates folder তোমার devops-projects repository root-এ রাখো। Existing README.md replace করবে না। একই নামে কোনো instruction file বা templates থাকলে আগে compare করে merge করো; overwrite করবে না।

Root-এ থাকবে PROJECT_WORKFLOW.md, AGENTS.md, CLAUDE.md, AI_START_PROMPTS.md, SETUP_BN.md এবং templates/। workflow-kit নামে বাড়তি nested folder বানানোর প্রয়োজন নেই।

## ২. Repository যাচাই

VS Code-এ repository folder open করে terminal-এ চালাও:

```bash
git rev-parse --show-toplevel
git status --short
```

প্রথম command-এর path devops-projects হওয়া উচিত। দ্বিতীয় command-এর output দেখে নতুন files ও আগে থেকে থাকা changes আলাদা করে বোঝো। Error হলে commit step-এ যেও না।

## ৩. Review, commit ও push

শুধু এই kit-এর files review করে নিচের commands চালাও। Existing পরিবর্তন থাকলে তা আগে বুঝে নাও।

```bash
git add PROJECT_WORKFLOW.md AGENTS.md CLAUDE.md AI_START_PROMPTS.md SETUP_BN.md templates/PROGRESS.template.md templates/README.template.md templates/test-results.template.md
git diff --cached --name-only
git diff --cached --check
git diff --cached
```

অন্য staged files থাকলে সেগুলো না বুঝে commit করবে না। Expected files, content এবং secrets নেই নিশ্চিত হলে:

```bash
git commit -m "docs: add shared DevOps project workflow and templates"
git push
git status --short
```

git push error দিলে সেটি solve করতে হবে; local commit হওয়া মানেই GitHub-এ upload নয়। Default upstream না থাকলে actual branch ও remote যাচাই করে command নির্ধারণ করো, branch name অনুমান কোরো না। GitHub-এ files দৃশ্যমান কি না দেখো।

## ৪. নতুন project

AI_START_PROMPTS.md-এর New project prompt ব্যবহার করো। Project scope ঠিক হওয়ার পর templates থেকে PROGRESS.md, README.md এবং docs/test-results.md তৈরি করবে। Template files অপরিবর্তিত থাকবে; copies-এ placeholders পূরণ করবে। Relevant screenshots docs/screenshots/ এ রাখবে।

পুরোনো project-এ নতুন README চাপিয়ে দেবে না। Existing project-এর জন্য শুধু প্রয়োজনীয় missing documentation যোগ করবে।

## ৫. প্রতিদিন কাজ শেষে

Verified progress ও exact next action PROGRESS.md-এ লিখে save করবে। Review করে project-এর নির্দিষ্ট changed files commit/push করবে। এতে অন্য machine বা AI সর্বশেষ অবস্থান পাবে।

## ৬. Claude, ChatGPT বা অন্য AI

Repository পড়ার access থাকলে root files ও selected project path দাও। Access না থাকলে PROJECT_WORKFLOW.md, project-এর PROGRESS.md, README.md এবং প্রয়োজনীয় source files attach করো। Resume prompt ব্যবহার করো।

AGENTS.md বা CLAUDE.md সব tool-এ automatically load হয় না। তাই explicit read instruction রাখো এবং AI-এর প্রথম summary মিলিয়ে দেখো। নতুন conversation-এ file না দিয়ে শুধু “আগের নিয়মে করো” বললে একই নিয়ম অনুসরণের নিশ্চয়তা নেই।

## ৭. নিয়ম পরিবর্তন

স্থায়ী নিয়ম PROJECT_WORKFLOW.md-এ বদলাবে। Project-specific সিদ্ধান্ত PROGRESS.md-এ রাখবে। এক session-এর exception স্থায়ী preference হিসেবে লিখবে না, যদি না তুমি তা চাও।
