"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer = require("puppeteer");
const pageLoad = async () => {
    try {
        const _Load = {};
        _Load.browser = await puppeteer.launch({ headless: false });
        _Load.page = await _Load.browser.newPage();
        await _Load.page.goto('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
        await _Load.page.waitForSelector('#identifierId', { timeout: 10000 });
        return _Load;
    }
    catch (error) {
        throw new Error('페이지 로드에서 에러발생 -> ' + error);
    }
};
const login = async (_page, _id, _pwd) => {
    let errorMsg = '로그인에서 에러발생 -> 아이디 입력전에 에러발생 \n';
    try {
        await _page.type('#identifierId', _id);
        await _page.click('#identifierNext > div.ZFr60d.CeoRYc');
        errorMsg = '로그인에서 에러발생 -> 아이디 에러 혹은 네트워크지연\n';
        await _page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });
        await _page.type('.whsOnd.zHQkBf', _pwd);
        await _page.click('#passwordNext > div.ZFr60d.CeoRYc');
        errorMsg = '로그인에서 에러발생 -> 비밀번호 에러 혹은 네트워크지연\n';
        await _page.waitForSelector('tr.zA div.afn', { timeout: 15000 });
        return await _page.url();
    }
    catch (error) {
        throw new Error(errorMsg + error);
    }
};
const extractMailList = async (_page, _link) => {
    try {
        return await _page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('tr.zA div.afn'));
            const mails = [];
            anchors.map((anchor) => {
                const mailData = {};
                let text = anchor.textContent;
                if (text !== null) {
                    text = text.replace('읽지 않음, ', '');
                    const textArray = text.split(', ');
                    mailData.sender = textArray[0];
                    mailData.subject = textArray[1];
                    mails.push(mailData);
                }
            });
            return mails;
        });
    }
    catch (error) {
        throw new Error('메일 정보(이름,제목) 추출에서 에러발생 -> ' + error);
    }
};
const main = async (ID, PWD) => {
    let browser;
    try {
        const Load = await pageLoad();
        const page = Load.page;
        browser = Load.browser;
        const loginResult = await login(page, ID, PWD);
        const extractResult = await extractMailList(page, loginResult);
        await browser.close();
        const result = {
            mails: extractResult,
            status: 200,
        };
        return result;
    }
    catch (error) {
        await browser.close();
        const error_result = {
            errorMsg: error,
            status: 400,
        };
        return error_result;
    }
};
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TWFpbExpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9nZXRNYWlsTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF1QztBQUd2QyxNQUFNLFFBQVEsR0FBRyxLQUFLLElBQWtCLEVBQUU7SUFDdEMsSUFBSTtRQUNBLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQztRQUN0QixLQUFLLENBQUMsT0FBTyxHQUFHLE1BQU0sU0FBUyxDQUFDLE1BQU0sQ0FBQyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQzVELEtBQUssQ0FBQyxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBRTNDLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsNk9BQTZPLENBQUMsQ0FBQztRQUNyUSxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLGVBQWUsRUFBRSxFQUFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBRXRFLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixNQUFNLElBQUksS0FBSyxDQUFDLG1CQUFtQixHQUFHLEtBQUssQ0FBQyxDQUFDO0tBQ2hEO0FBQ0wsQ0FBQyxDQUFDO0FBRUYsTUFBTSxLQUFLLEdBQUcsS0FBSyxFQUFFLEtBQXFCLEVBQUUsR0FBVyxFQUFFLElBQVksRUFBZ0IsRUFBRTtJQUNuRixJQUFJLFFBQVEsR0FBVyxnQ0FBZ0MsQ0FBQztJQUN4RCxJQUFJO1FBRUEsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUN2QyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMscUNBQXFDLENBQUMsQ0FBQztRQUN6RCxRQUFRLEdBQUcsa0NBQWtDLENBQUM7UUFDOUMsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxTQUFT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