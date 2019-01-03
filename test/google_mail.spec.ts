import { account } from '../Mingtori/interfaces'
import { get_page, google_login, get_browser, close_browser, get_mail_list, get_gmails } from "../Mingtori/google_mail";
import { fail } from 'assert';

let browser ;
let page;

const account: account = {
	id: process.argv[5],
	password: process.argv[6],
};

describe('gmail list test', function() {
	it('get_brower 실행', async function() {
		try {
			browser = await get_browser();
		} catch (error) {
			fail(error);
		}
	});
	it('get_page 실행', async function() {
		try {
			page = await get_page(browser);
		} catch (error) {
			fail(error);
		}
	});
	it('google login', async function() {
		try {
			await google_login(account, page);
		} catch (error) {
			fail(error);
		}
	}).timeout(10000);
	it('mail_load', async function() {
		try {
			await get_mail_list(page);
			console.log(get_gmails());
		} catch (error) {
			fail(error);
		}
	});
	it('browser close', async function() {
		try {
			await close_browser(browser);
		} catch (error) {
			fail(error);
		}
	});
});