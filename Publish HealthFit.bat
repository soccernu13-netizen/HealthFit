@echo off
cd /d "%~dp0"
echo.
echo  HealthFit - hide work identity, then update GitHub
echo  -------------------------------------------------
echo.
where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed. Install Git for Windows, then run this again.
  echo https://git-scm.com/download/win
  pause
  exit /b 1
)

git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/soccernu13-netizen/HealthFit.git
git add .

set GIT_AUTHOR_NAME=HealthFit
set GIT_AUTHOR_EMAIL=soccernu13-netizen@users.noreply.github.com
set GIT_COMMITTER_NAME=HealthFit
set GIT_COMMITTER_EMAIL=soccernu13-netizen@users.noreply.github.com

git commit --amend --reset-author -m "Add HealthFit workout tracker. Personal logs stay on your device."
if errorlevel 1 (
  echo Nothing new to save, rewriting the existing commit author only.
  git commit --amend --reset-author --allow-empty -m "Add HealthFit workout tracker. Personal logs stay on your device."
)

echo.
echo  Updating GitHub. This replaces the first commit so your work
echo  name and email are not visible after the repo is public.
echo.
git push --force origin main
echo.
if errorlevel 1 (
  echo Push failed. Sign in to GitHub, then run this file again.
) else (
  echo Files are updated.
  echo.
  echo  NEXT, in the browser:
  echo  1. Open https://github.com/soccernu13-netizen/HealthFit/settings
  echo  2. Scroll to Danger Zone - Change visibility - Public
  echo  3. Open https://github.com/soccernu13-netizen/HealthFit/settings/pages
  echo  4. Under Build and deployment, Source: Deploy from a branch
  echo  5. Branch: main, folder: / ^(root^), then Save
  echo  6. Wait a minute, then open https://soccernu13-netizen.github.io/HealthFit/
)
echo.
pause
