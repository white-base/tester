
// process.env.LANG = 'ko_KR.UTF-8';
// const {ArrayCollection} = require('logic-core')
// const {PropertyCollection, Type, Message} = require('logic-core/ko')


// (async () => {
//     await Message.changeLanguage('ko')
// })();


// console.log(Type.allowType([[String, Number]], {}));


// console.log('ArrayCollection', ArrayCollection);
// console.log('PropertyCollection', PropertyCollection);


// console.log('0');

describe("[target: message.js]", () => {
    describe("CJS 환경 테스트", () => {
        beforeEach(() => {
            jest.restoreAllMocks();
            jest.resetModules();
        });

        it.skip("CJS 방식으로 JSON 로드", async () => {
            const {Message, Type} = require('logic-core/ko')

            expect(Message.defaultLang).toBe('default')
            expect(Message.currentLang).toBe('ko')

            await Message.changeLanguage("ko");

            expect(Message.defaultLang).toBe('default')
            expect(Message.currentLang).toBe('ko');
            expect(Message.get('KO')).toMatch(/OK/);
            expect(Message.get('EN')).toMatch(/OK/);
        });
        it("한글 자동감지 확인", async () => {
            process.env.LANG = 'ko_US.UTF-8';
            const {Message, Type} = require('logic-core')

            // await Message.changeLanguage('ko')
            expect(Message.currentLang).toBe('default')

            await Message.autoDetect()

            // expect(typeof Message.$storage.lang.ko).toBe('object');
            expect(() => Type.allowType([[String, Number]], {})).toThrow('타입')
        });
        describe("Message.autoDetect() : 언어자동 설정", () => {
            it("- 한글", async () => {
            process.env.LANG = 'ko_KR.UTF-8';
                const {Message} = require('logic-core/ko')
                await Message.autoDetect()
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('ko')
                expect(Message.get('KO')).toMatch(/OK/);
                expect(Message.get('EN')).toMatch(/OK/);
            });
            it("- 영어 환경", async () => {
                process.env.LANG = 'en_US.UTF-8';
                const {Message} = require('logic-core')
                await Message.autoDetect()
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('default')
            });
            it("- 일어 환경", async () => {
                process.env.LANG = 'ja_JP.UTF-8';
                const {Message} = await require('logic-core/ko')
                await Message.autoDetect()
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('ja')
            });
        });
    });
});
