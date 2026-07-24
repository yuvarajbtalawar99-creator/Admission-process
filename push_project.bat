@echo off
echo ===================================================
echo Committing and Pushing Project to GitHub
echo Target URL: https://github.com/vyonlabsofficial-lang/College.git
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in your PATH.
    pause
    exit /b 1
)

echo Step 1: Staging all updated files...
git add -A

echo Step 2: Committing changes...
git commit -m "Update project files and implement features"

echo Step 3: Pushing all branches to GitHub...
git push -u origin --all

echo Step 4: Pushing tags...
git push -u origin --tags

echo.
echo ===================================================
echo SUCCESS: All updated files pushed successfully!
echo ===================================================
echo.
pause
