@echo off

chcp 65001

cd %~dp0

rem ログフォルダ/ファイル名を生成
if not exist .log (mkdir .log)
set YMD=%date:~0,4%%date:~5,2%%date:~8,2%
set LOGFILE=.log\%~n0_%YMD%.log


echo 勤怠入力を実行します。中止する場合はウィンドウを閉じてください。
timeout 5


call npm run enavi -- workEnd approvalRequest getTimes logout -s -e %USERNAME% >>%LOGFILE%
type %LOGFILE%


echo 一定時間後にシャットダウンします。
shutdown /s /t 10

choice /C:Q /M "シャットダウンを中止する場合は`Q`キーを押してください。"

shutdown /a
echo シャットダウンを中止しました。


pause
exit /b %ecode%
