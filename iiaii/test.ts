import * as chai from 'chai';
const assert = chai.assert;
const getMailList = require('./build/getMailList');
const id: string = process.argv[5];
const pwd: string = process.argv[6];
const pageLoad = getMailList.pageLoad;
const login = getMailList.login;
const extractMailList = getMailList.extractMailList;
const main = getMailList.main;
// login(id, pwd) : link  
// extractMailList(link) : list

// 로그인 성공 확인
const linkChk = (v): boolean => {
    const re = new RegExp('(http|https|ftp|telnet|news|irc)://mail.google.com/([-/.a-zA-Z0-9_~#%$?&=:200-377()]+)', 'i');
    return re.test(v);
};
// getMailList 모듈 결과 확인
const resultChk = (value, text) => {
    value.forEach((element) => {
        assert.isString(element, text);
    });
};

describe('# 메일 정보 추출 테스트', () => {
    it('메일 리스트(제목,보낸사람) 리턴?', () => {
        const result: any = main(id, pwd);

        // 테스트 성공
        if (result.status === '200') {
            assert.isObject('', '형식 확인');
            resultChk(result.name, '보낸이름 -> 유효값인지 확인');
            resultChk(result.title, '메일제목 -> 유효값인지 확인');
        } /*
        // 테스트 실패
        else if(result.status === '400') {  
            
        }*/
    }).timeout(10000);
});