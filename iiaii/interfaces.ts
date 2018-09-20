import * as puppeteer from 'puppeteer';

export interface mails {
    sender: string;
    subject: string;
}

export interface result {
    mails?: mails[];
    status: number;
    errorMsg?: string;
}

export interface pageLoadData {
    browser: puppeteer.Browser;
    page: puppeteer.Page;
}