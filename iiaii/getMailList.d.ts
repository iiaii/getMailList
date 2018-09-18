declare function login (_id: string, _pwd: string): string;
declare function extractMailList (_link: string): any[];
export {login, extractMailList};

// declare module "login" {
//     function login (_id: string, _pwd: string): string;
//     export = login;
// }
// declare module "extractMailList" {
//     function extractMailList (_link: string): any[];
//     export = extractMailList;
// }