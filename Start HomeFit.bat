@echo off
cd /d "%~dp0"
echo.
echo  HomeFit
echo  -------
echo  Installing matching iPhone version first...
echo.
call npm install
echo.
echo  If a browser login page opens, sign in to Expo with a free
echo  account. On the iPhone, sign in to Expo Go with the SAME account.
echo  Then keep THIS window open and scan the QR with Camera.
echo.
call npm start
pause
