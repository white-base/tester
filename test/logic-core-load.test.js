
//==============================================================
// gobal defined
// import {Message} from 'logic-core';
import {jest} from '@jest/globals';
const T = true;

// const {Message} = await import('logic-core');

//==============================================================
// test
describe("[logic-core]", () => {
    describe("Message :: 클래스", () => {
        beforeEach(async () => {
            jest.resetModules();
            // globalThis.isESM = true
        });
        describe("Message.$storage : 메세지 저장소", () => {
            it("- $storage : 기본 언어 얻기", async () => {
                const {Message} = await import('logic-core');

                expect(typeof Message.$storage).toBe('object')
                expect(typeof Message.$storage.lang).toBe('object')
                expect(typeof Message.$storage.lang.default).toBe('object')
                expect(Message.$storage.path.length > 0).toBe(T)
            });
        });
        describe("Message.autoDetect() : 언어자동 설정", () => {
            it("- 한글", async () => {
                process.env.LANG = 'ko_KR.UTF-8';
                const {Message} = await import('logic-core');
                await Message.autoDetect()
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('ko')
                expect(Message.get('KO')).toMatch(/OK/);
                expect(Message.get('EN')).toMatch(/OK/);
            });
            it("- 영어 환경", async () => {
                process.env.LANG = 'en_US.UTF-8';
                const {Message} = await import('logic-core');
                await Message.autoDetect()
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('default')
            });
            it("- 일어 환경", async () => {
                process.env.LANG = 'ja_JP.UTF-8';
                const {Message} = await import('logic-core');
                await Message.autoDetect()
                
                expect(Message.defaultLang).toBe('default')
                expect(Message.currentLang).toBe('ja')
            });
        });
    });
});