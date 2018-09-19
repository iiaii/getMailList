"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
exports.__esModule = true;
var Debug = require("debug");
var puppeteer = require("puppeteer");
var debug = Debug('getMailList');
// 로그인
var login = function (_page, _id, _pwd) { return __awaiter(_this, void 0, void 0, function () {
    var link, pwdSpace, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 7, , 8]);
                link = '';
                // 아이디창 입력
                return [4 /*yield*/, _page.type('#identifierId', _id)];
            case 1:
                // 아이디창 입력
                _a.sent();
                return [4 /*yield*/, _page.click('#identifierNext > div.ZFr60d.CeoRYc')];
            case 2:
                _a.sent();
                pwdSpace = '.whsOnd.zHQkBf';
                return [4 /*yield*/, _page.waitForNavigation({ waitUntil: 'networkidle2' })];
            case 3:
                _a.sent();
                return [4 /*yield*/, _page.type(pwdSpace, _pwd)];
            case 4:
                _a.sent();
                return [4 /*yield*/, _page.click('#passwordNext > div.ZFr60d.CeoRYc')];
            case 5:
                _a.sent();
                return [4 /*yield*/, _page.url()];
            case 6:
                link = _a.sent();
                return [2 /*return*/, link];
            case 7:
                error_1 = _a.sent();
                throw error_1;
            case 8: return [2 /*return*/];
        }
    });
}); };
exports.login = login;
// 메일 정보(이름,제목) 추출
var extractMailList = function (_page, _link) { return __awaiter(_this, void 0, void 0, function () {
    var data, nameTag, titleTag, _a, _b, error_2;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                data = {};
                nameTag = 'td.yX.xY .yW span';
                titleTag = 'td.xY.a4W .bog';
                return [4 /*yield*/, _page.waitForSelector(nameTag)];
            case 1:
                _c.sent();
                // 메일 송신자 이름 추출
                _a = data;
                return [4 /*yield*/, _page.evaluate(function (nameTag) {
                        var anchors = Array.from(document.querySelectorAll(nameTag));
                        return anchors.map(function (anchor) {
                            var title = anchor.textContent;
                            return title;
                        });
                    }, nameTag)];
            case 2:
                // 메일 송신자 이름 추출
                _a.name = _c.sent();
                // 메일 제목 추출
                _b = data;
                return [4 /*yield*/, _page.evaluate(function (titleTag) {
                        var anchors = Array.from(document.querySelectorAll(titleTag));
                        return anchors.map(function (anchor) {
                            var title = anchor.textContent;
                            return title;
                        });
                    }, titleTag)];
            case 3:
                // 메일 제목 추출
                _b.title = _c.sent();
                return [2 /*return*/, data];
            case 4:
                error_2 = _c.sent();
                throw error_2;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.extractMailList = extractMailList;
// 페이지 로드
var pageLoad = function () { return __awaiter(_this, void 0, void 0, function () {
    var _Load, _a, _b, error_3;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                _Load = {};
                _a = _Load;
                return [4 /*yield*/, puppeteer.launch({ headless: false })];
            case 1:
                _a.browser = _c.sent();
                _b = _Load;
                return [4 /*yield*/, _Load.browser.newPage()];
            case 2:
                _b.page = _c.sent();
                return [4 /*yield*/, _Load.page.goto('https://accounts.google.com/ServiceLogin/signinchooser?service=mail&passive=true&rm=false&continue=https%3A%2F%2Fmail.google.com%2Fmail%2F&ss=1&scc=1&ltmpl=default&ltmplcache=2&emr=1&osid=1&flowName=GlifWebSignIn&flowEntry=ServiceLogin')];
            case 3:
                _c.sent();
                return [2 /*return*/, _Load];
            case 4:
                error_3 = _c.sent();
                throw error_3;
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.pageLoad = pageLoad;
// 메인
var main = function (ID, PWD) { return __awaiter(_this, void 0, void 0, function () {
    var Load, page, browser, loginResult, extractResult, result, error_4, error_result;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 5, , 6]);
                return [4 /*yield*/, pageLoad()];
            case 1:
                Load = _a.sent();
                page = Load.page;
                browser = Load.browser;
                return [4 /*yield*/, login(page, ID, PWD)];
            case 2:
                loginResult = _a.sent();
                return [4 /*yield*/, extractMailList(page, loginResult)];
            case 3:
                extractResult = _a.sent();
                debug(extractResult);
                return [4 /*yield*/, browser.close()];
            case 4:
                _a.sent();
                result = {
                    name: extractResult.name,
                    title: extractResult.title,
                    status: 200
                };
                return [2 /*return*/, result];
            case 5:
                error_4 = _a.sent();
                error_result = {
                    errorMsg: error_4,
                    status: 400
                };
                debug(error_4);
                return [2 /*return*/, error_result];
            case 6: return [2 /*return*/];
        }
    });
}); };
exports.main = main;
main('iiaii@playauto.co.kr', 'davichi123');
