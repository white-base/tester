
import {Type} from  'logic-entity';
// 뷰 컴포넌트 샘플 코드
var Util = {};
// var Type = {};

class BindModel {}
class IList {
    cmd = {
        read: Object,
        list: Object,
    }
    fn = {
        // 함수에 대한 타입 검사
    }
}
class IFAQ {}

class Svc {
    constructor() {
        Util.implements(Svc, this, IFAQ);
    }
}



class FAQList {
    constructor() {
        Util.implements(FAQList, this, IFAQ);  // 인터페이스
    }
}


// 사용하는 객체를 타입을 지정하는것?

// BindModel.




// Vue 컴포넌트일 경우
const app = createApp({
    data() {
      return {
        notices: [],
        selectedNotice: null,
        statusOptions: {
          'D': 'Standby',
          'A': 'Activation',
          'H': 'Hidden'
        },
        bindModel: bm,
      };
    },
    created() {
        Type.matchType(IList, this.bm);  // bm 인터페이스 구현 검사
    },
    methods: {
      selectNotice(idx) {
        this.selectedNotice = idx;
      },
      deselectNotice() {
        this.selectedNotice = null;
      },
    },
    components: {
      'notice-list': NoticeList,
      'notice-form': NoticeForm
    }
  });
  