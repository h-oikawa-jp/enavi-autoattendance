"use strict";

exports.login = login;
exports.workStart = workStart;
exports.workEnd = workEnd;
exports.approvalRequest = approvalRequest;
exports.getTimes = getTimes;
exports.logout = logout;

/**
 * Login
 */
function login(nightmare, config) {
    return nightmare.goto(config.enavi.loginUrl)
        .wait('.login_frame #DivLoginTitle')
        .insert('#TextStaffNo', config.enavi.staffNo)
        .insert('#TextPassword', config.enavi.password)
        .click('input#BtnOk')
        .wait('span#LblNowTime')
        .url()
}

/**
 * Work Start
 */
function workStart(nightmare, topUrl) {
    return nightmare.goto(topUrl)
        .wait('#ImgBtnHitBegin1')
        .click('#ImgBtnHitBegin1')
        .wait('#ImgBtnHitBegin1:disabled')
        .evaluate(() => document.querySelector('span#LblHitEndTime1').textContent);
}

/**
 * Work End
 */
function workEnd(nightmare, topUrl) {
    return nightmare.goto(topUrl)
        .wait('#ImgBtnHitEnd1')
        .click('#ImgBtnHitEnd1')
        .wait('#ImgBtnHitEnd1:disabled')
        .evaluate(() => document.querySelector('span#LblHitEndTime1').textContent);
}

/**
 * Approval Request
 */
function approvalRequest(nightmare, topUrl) {
    return nightmare.goto(topUrl)
        .wait('#ImgBtnReport1')
        .click('#ImgBtnReport1')
        .wait('input#BtnOk')
        // Disable the confirming of approval request by onClick attr
        .evaluate(() => document.querySelector('input#BtnOk').setAttribute('onClick', 'return true;'))
        .click('input#BtnOk')
        .wait('span#LblMessage')
        .evaluate(() => document.querySelector('span#LblMessage').textContent);
}

/**
 * Get Work Start & End Times
 */
function getTimes(nightmare, topUrl) {
    return nightmare.goto(topUrl)
        .wait('#LblHitBeginTime1')
        .wait('#LblHitEndTime1')
        .evaluate(() => {
            const beginTime = document.querySelector('#LblHitBeginTime1');
            const endTime = document.querySelector('#LblHitEndTime1');
            return {
                beginTime: beginTime.textContent,
                endTime: endTime.textContent
            };
        });
}

/**
 * Logout
 */
function logout(nightmare) {
    return nightmare
        .click('a#LinkMenuLogout')
        .end(() => "OK");
}
