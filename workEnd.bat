@echo off

cd %~dp0

echo "�Αӓ��͂����s���܂��B���~����ꍇ�̓E�B���h�E����Ă��������B"
timeout 10

npm run enavi -- workEnd approvalRequest

echo "��莞�Ԍ�ɃV���b�g�_�E�����܂��B"
shutdown /s /t 10

choice /C:Q /M "�V���b�g�_�E���𒆎~����ꍇ��`Q`�L�[�������Ă��������B"
shutdown /a

exit /B
