declare const login: (_page: any, _id: string, _pwd: string) => Promise<any>;
declare const extractMailList: (_page: any, _link: string) => Promise<any>;
declare const pageLoad: () => Promise<any>;
declare const main: (ID: string, PWD: string) => Promise<any>;
export { login, extractMailList, pageLoad, main };
