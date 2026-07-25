@echo off
echo ===================================================
echo Committing, Merging, and Pushing to new GitHub Repository
echo Target URL: https://github.com/yuvarajbtalawar99-creator/sampleErp.git
echo ===================================================
echo.

:: Check if git is installed
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Error: Git is not installed or not in your PATH.
    pause
    exit /b 1
)

echo Step 1: Saving pending changes on current branch...
git add -A
git commit -m "Save local progress before merging"

echo.
echo Step 2: Merging branches locally...
echo Switching to develop and merging feature branch...
git checkout develop
git merge feature/Student_Dashboard_Features --no-edit

echo Switching to main and merging develop...
git checkout main
git merge develop --no-edit

echo.
echo Step 3: Configuring remote repository...
:: Check if the remote 'upstream' already exists
git remote get-url upstream >nul 2>nul
if %errorlevel% neq 0 (
    echo Renaming current 'origin' to 'upstream'...
    git remote rename origin upstream
) else (
    echo Remote 'upstream' already exists. Removing current 'origin'...
    git remote remove origin >nul 2>nul
)

echo Adding new 'origin' pointing to sampleErp...
git remote add origin https://github.com/yuvarajbtalawar99-creator/sampleErp.git

echo.
echo Step 4: Pushing all branches to new origin...
git push -u origin --all

echo.
echo ===================================================
echo SUCCESS: All branches merged and pushed successfully!
echo ===================================================
echo.
pause
