@echo off

cd %~dp0

rem ���O�t�H���_/�t�@�C�����𐶐�
if not exist .log (mkdir .log)
set YMD=%date:~0,4%%date:~5,2%%date:~8,2%
set LOGFILE=.log\%~n0_%YMD%.log


echo �Αӓ��͂����s���܂��B���~����ꍇ�̓E�B���h�E����Ă��������B
timeout 5


call npm run enavi -- workEnd approvalRequest -e %USERNAME% >>%LOGFILE%
type %LOGFILE%


echo ��莞�Ԍ�ɃV���b�g�_�E�����܂��B
shutdown /s /t 10

choice /C:Q /M "�V���b�g�_�E���𒆎~����ꍇ��`Q`�L�[�������Ă��������B"

shutdown /a
echo �V���b�g�_�E���𒆎~���܂����B


pause
exit /b %ecode%
