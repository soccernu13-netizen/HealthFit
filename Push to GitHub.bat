@echo off
cd /d "%~dp0"
echo.
echo  HealthFit - save this project to GitHub
echo  --------------------------------------
echo.
where git >nul 2>&1
if errorlevel 1 (
  echo Git is not installed. Install Git for Windows, then run this again.
  echo https://git-scm.com/download/win
  pause
  exit /b 1
)
if not exist ".git" git init
git branch -M main
git remote remove origin 2>nul
git remote add origin https://github.com/soccernu13-netizen/HealthFit.git
git add .
git status
echo.
git commit -m "Add HealthFit workout and weight tracker."
if errorlevel 1 (
  echo If it said nothing to commit, the files may already be saved.
)
echo.
echo  Pushing to GitHub. Sign in if a browser window asks.
echo.
git push -u origin main
echo.
if errorlevel 1 (
  echo Push failed. Sign in to GitHub, then run this file again.
) else (
  echo Done. Repo: https://github.com/soccernu13-netizen/HealthFit
)
echo.
pause
