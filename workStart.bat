@echo off

cd %~dp0

echo "勤怠入力を実行します。中止する場合はウィンドウを閉じてください。"
timeout 10

npm run enavi -- workStart

pause

exit /B
