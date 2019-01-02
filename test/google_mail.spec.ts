import { account } from '../Mingtori/interfaces'
import { get_page, google_login, get_browser, close_browser, get_mail_list, get_gmails } from "../Mingtori/google_mail";

let browser;
let page;

const account: account = {
	id: process.argv[5],
	password: process.argv[6],
};

describe('gmail list test', function() {
	it('get_brower 실행', async function() {
		browser = await get_browser();
	})
	it('get_page 실행', async function() {
		page = await get_page(browser);
	})
	it('google login', async function() {
		await google_login(account, page);
	}).timeout(10000);
	it('mail_load', async function() {
		await get_mail_list(page);
	});
	it('browser close', async function() {
		await close_browser(browser);
	})
	it('print gmail', function(){
		console.log(get_gmails());
	})
})