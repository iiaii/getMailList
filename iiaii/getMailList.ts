import * as Debug from 'debug';
import * as puppeteer from 'puppeteer';
const debug = Debug('getMailList');

// 로그인
const login = async (_page: any, _id: string, _pwd: string): Promise<any> => {
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
        throw error;
    }
};
// 메일 정보(이름,제목) 추출
const extractMailList = async (_page: any, _link: string): Promise<any> => {
    try {
        const data: any = {};
        const nameTag = 'td.yX.xY .yW span';
        const titleTag = 'td.xY.a4W .bog';
        await _page.waitForSelector(nameTag);

        // 메일 송신자 이름 추출
        data.name = await _page.evaluate((nameTag) => {
            const anchors = Array.from(document.querySelectorAll(nameTag));
            return anchors.map((anchor) => {
                const title = anchor.textContent;

                return title;
            });
        }, nameTag);
        // 메일 제목 추출
        data.title = await _page.evaluate((titleTag) => {
            const anchors = Array.from(document.querySelectorAll(titleTag));
            return anchors.map((anchor) => {
                const title = anchor.textContent;

                return title;
            });
        }, titleTag);

        return data;
    } catch (error) {
        throw error;
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
        throw error;
    }
};
// 메인
const main = async (ID: string, PWD: string): Promise<any> => {
    try {
        const Load = await pageLoad();
        const page = Load.page;
        const browser = Load.browser;
        const loginResult = await login(page, ID, PWD);
        const extractResult = await extractMailList(page, loginResult);

        debug(extractResult);
        await browser.close();
        const result = {
            name : extractResult.name,
            title : extractResult.title,
            status : 200,
        };
        return result;
    } catch (error) {
        const error_result = {
            errorMsg : error,
            status : 400,
        };
        debug(error);
        return error_result;
    }
};

export { login, extractMailList, pageLoad, main };