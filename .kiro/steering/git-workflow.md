# Birp — Git & Deployment Workflow (for the team)

The site lives at **https://github.com/JoshuaRekaiD/Big-Ideas-Project** and is published with **GitHub Pages** from the `main` branch. Pushing to `main` updates the live site (`https://joshuarekaid.github.io/Big-Ideas-Project/`) within about a minute.

## First-time setup on a new machine
Each partner does this once on their own computer.

1. Install Git: download from https://git-scm.com/download/win (or `winget install --id Git.Git -e`). Reopen the terminal, then confirm with `git --version`.
2. Set your identity (use your own name + GitHub email):
   ```powershell
   git config --global user.name "Your Name"
   git config --global user.email "your-github-email@example.com"
   ```
3. Clone the project (downloads a fresh copy):
   ```powershell
   git clone https://github.com/JoshuaRekaiD/Big-Ideas-Project.git
   ```
   The first push/clone will prompt you to sign in to GitHub in a browser — do it once and it's remembered.

> Tip: clone into a normal folder like `Documents`, not inside a OneDrive-synced folder, since OneDrive can occasionally interfere with Git.

## Everyday workflow
Before you start working, get the latest version:
```powershell
git pull
```
Make your changes in Kiro / the editor, then publish them:
```powershell
git add .
git commit -m "short description of what you changed"
git push
```
The live site updates ~1 minute after `git push`.

## Working without stepping on each other
Since several people share this repo, prefer using branches for anything non-trivial:
```powershell
git checkout -b my-feature      # create + switch to a new branch
# ...make changes, commit...
git push -u origin my-feature   # publish the branch
```
Then open a Pull Request on GitHub to merge into `main`. This keeps `main` (the live site) stable and lets the team review changes.

If two people edit the same lines, `git pull` may report a **merge conflict**. Git marks the clashing spots in the file with `<<<<<<<`, `=======`, `>>>>>>>`. Open the file, keep the correct version, delete those markers, then `git add` + `git commit`. Ask Kiro for help resolving a conflict if unsure — paste the conflicted section.

## Safety notes
- Never commit secrets (real passwords, API keys, personal info). This is a public repo — anyone can read it.
- Avoid `git push --force` on `main`; it can overwrite teammates' work. (It was used once during initial setup only.)
- Don't change `git config` for other people or the repo.
