import * as puppeteer from 'puppeteer';
import { account, mail } from './interfaces';
import * as config from './config';

let gmails: mail[];

export async function get_browser(){
    try {
        return await puppeteer.launch({headless:true});
    } catch (error) {
        throw config.GET_BROWSER_FALE; // 브라우저 실행 실패
    }
}

export async function get_page(browser : puppeteer.Browser){
    try {
        return await browser.newPage();
    } catch (error) {
        throw config.GET_PAGE_FAIL; // 새페이지 실패
    }
}

export async function google_login(user : account, page: puppeteer.Page){
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36');
    await page.goto('https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=AddSession');
    await page.type('#identifierId', user.id);
    await page.click('#identifierNext > content');
    try {
        await page.waitForNavigation({waitUntil:"networkidle0", timeout:2000});
    } catch (error) {
        throw config.ID_FAIL;   // 아이디 없음
    }
    await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user.password);
    await page.click('#passwordNext > div.ZFr60d.CeoRYc');
    try {
        await page.waitForSelector('span.bog>span',{visible:true, timeout:5000});
    } catch (error) {
        throw config.PASSWORD_FAIL; // 비밀번호 틀림
    }
}

export async function get_mail_list(page: puppeteer.Page) {
    const subject = await page.$$('span.bog>span');
    const subject_text = await Promise.all(
        subject.map(value => get_all_promise(value))
    );
    const sender = await page.$$('span.yP');
    const sender_text = await Promise.all(
        sender.map(value => get_all_promise(value))
    );

    if(subject.length === 0 || sender.length === 0){
        throw config.EMAIL_LOAD_FAIL;
    }
    
    const mails = subject_text.map((value, index) => set_mail(value, sender_text[index]));
    gmails = mails;
}

export function get_gmails() : mail[]{
    return gmails;
}

async function get_all_promise(element_handle : puppeteer.ElementHandle<Element>){
    const valuehandle = await element_handle.getProperty('innerText');
    return valuehandle.jsonValue();
}

function set_mail(subject_value: string, sender_value: string):mail{
    return {subject:subject_value, sender:sender_value};
}

export async function close_browser(browser : puppeteer.Browser){
    await browser.close();
}