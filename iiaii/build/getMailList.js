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
        throw error;
    }
};
exports.login = login;
const extractMailList = async (_page, _link) => {
    try {
        const data = {};
        const nameTag = 'td.yX.xY .yW span';
        const titleTag = 'td.xY.a4W .bog';
        await _page.waitForSelector(nameTag);
        data.name = await _page.evaluate((nameTag) => {
            const anchors = Array.from(document.querySelectorAll(nameTag));
            return anchors.map((anchor) => {
                const title = anchor.textContent;
                return title;
            });
        }, nameTag);
        data.title = await _page.evaluate((titleTag) => {
            const anchors = Array.from(document.querySelectorAll(titleTag));
            return anchors.map((anchor) => {
                const title = anchor.textContent;
                return title;
            });
        }, titleTag);
        return data;
    }
    catch (error) {
        throw error;
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
        throw error;
    }
};
exports.pageLoad = pageLoad;
const main = async (ID, PWD) => {
    try {
        const Load = await pageLoad();
        const page = Load.page;
        const browser = Load.browser;
        const loginResult = await login(page, ID, PWD);
        const extractResult = await extractMailList(page, loginResult);
        debug(extractResult);
        await browser.close();
        const result = {
            name: extractResult.name,
            title: extractResult.title,
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
        return error_result;
    }
};
exports.main = main;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0TWFpbExpc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9nZXRNYWlsTGlzdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUErQjtBQUMvQix1Q0FBdUM7QUFDdkMsTUFBTSxLQUFLLEdBQUcsS0FBSyxDQUFDLGFBQWEsQ0FBQyxDQUFDO0FBR25DLE1BQU0sS0FBSyxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsR0FBVyxFQUFFLElBQVksRUFBZ0IsRUFBRTtJQUN4RSxJQUFJO1FBQ0EsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBR3RCLE1BQU0sS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDdkMsTUFBTSxLQUFLLENBQUMsS0FBSyxDQUFDLHFDQUFxQyxDQUFDLENBQUM7UUFHekQsTUFBTSxRQUFRLEdBQUcsZ0JBQWdCLENBQUM7UUFDbEMsTUFBTSxLQUFLLENBQUMsaUJBQWlCLENBQUMsRUFBRSxTQUFTLEVBQUUsY0FBYyxFQUFFLENBQUMsQ0FBQztRQUM3RCxNQUFNLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ2pDLE1BQU0sS0FBSyxDQUFDLEtBQUssQ0FBQyxtQ0FBbUMsQ0FBQyxDQUFDO1FBQ3ZELElBQUksR0FBRyxNQUFNLEtBQUssQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUV6QixPQUFPLElBQUksQ0FBQztLQUNmO0lBQUMsT0FBTyxLQUFLLEVBQUU7UUFDWixNQUFNLEtBQUssQ0FBQztLQUNmO0FBQ0wsQ0FBQyxDQUFDO0FBeUVPLHNCQUFLO0FBdkVkLE1BQU0sZUFBZSxHQUFHLEtBQUssRUFBRSxLQUFVLEVBQUUsS0FBYSxFQUFnQixFQUFFO0lBQ3RFLElBQUk7UUFDQSxNQUFNLElBQUksR0FBUSxFQUFFLENBQUM7UUFDckIsTUFBTSxPQUFPLEdBQUcsbUJBQW1CLENBQUM7UUFDcEMsTUFBTSxRQUFRLEdBQUcsZ0JBQWdC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