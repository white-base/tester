
// process.env.LANG = 'ko_KR.UTF-8';
// const {ArrayCollection} = require('logic-core')
// const {PropertyCollection, Type, Message} = require('logic-core/ko')


// (async () => {
//     await Message.changeLanguage('ko')
// })();
// const koCode = require("logic-core");


// console.log(Type.allowType([[String, Number]], {}));


// console.log('ArrayCollection', ArrayCollection);
// console.log('PropertyCollection', PropertyCollection);


// console.log('0');

describe("[target: message.js]", () => {
    describe("BROWSER ENV TEST", () => {
        beforeEach(() => {
            global.fetch = jest.fn(() =>
                Promise.resolve({
                    json: () => Promise.resolve(koCode),
                })
            );
            process.env.LANG = 'ko_KR.UTF-8';
            jest.restoreAllMocks();
        });
        describe("Message.changeLanguage() : 언어 변경", () => {
            it("- 언어 변경", async () => {
                const {Message} = require("logic-core");
                // const logicCore = require("logic-core");
                // require("logic-core");

                // const {Message} = await import("logic-core");

    
                // const {Message} = globalThis._L;
                // const {Message} = logicCore
                // await import("logic-core");
                // await import("../dist/logic-core.umd.js");
                // const Message = await import("../dist/logic-core.umd.js");
                
                // const {Message} = await import("logic-core");

                // await import("logic-core");
                // const {Message} = _L;

                // require("../dist/logic-core.umd.js");
                
                // const {Message} = require("../dist/logic-core.umd.js");
                
                // const _L = require("../dist/logic-core.umd.js");
                // const {Message} = _L;
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('default')
    
                await Message.changeLanguage("ko");
    
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('ko')
                expect(Message.get('KO')).toMatch(/OK/);
                expect(Message.get('EN')).toMatch(/OK/);
            });
        });
        describe("Message.autoDetect() : 언어자동 감지", () => {
            it("- 활성화", async () => {
                // globalThis.navigator.languages = ['ko-KR', 'ko'];

                // globalThis.navigator = {
                //     languages: ['ko-KR', 'ko'],
                //     language: 'ko-KR',
                // };
                // process.env.LANG = 'ko_KR.UTF-8';
                Object.defineProperty(navigator, 'languages', {
                    configurable: true,
                    get: () => ['ko-KR', 'ko'],
                });

                // const _L = require("../dist/logic-core.umd.js");
                await import("../dist/logic-core.umd.js");
                const {Message} = _L;
                // const {Message} = require("../src/message.js");

                await Message.autoDetect();

                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('ko')
            });
        });
    });
});