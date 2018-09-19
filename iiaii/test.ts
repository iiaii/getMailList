import * as chai from 'chai';
const assert = chai.assert;
const getMailList = require('./build/getMailList');
const id: string = process.argv[5];
const pwd: string = process.argv[6];
const main = getMailList.main;

// getMailList 모듈 결과 확인
const resultChk = (value, text) => {
    value.forEach((element) => {
        assert.isString(element.sender, text);
        assert.isString(element.subject, text);
    });
};

describe('# 메일 정보 추출 테스트', () => {
    it('메일 리스트(제목,보낸사람) 리턴?', async () => {
        const result: any = await main(id, pwd);
        // 테스트 성공
        if (result.status === 200) {
            assert.isObject(result, '형식 확인');
            resultChk(result.mails, '메일정보(이름,제목) -> 유효값인지 확인');
        } else if (result.status === 400) {  // 테스트 실패
            console.log(result.errorMsg);
        }
    }).timeout(15000);
});