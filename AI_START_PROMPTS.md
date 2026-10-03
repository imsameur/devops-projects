# AI conversation prompts

Replace the placeholders before use. Give the assistant repository/file access, or attach the referenced files. A repository URL alone may not be enough. Automatic instruction loading varies by tool and mode.

## New project

```text
আমি devops-projects repository-তে নতুন project শুরু করব।
Project: <title and scope>
Folder: <folder-name>

আগে PROJECT_WORKFLOW.md পড়ো। কোন files পড়তে পেরেছ জানাও।
আমার শেখার নিয়ম সংক্ষেপে বলো, তারপর পুরো project breakdown দাও।
Available environment যাচাই করে শুধু প্রথম executable step দাও।
আমার output যাচাই করার আগে dependent next step-এ যাবে না।
templates/PROGRESS.template.md থেকে project-এর PROGRESS.md তৈরি করো।
Access না থাকলে save করার উপযোগী content দাও।
কোনো আগের project number, resource বা completion অনুমান করবে না।
```

## Resume with another AI or in a new chat

```text
Project folder: <folder-name>
PROJECT_WORKFLOW.md, project-এর PROGRESS.md, README.md এবং প্রাসঙ্গিক
source files পড়ো। কী verified, কী uncertain এবং next action কী, জানাও।
তারপর শেষ verified milestone-এর পরের step থেকে শুরু করো।
আগের কাজ আবার শুরু করবে না। প্রয়োজন হলে বর্তমান environment যাচাই করো।
একবারে একটি step দাও এবং আমার output দেখে পরের step দাও।
```

## End a session

```text
আজকের verified results অনুযায়ী PROGRESS.md update করো।
Tests, blockers, decisions, GitHub status, AWS resource status এবং exact
next action লিখো। যা যাচাই হয়নি সেটি unknown বা not verified রাখো।
File edit access না থাকলে সম্পূর্ণ updated content দাও, আমি save করব।
```

## Adopt an existing project

```text
Existing project: <folder-name>
PROJECT_WORKFLOW.md এবং existing README/source files পড়ে workflow adopt করো।
Application files অকারণে বদলাবে না। PROGRESS.md না থাকলে template থেকে তৈরি করো।
পুরোনো claimed results ও নতুন verified results আলাদা করে বোঝাও।
প্রয়োজনীয় missing information জেনে পরের step নির্ধারণ করো।
```
