@echo off

cd %~dp0

rem ���O�t�H���_/�t�@�C�����𐶐�
if not exist .log (mkdir .log)
set YMD=%date:~0,4%%date:~5,2%%date:~8,2%
set LOGFILE=.log\%~n0_%YMD%.log


echo �Αӓ��͂����s���܂��B���~����ꍇ�̓E�B���h�E����Ă��������B
timeout 5


call npm run enavi -- workStart -e %USERNAME% >>%LOGFILE%
type %LOGFILE%


pause
exit /b %ecode%
