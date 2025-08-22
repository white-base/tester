/**
 * DOM 말단(leaf) 요소의 텍스트를 수집하고
 * 불필요한 중간 태그·:nth-child(1) 을 정리한 셀렉터 목록을 반환합니다.
 * 각 단계는 공백(자손 선택자)으로 구분합니다.
 *
 * @returns {string[]}  예) #sod_fin_orderer tr:nth-child(1) td | text | 김영호
 */
function extractLeafTextNodesSimplified() {
    var results = [];
    var seen = {};

    /* ---------- 1. 설정 ---------- */

    // 1) 생략할 중간 태그
    var SKIP_TAGS = {
        table: true, tbody: true, thead: true, tfoot: true,
        form: true, fieldset: true, legend: true,
        main: true, aside: true, article: true, section: true,
        ul: true, div: true
    };

    // 2) :nth-child(1) 을 유지해야 하는 태그
    var KEEP_NTH_CHILD_TAGS = { tr: true, li: true, option: true };

    /* ---------- 2. 유틸리티 ---------- */

    /** 중간 태그 생략 여부 */
    function shouldSkip(el) {
        if (!(el instanceof Element)) return false;
        var tag = el.tagName.toLowerCase();
        if (tag === 'script') return true;                 // <script> 제거
        if (!SKIP_TAGS[tag]) return false;                 // 목록에 없으면 keep
        if ((tag === 'div' || tag === 'section' || tag === 'article')
             && (el.id || el.className.trim())) return false; // 식별자 있으면 keep
        return true;                                       // 그 외 생략
    }

    /** leaf 판정 */
    function isLeaf(el) {
        return el instanceof Element &&
               el.tagName.toLowerCase() !== 'script' &&
               el.children.length === 0;
    }

    /** raw 셀렉터 생성(공백 구분) */
    function getRawSelector(el) {
        var path = [];
        var cur = el;

        while (cur && cur.nodeType === 1) {
            if (shouldSkip(cur)) { cur = cur.parentNode; continue; }

            var tag = cur.tagName.toLowerCase();
            var part = tag;

            if (cur.id) {                     // id 발견 시 경로 종결
                path.unshift('#' + cur.id);
                break;
            }

            // class 포함
            var cls = cur.className.trim();
            if (cls) part += '.' + cls.split(/\s+/).join('.');

            // 형제 위치 계산
            var parent = cur.parentNode;
            if (parent) {
                var idx = 1;
                for (var s = parent.children[0]; s && s !== cur; s = s.nextElementSibling) {
                    if (s.tagName === cur.tagName) idx++;
                }
                part += ':nth-child(' + idx + ')';
            }
            path.unshift(part);
            cur = cur.parentNode;
        }
        return path.join(' ');
    }

    /** 2차 가공: 중간 태그 제거 + 필요 없는 :nth-child(1) 삭제 */
    function simplifySelector(sel) {
        var segs = sel.split(/\s+/);      // 공백 단위 분리
        var out = [];

        if (segs.length) {
            out.push(segs[0]);            // #id 또는 루트 태그

            for (var i = 1; i < segs.length; i++) {
                var seg = segs[i];
                var tag = (seg.match(/^([a-zA-Z0-9_-]+)/) || [])[1] || '';

                // 중간 생략 대상이면 skip
                if (SKIP_TAGS[tag]) continue;

                // :nth-child(1) 삭제 (단, KEEP 대상 태그는 보존)
                if (!KEEP_NTH_CHILD_TAGS[tag])
                    seg = seg.replace(/:nth-child\(1\)/g, '');

                out.push(seg);
            }
        }
        return out.join(' ');
    }

    /** 결과 저장 */
    function pushResult(el, txt) {
        var rawSel = getRawSelector(el);
        if (!rawSel) return;

        var sel = simplifySelector(rawSel);
        var val = txt.substring(0, 10);        // 앞 10자
        var key = sel + '|text|' + val;
        if (!seen[key]) {
            seen[key] = true;
            results.push(sel + ' | text | ' + val);
        }
    }

    /* ---------- 3. DOM 순회 ---------- */
    var all = document.querySelectorAll('body *');
    for (var i = 0; i < all.length; i++) {
        var el = all[i];
        if (!isLeaf(el)) continue;

        var text = el.innerText || el.textContent;
        if (text && text.trim()) pushResult(el, text.trim());
    }

    return results;
}

/* ===== 사용 예시 =====
var list = extractLeafTextNodesSimplified();
console.log(list.join('\n'));
*/