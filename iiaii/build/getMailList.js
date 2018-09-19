"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Debug = require("debug");
const puppeteer = require("puppeteer");
const debug = Debug('getMailList');
const login = async (_page, _id, _pwd) => {
    try {
        let link = '';
        await _page.type('#identifierId', _id);
        await _page.click('#identifierNext > div.ZFr60d.CeoRYc');
        const pwdSpace = '.whsOnd.zHQkBf';
        await _page.waitForNavigation({ waitUntil: 'networkidle2' });
        await _page.type(pwdSpace, _pwd);
        await _page.click('#passwordNext > div.ZFr60d.CeoRYc');
        link = await _page.url();
        return link;
    }
    catch (error) {
        throw new Error('로그인에서 에러남 -> ' + error);
    }
};
exports.login = login;
const extractMailList = async (_page, _link) => {
    try {
        const mailTag = 'tr.zA div.afn';
        await _page.waitForSelector(mailTag);
        return await _page.evaluate((mailTag) => {
            const anchors = Array.from(document.querySelectorAll(mailTag));
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
        }, mailTag);
    }
    catch (error) {
        throw new Error('메일 정보(이름,제목) 추출에서 에러남 -> ' + error);
    }
};
exports.extractMailList = extractMailList;
const pageLoad = async () => {
    try {
        const _Load = {};
        _Load.browser = await puppeteer.launch({ headless: false });
        _Load.page = await _Load.browser.newPage();
        await _Load.page.goto('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
        return _Load;
    }
    catch (error) {
        throw new Error('페이지 로드에서 에러남 -> ' + error);
    }
};
exports.pageLoad = pageLoad;
const main = async (ID, PWD) => {
    let browser;
    try {
        const Load = await pageLoad();
        const page = Load.page;
        browser = Load.browser;
        const loginResult = await login(page, ID, PWD);
        const extractResult = await extractMailList(page, loginResult);
        debug(extractResult);
        await browser.close();
        const result = {
            mails: extractResult,
            status: 200,
        };
        return result;
    }
    catch (error) {
        const error_result = {
            errorMsg: error,
            status: 400,
        };
        debug(error);
        browser.close();
        return error_result;
    }
};
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TWFpbExpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9nZXRNYWlsTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQix1Q0FBdUM7QUFDdkMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBR25DLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFxQixFQUFFLEdBQVcsRUFBRSxJQUFZLEVBQWdCLEVBQUU7SUFDbkYsSUFBSTtRQUNBLElBQUksSUFBSSxHQUFXLEVBQUUsQ0FBQztRQUd0QixNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQ3ZDLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDO1FBRXpELE1BQU0sUUFBUSxHQUFHLGdCQUFnQixDQUFDO1FBQ2xDLE1BQU0sS0FBSyxDQUFDLGlCQUFpQixDQUFDLEVBQUUsU0FBUyxFQUFFLGNBQWMsRUFBRSxDQUFDLENBQUM7UUFDN0QsTUFBTSxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQztRQUNqQyxNQUFNLEtBQUssQ0FBQyxLQUFLLENBQUMsbUNBQW1DLENBQUMsQ0FBQztRQUN2RCxJQUFJLEdBQUcsTUFBTSxLQUFLLENBQUMsR0FBRyxFQUFFLENBQUM7UUFFekIsT0FBTyxJQUFJLENBQUM7S0FDZjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQyxlQUFlLEdBQUcsS0FBSyxDQUFDLENBQUM7S0FDNUM7QUFDTCxDQUFDLENBQUM7QUFzRU8sc0JBQUs7QUFwRWQsTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLEtBQXFCLEVBQUUsS0FBYSxFQUFnQixFQUFFO0lBQ2pGLElBQUk7UUFDQSxNQUFNLE9BQU8sR0FBVyxlQUFlLENBQUM7UUFDeEMsTUFBTSxLQUFLLENBQUMsZUFBZSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBR3JDLE9BQU8sTUFBTSxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUMsT0FBTyxFQUFFLEVBQUU7WUFDcEMsTUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUMvRCxNQUFNLEtBQUssR0FBYSxFQUFFLENBQUM7WUFFM0IsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFO2dCQUNuQixNQUFNLFFBQVEsR0FBUSxFQUFFLENBQUM7Z0JBQ3pCLElBQUksSUFBSSxHQUFrQixNQUFNLENBQUMsV0FBVyxDQUFDO2dCQUM3QyxJQUFJLElBQUksS0FBSyxJQUFJLEVBQUU7b0JBQ2YsSUFBSSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNuQyxNQUFNLFNBQVMsR0FBYSxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO29CQUM3QyxRQUFRLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQztvQkFDL0IsUUFBUSxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7b0JBQ2hDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7aUJBQ3hCO1lBQ0wsQ0FBQyxDQUFDLENBQUM7WUFDSCxPQUFPLEtBQUssQ0FBQztRQUNqQixDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDZjtJQUFDLE9BQU8sS0FBSyxFQUFFO1FBQ1osTUFBTSxJQUFJLEtBQUssQ0FBQywyQkFBMkIsR0FBRyxLQUFLLENBQUMsQ0FBQztLQUN4RDtBQUNMLENBQUMsQ0FBQztBQTBDYywwQ0FBZTtBQXhDL0IsTUFBTSxRQUFRLEdBQUcsS0FBSyxJQUFrQixFQUFFO0lBQ3RDLElBQUk7UUFDQSxNQUFNLEtBQUssR0FBUSxFQUFFLENBQUM7UUFDdEIsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLENBQUMsQ0FBQztRQUM1RCxLQUFLLENBQUMsSUFBSSxHQUFHLE1BQU0sS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsQ0FBQztRQUMzQyxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLDZPQUE2TyxDQUFDLENBQUM7UUFFclEsT0FBTyxLQUFLLENBQUM7S0FDaEI7SUFBQyxPQUFPLEtBQUssRUFBRTtRQUNaLE1BQU0sSUFBSSxLQUFLLENBQUMsa0JBQWtCLEdBQUcsS0FBSyxDQUFDLENBQUM7S0FDL0M7QUFDTCxDQUFDLENBQUM7QUE2QitCLDRCQUFRO0FBM0J6QyxNQUFNLElBQUksR0FBRyxLQUFLLEVBQUUsRUFBVSxFQUFFLEdBQVcsRUFBZ0IsRUFBRTtJQUN6RCxJQUFJLE9BQU8sQ0FBQztJQUNaLElBQUk7UUFDQSxNQUFNLElBQUksR0FBRyxNQUFNLFFBQVEsRUFBRSxDQUFDO1FBQzlCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUM7UUFDdkIsT0FBTyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7UUFDdkIsTUFBTSxXQUFXLEdBQUcsTUFBTSxLQUFLLENBQUMsSUFBSSxFQUFFLEVBQUUsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUMvQyxNQUFNLGFBQWEsR0FBRyxNQUFNLGVBQWUsQ0FBQyxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFFL0QsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQ3JCLE1BQU0sT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3RCLE1BQU0sTUFBTSxHQUFXO1lBQ25CLEtBQUssRUFBRSxhQUFhO1lBQ3BCLE1BQU0sRUFBRSxHQUFHO1NBQ2QsQ0FBQztRQUNGLE9BQU8sTUFBTSxDQUFDO0tBQ2pCO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixNQUFNLFlBQVksR0FBVztZQUN6QixRQUFRLEVBQUUsS0FBSztZQUNmLE1BQU0sRUFBRSxHQUFHO1NBQ2QsQ0FBQztRQUNGLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNiLE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNoQixPQUFPLFlBQVksQ0FBQztLQUN2QjtBQUNMLENBQUMsQ0FBQztBQUV5QyxvQkFBSSJ9