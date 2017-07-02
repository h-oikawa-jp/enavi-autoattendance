@echo off

cd %~dp0

echo "勤怠入力を実行します。中止する場合はウィンドウを閉じてください。"
timeout 10

npm run enavi -- workEnd approvalRequest

echo "一定時間後にシャットダウンします。"
shutdown /s /t 10

choice /C:Q /M "シャットダウンを中止する場合は`Q`キーを押してください。"
shutdown /a

exit /B
