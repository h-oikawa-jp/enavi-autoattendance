
const Nightmare = require('nightmare');
const nightmare = Nightmare({ show: true });

const loginUrl = 'https://www.enavi-sv.net/ts-s-staff/Staff/login.aspx?ID=xxxxxxxxx';
const staffNo = 'no';
const password = 'password';

nightmare.goto(loginUrl)
    .wait('.login_frame #DivLoginTitle')
    .type('#TextStaffNo', staffNo)
    .type('#TextPassword', password)
    .click('#BtnOk')
    .wait('#ImgBtnHitBegin1')
    .wait('#ImgBtnHitEnd1')
    .click('#ImgBtnHitEnd1')
    .click('#ImgBtnHitBegin1')
    .wait(1)
    .evaluate(() => {
        const beginTime = document.querySelector('#LblHitBeginTime1');
        const endTime = document.querySelector('#LblHitEndTime1');
        return {
            beginTime: beginTime.textContent,
            endTime: endTime.textContent
        };
    })
    .end()
    .then((result) => console.log(result))
    .catch((error) => console.error('Getting result failed:', error));
