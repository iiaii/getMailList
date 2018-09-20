import * as puppeteer from 'puppeteer';
import * as interfaces from 'interfaces';

// 페이지 로드
const pageLoad = async (): Promise<interfaces.pageLoadData> => {

    try {
        const _browser = await puppeteer.launch({ headless: false });
        const _Load: interfaces.pageLoadData = {
            browser: _browser,
            page: await _browser.newPage(),
        };
        // await _Load.page.setUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.99 Safari/537.36');
        await _Load.page.goto('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
        await _Load.page.waitForSelector('#identifierId', { timeout: 10000 });  // 페이지 로드까지 최대 10초 기다려줌

        return _Load;
    } catch (error) {
        throw new Error('페이지 로드에서 에러발생 -> ' + error);
    }
};
// 로그인
const login = async (_page: puppeteer.Page, _id: string, _pwd: string): Promise<string> => {
    try {
        // 아이디 입력
        try {
            await _page.type('#identifierId', _id);
            await _page.click('#identifierNext > div.ZFr60d.CeoRYc');
            await _page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 5000 });    // 비밀번호 창까지 최대 5초 기다려 줌
        } catch (error) {
            throw new Error('로그인에서 에러발생 -> 아이디 에러 혹은 네트워크지연\n' + error);
        }
        // 패스워드 입력
        try {
            await _page.type('.whsOnd.zHQkBf', _pwd);
            await _page.click('#passwordNext > div.ZFr60d.CeoRYc');
            await _page.waitForSelector('tr.zA div.afn', { timeout: 15000 });  // 메일 페이지 로딩까지 최대 15초 기다려줌
            return await _page.url();
        } catch (error) {
            throw new Error('로그인에서 에러발생 -> 비밀번호 에러 혹은 네트워크지연\n' + error);
        }
    } catch (error) {
        throw error;
    }
};
// 메일 정보(이름,제목) 추출
const extractMailList = async (_page: puppeteer.Page, _link: string): Promise<interfaces.mails[]> => {
    try {
        // 메일 정보(이름,제목) 추출
        return await _page.evaluate(() => {
            const anchors = Array.from(document.querySelectorAll('tr.zA div.afn'));
            const mailData: interfaces.mails[] = [];

            anchors.forEach((anchor) => {
                let text: string | null = anchor.textContent;
                if (text !== null) {
                    text = text.replace('읽지 않음, ', '');
                    const textArray: string[] = text.split(', ');
                    const mails: interfaces.mails = {
                        sender: textArray[0],
                        subject: textArray[1],
                    };
                    mailData.push(mails);
                }
            });
            return mailData;
        });
    } catch (error) {
        throw new Error('메일 정보(이름,제목) 추출에서 에러발생 -> ' + error);
    }
};
// 메인
const main = async (ID: string, PWD: string): Promise<interfaces.result> => {
    let browser;
    try {
        const Load = await pageLoad();
        const page = Load.page;
        browser = Load.browser;
        const loginResult = await login(page, ID, PWD);
        const extractResult = await extractMailList(page, loginResult);

        await browser.close();
        const result: interfaces.result = {
            mails: extractResult,
            status: 200,
        };
        return result;
    } catch (error) {
        await browser.close();
        const error_result: interfaces.result = {
            errorMsg: error,
            status: 400,
        };
        return error_result;
    }
};

export { main };