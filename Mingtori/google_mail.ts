import * as puppeteer from 'puppeteer';
import { account, mail } from './interfaces';

let gmails: mail[];

export async function get_browser(){
    return await puppeteer.launch({headless:false});
}

export async function get_page(browser : puppeteer.Browser){
    return await browser.newPage();
}

export async function google_login(user : account, page: puppeteer.Page){
    await page.goto('https://accounts.google.com/ServiceLogin/identifier?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin');
    await page.type('#identifierId', user.id);
    await page.click('#identifierNext > content');
    await page.waitForNavigation({waitUntil:"networkidle0"});
    await page.type('#password > div.aCsJod.oJeWuf > div > div.Xb9hP > input', user.password);
    await page.click('#passwordNext > div.ZFr60d.CeoRYc');
    await page.waitForSelector('span.bog>span',{visible:true});
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
    
    const mails = subject_text.map((value, index) => set_mail(value, sender_text[index]));
    gmails = mails;
    // console.log(mail_list);
}

export function get_gmails(){
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