import * as Debug from 'debug';
import * as puppeteer from 'puppeteer';
const debug = Debug('getMailList');

// 로그인
const login = async (_page: puppeteer.Page, _id: string, _pwd: string): Promise<any> => {
    try {
        let link: string = '';

        // 아이디창 입력
        await _page.type('#identifierId', _id);
        await _page.click('#identifierNext > div.ZFr60d.CeoRYc');
        // 패스워드 입력
        const pwdSpace = '.whsOnd.zHQkBf';
        await _page.waitForNavigation({ waitUntil: 'networkidle2' });
        await _page.type(pwdSpace, _pwd);
        await _page.click('#passwordNext > div.ZFr60d.CeoRYc');
        link = await _page.url();

        return link;
    } catch (error) {
        throw new Error('로그인에서 에러남 -> ' + error);
    }
};
// 메일 정보(이름,제목) 추출
const extractMailList = async (_page: puppeteer.Page, _link: string): Promise<any> => {
    try {
        const mailTag: string = 'tr.zA div.afn';
        await _page.waitForSelector(mailTag);

        // 메일 정보(이름,제목) 추출
        return await _page.evaluate((mailTag) => {
            const anchors = Array.from(document.querySelectorAll(mailTag));
            const mails: object[] = [];

            anchors.map((anchor) => {
                const mailData: any = {};
                let text: string | null = anchor.textContent;
                if (text !== null) {
                    text = text.replace('읽지 않음, ', '');
                    const textArray: string[] = text.split(', ');
                    mailData.sender = textArray[0];
                    mailData.subject = textArray[1];
                    mails.push(mailData);
                }
            });
            return mails;
        }, mailTag);
    } catch (error) {
        throw new Error('메일 정보(이름,제목) 추출에서 에러남 -> ' + error);
    }
};
// 페이지 로드
const pageLoad = async (): Promise<any> => {
    try {
        const _Load: any = {};
        _Load.browser = await puppeteer.launch({ headless: false });
        _Load.page = await _Load.browser.newPage();
        await _Load.page.goto('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

        return _Load;
    } catch (error) {
        throw new Error('페이지 로드에서 에러남 -> ' + error);
    }
};
// 메인
const main = async (ID: string, PWD: string): Promise<any> => {
    let browser;
    try {
        const Load = await pageLoad();
        const page = Load.page;
        browser = Load.browser;
        const loginResult = await login(page, ID, PWD);
        const extractResult = await extractMailList(page, loginResult);

        debug(extractResult);
        await browser.close();
        const result: object = {
            mails: extractResult,
            status: 200,
        };
        return result;
    } catch (error) {
        const error_result: object = {
            errorMsg: error,
            status: 400,
        };
        debug(error);
        browser.close();
        return error_result;
    }
};

export { login, extractMailList, pageLoad, main };