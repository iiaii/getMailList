import { account } from '../Mingtori/interfaces'
import { get_page, google_login, get_browser, close_browser, get_mail_list, get_gmails } from "../Mingtori/google_mail";
import * as config from '../Mingtori/config';
import { fail } from 'assert';

let browser ;
let page;

const account: account = {
	id: process.argv[5],
	password: process.argv[6],
};

describe('gmail list test', function() {
	it('get_brower 실행', async function() {
		browser = await get_browser();
		if(browser === config.GET_BROWSER_FALE){
			fail('브라우저 실행 실패');
		}
	})
	it('get_page 실행', async function() {
		page = await get_page(browser);
		if(page === config.GET_PAGE_FAIL){
			fail('새페이지 실행 실패');
		}
	})
	it('google login', async function() {
		try {
			await google_login(account, page);
		} catch (error) {
			switch(error){
				case config.ID_FAIL:
					fail('아이디 없음');
					break;
				case config.PASSWORD_FAIL:
					fail('비밀번호 틀림');
					break;
			}
		}
	}).timeout(10000);
	it('mail_load', async function() {
		try {
			await get_mail_list(page);
			console.log(get_gmails());
		} catch (error) {
			if(error === config.EMAIL_LOAD_FAIL){
				fail('이메일 로드 실패');
			}
		}
	});
	it('browser close', async function() {
		if(browser === config.GET_BROWSER_FALE){
			fail('브라우저 닫기 실패');
		}
		await close_browser(browser);
	})
})