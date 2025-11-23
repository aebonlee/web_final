// 웹프로그래밍 문제 데이터베이스
const questions = [
    // 객관식 문제 (1-40)
    {
        id: 1,
        type: 'multiple',
        question: 'HTML5에서 시맨틱 요소가 아닌 것은?',
        options: ['<article>', '<section>', '<div>', '<nav>'],
        answer: 2,
        explanation: '<div>는 의미를 갖지 않는 일반적인 컨테이너 요소입니다. 나머지는 모두 HTML5의 시맨틱 요소입니다.',
        guide: {
            title: 'HTML5 시맨틱 요소',
            content: `
                <h4>📖 HTML5 시맨틱 요소란?</h4>
                <p>HTML5 시맨틱 요소는 웹 페이지의 <strong>구조와 의미</strong>를 명확하게 나타내는 태그입니다.</p>
                
                <h5>🔹 주요 시맨틱 요소들</h5>
                <ul>
                    <li><code>&lt;header&gt;</code> : 페이지나 섹션의 머리말</li>
                    <li><code>&lt;nav&gt;</code> : 내비게이션 링크들</li>
                    <li><code>&lt;main&gt;</code> : 페이지의 주요 콘텐츠</li>
                    <li><code>&lt;article&gt;</code> : 독립적인 글 또는 콘텐츠</li>
                    <li><code>&lt;section&gt;</code> : 관련된 콘텐츠 그룹</li>
                    <li><code>&lt;aside&gt;</code> : 부가적인 콘텐츠</li>
                    <li><code>&lt;footer&gt;</code> : 페이지나 섹션의 바닥글</li>
                </ul>
                
                <h5>✨ 시맨틱 요소의 장점</h5>
                <ol>
                    <li><strong>SEO 개선</strong> : 검색엔진이 내용을 더 잘 이해</li>
                    <li><strong>접근성 향상</strong> : 스크린 리더 등에서 활용</li>
                    <li><strong>유지보수성</strong> : 코드의 구조가 명확해짐</li>
                </ol>
                
                <div class="code-example">
                    <h5>💡 예시 코드</h5>
                    <pre><code>&lt;article&gt;
    &lt;header&gt;
        &lt;h1&gt;블로그 제목&lt;/h1&gt;
    &lt;/header&gt;
    &lt;section&gt;
        &lt;p&gt;본문 내용&lt;/p&gt;
    &lt;/section&gt;
&lt;/article&gt;</code></pre>
                </div>
            `
        }
    },
    {
        id: 2,
        type: 'multiple',
        question: 'CSS에서 요소를 수평 중앙 정렬하는 방법이 아닌 것은?',
        options: ['margin: 0 auto;', 'text-align: center;', 'display: flex; justify-content: center;', 'vertical-align: middle;'],
        answer: 3,
        explanation: 'vertical-align은 인라인 요소의 수직 정렬을 담당하며, 수평 중앙 정렬과는 관계가 없습니다.',
        guide: {
            title: 'CSS 중앙 정렬 방법',
            content: `
                <h4>🎯 CSS 중앙 정렬 마스터하기</h4>
                <p>웹 개발에서 가장 자주 사용하는 <strong>중앙 정렬 기법</strong>들을 알아봅시다.</p>
                
                <h5>🔹 수평 중앙 정렬</h5>
                <ul>
                    <li><code>margin: 0 auto;</code> - 블록 요소에 사용</li>
                    <li><code>text-align: center;</code> - 인라인/인라인 블록 요소</li>
                    <li><code>display: flex; justify-content: center;</code> - Flexbox</li>
                </ul>
                
                <h5>🔹 수직 중앙 정렬</h5>
                <ul>
                    <li><code>display: flex; align-items: center;</code> - Flexbox</li>
                    <li><code>position: absolute; top: 50%; transform: translateY(-50%);</code></li>
                    <li><code>display: grid; place-items: center;</code> - Grid</li>
                </ul>
                
                <div class="code-example">
                    <h5>💡 완전한 중앙 정렬</h5>
                    <pre><code>.center-box {
    display: flex;
    justify-content: center; /* 수평 */
    align-items: center;     /* 수직 */
    height: 100vh;
}</code></pre>
                </div>
            `
        }
    },
    {
        id: 3,
        type: 'multiple',
        question: 'JavaScript에서 변수를 선언하는 키워드가 아닌 것은?',
        options: ['var', 'let', 'const', 'define'],
        answer: 3,
        explanation: 'JavaScript에서는 var, let, const를 사용하여 변수를 선언합니다. define은 JavaScript의 예약어가 아닙니다.'
    },
    {
        id: 4,
        type: 'multiple',
        question: 'HTML에서 외부 CSS 파일을 연결하는 올바른 방법은?',
        options: ['<link rel="stylesheet" href="style.css">', '<style src="style.css">', '<css href="style.css">', '<stylesheet>style.css</stylesheet>'],
        answer: 0,
        explanation: '<link> 태그를 사용하여 rel="stylesheet" 속성과 href 속성으로 CSS 파일을 연결합니다.'
    },
    {
        id: 5,
        type: 'multiple',
        question: 'JavaScript에서 배열의 마지막 요소를 제거하는 메서드는?',
        options: ['push()', 'pop()', 'shift()', 'unshift()'],
        answer: 1,
        explanation: 'pop() 메서드는 배열의 마지막 요소를 제거하고 반환합니다.'
    },
    {
        id: 6,
        type: 'multiple',
        question: 'CSS Flexbox에서 주축의 방향을 설정하는 속성은?',
        options: ['flex-direction', 'justify-content', 'align-items', 'flex-wrap'],
        answer: 0,
        explanation: 'flex-direction 속성은 flex container의 주축 방향을 설정합니다.'
    },
    {
        id: 7,
        type: 'multiple',
        question: 'HTML5에서 비디오를 삽입하는 태그는?',
        options: ['<media>', '<video>', '<movie>', '<film>'],
        answer: 1,
        explanation: '<video> 태그를 사용하여 HTML5에서 비디오를 삽입합니다.'
    },
    {
        id: 8,
        type: 'multiple',
        question: 'JavaScript에서 문자열을 숫자로 변환하는 함수가 아닌 것은?',
        options: ['parseInt()', 'parseFloat()', 'Number()', 'toNumber()'],
        answer: 3,
        explanation: 'toNumber()는 JavaScript의 내장 함수가 아닙니다. 나머지는 모두 문자열을 숫자로 변환할 수 있습니다.'
    },
    {
        id: 9,
        type: 'multiple',
        question: 'CSS에서 요소를 숨기는 방법이 아닌 것은?',
        options: ['display: none;', 'visibility: hidden;', 'opacity: 0;', 'hidden: true;'],
        answer: 3,
        explanation: 'hidden: true;는 유효한 CSS 속성이 아닙니다. 나머지는 모두 요소를 숨기는 방법입니다.'
    },
    {
        id: 10,
        type: 'multiple',
        question: 'HTML에서 순서 없는 목록을 만드는 태그는?',
        options: ['<ol>', '<ul>', '<li>', '<list>'],
        answer: 1,
        explanation: '<ul> (unordered list) 태그를 사용하여 순서 없는 목록을 만듭니다.'
    },
    {
        id: 11,
        type: 'multiple',
        question: 'JavaScript에서 === 연산자의 특징은?',
        options: ['값만 비교', '타입만 비교', '값과 타입 모두 비교', '대소문자 구분 없이 비교'],
        answer: 2,
        explanation: '=== (strict equality) 연산자는 값과 타입을 모두 비교합니다.'
    },
    {
        id: 12,
        type: 'multiple',
        question: 'CSS Grid에서 그리드 아이템의 열 범위를 지정하는 속성은?',
        options: ['grid-column', 'grid-row', 'grid-area', 'grid-template'],
        answer: 0,
        explanation: 'grid-column 속성은 그리드 아이템이 차지할 열의 범위를 지정합니다.'
    },
    {
        id: 13,
        type: 'multiple',
        question: 'HTML form에서 비밀번호 입력을 위한 input type은?',
        options: ['text', 'password', 'secret', 'hidden'],
        answer: 1,
        explanation: 'type="password"를 사용하면 입력한 내용이 마스킹 처리됩니다.'
    },
    {
        id: 14,
        type: 'multiple',
        question: 'JavaScript에서 이벤트 버블링을 막는 메서드는?',
        options: ['preventDefault()', 'stopPropagation()', 'stopImmediatePropagation()', 'cancelBubble()'],
        answer: 1,
        explanation: 'stopPropagation() 메서드는 이벤트가 상위 요소로 전파되는 것을 막습니다.'
    },
    {
        id: 15,
        type: 'multiple',
        question: 'CSS에서 반응형 웹 디자인을 위한 미디어 쿼리 문법은?',
        options: ['@media', '@screen', '@responsive', '@viewport'],
        answer: 0,
        explanation: '@media 규칙을 사용하여 미디어 쿼리를 작성합니다.'
    },
    {
        id: 16,
        type: 'multiple',
        question: 'HTML5에서 로컬 스토리지에 데이터를 저장하는 메서드는?',
        options: ['localStorage.setItem()', 'localStorage.save()', 'localStorage.store()', 'localStorage.add()'],
        answer: 0,
        explanation: 'localStorage.setItem(key, value) 메서드를 사용하여 데이터를 저장합니다.'
    },
    {
        id: 17,
        type: 'multiple',
        question: 'JavaScript의 화살표 함수 문법으로 올바른 것은?',
        options: ['function => {}', '() => {}', '=> function() {}', 'arrow() {}'],
        answer: 1,
        explanation: '() => {} 형식이 올바른 화살표 함수 문법입니다.'
    },
    {
        id: 18,
        type: 'multiple',
        question: 'CSS에서 요소의 테두리 모서리를 둥글게 만드는 속성은?',
        options: ['border-radius', 'border-round', 'corner-radius', 'round-corner'],
        answer: 0,
        explanation: 'border-radius 속성을 사용하여 요소의 모서리를 둥글게 만듭니다.'
    },
    {
        id: 19,
        type: 'multiple',
        question: 'HTML에서 이미지 태그의 필수 속성은?',
        options: ['src와 alt', 'src와 title', 'href와 alt', 'url와 alt'],
        answer: 0,
        explanation: '<img> 태그에는 src(이미지 경로)와 alt(대체 텍스트) 속성이 필수입니다.'
    },
    {
        id: 20,
        type: 'multiple',
        question: 'JavaScript에서 비동기 처리를 위한 키워드가 아닌 것은?',
        options: ['async', 'await', 'promise', 'defer'],
        answer: 3,
        explanation: 'defer는 script 태그의 속성이며, 비동기 처리 키워드가 아닙니다.'
    },
    {
        id: 21,
        type: 'multiple',
        question: 'CSS에서 애니메이션을 정의하는 규칙은?',
        options: ['@keyframes', '@animation', '@animate', '@motion'],
        answer: 0,
        explanation: '@keyframes 규칙을 사용하여 CSS 애니메이션의 중간 상태를 정의합니다.'
    },
    {
        id: 22,
        type: 'multiple',
        question: 'HTML5의 새로운 input type이 아닌 것은?',
        options: ['email', 'date', 'color', 'textbox'],
        answer: 3,
        explanation: 'textbox는 HTML5의 input type이 아닙니다. text가 올바른 type입니다.'
    },
    {
        id: 23,
        type: 'multiple',
        question: 'JavaScript에서 객체의 모든 키를 배열로 반환하는 메서드는?',
        options: ['Object.keys()', 'Object.values()', 'Object.entries()', 'Object.getKeys()'],
        answer: 0,
        explanation: 'Object.keys() 메서드는 객체의 모든 키를 배열로 반환합니다.'
    },
    {
        id: 24,
        type: 'multiple',
        question: 'CSS에서 z-index 속성이 작동하기 위한 필수 조건은?',
        options: ['position이 static이 아니어야 함', 'display가 block이어야 함', 'float이 설정되어야 함', 'overflow가 hidden이어야 함'],
        answer: 0,
        explanation: 'z-index는 position이 static이 아닌 요소에만 적용됩니다.'
    },
    {
        id: 25,
        type: 'multiple',
        question: 'HTML에서 테이블의 헤더 셀을 나타내는 태그는?',
        options: ['<td>', '<th>', '<thead>', '<header>'],
        answer: 1,
        explanation: '<th> (table header) 태그는 테이블의 헤더 셀을 나타냅니다.'
    },
    {
        id: 26,
        type: 'multiple',
        question: 'JavaScript의 스프레드 연산자는?',
        options: ['...', '***', '---', '+++'],
        answer: 0,
        explanation: '... (three dots)가 JavaScript의 스프레드 연산자입니다.'
    },
    {
        id: 27,
        type: 'multiple',
        question: 'CSS에서 그라데이션을 만드는 함수가 아닌 것은?',
        options: ['linear-gradient()', 'radial-gradient()', 'conic-gradient()', 'color-gradient()'],
        answer: 3,
        explanation: 'color-gradient()는 CSS에 존재하지 않는 함수입니다.'
    },
    {
        id: 28,
        type: 'multiple',
        question: 'HTML의 meta 태그가 위치해야 하는 곳은?',
        options: ['<head> 내부', '<body> 내부', '<html> 직접 하위', '어디든 가능'],
        answer: 0,
        explanation: 'meta 태그는 <head> 섹션 내부에 위치해야 합니다.'
    },
    {
        id: 29,
        type: 'multiple',
        question: 'JavaScript에서 배열인지 확인하는 메서드는?',
        options: ['Array.isArray()', 'isArray()', 'typeof array', 'instanceof Array'],
        answer: 0,
        explanation: 'Array.isArray() 메서드가 가장 정확하게 배열을 확인하는 방법입니다.'
    },
    {
        id: 30,
        type: 'multiple',
        question: 'CSS에서 상속되지 않는 속성은?',
        options: ['color', 'font-size', 'margin', 'line-height'],
        answer: 2,
        explanation: 'margin은 상속되지 않는 속성입니다. 나머지는 모두 상속됩니다.'
    },
    {
        id: 31,
        type: 'multiple',
        question: 'HTML에서 인라인 요소가 아닌 것은?',
        options: ['<span>', '<a>', '<div>', '<strong>'],
        answer: 2,
        explanation: '<div>는 블록 레벨 요소입니다. 나머지는 모두 인라인 요소입니다.'
    },
    {
        id: 32,
        type: 'multiple',
        question: 'JavaScript의 템플릿 리터럴을 나타내는 기호는?',
        options: ['백틱(`)', '작은따옴표(\')', '큰따옴표(")', '대괄호([])'],
        answer: 0,
        explanation: '백틱(`)을 사용하여 템플릿 리터럴을 작성합니다.'
    },
    {
        id: 33,
        type: 'multiple',
        question: 'CSS에서 가상 클래스가 아닌 것은?',
        options: [':hover', ':active', ':before', ':focus'],
        answer: 2,
        explanation: ':before는 가상 요소(pseudo-element)이며, ::before로 표기합니다.'
    },
    {
        id: 34,
        type: 'multiple',
        question: 'HTML5에서 캔버스에 그림을 그리기 위한 컨텍스트는?',
        options: ['2d', '3d', 'webgl', '모두 가능'],
        answer: 3,
        explanation: 'canvas는 2d, webgl, webgl2 등 여러 컨텍스트를 지원합니다.'
    },
    {
        id: 35,
        type: 'multiple',
        question: 'JavaScript에서 즉시 실행 함수의 형태는?',
        options: ['(function(){})();', 'function(){}();', '{function(){}};', 'function{}();'],
        answer: 0,
        explanation: '(function(){})(); 형태가 즉시 실행 함수(IIFE)의 올바른 형태입니다.'
    },
    {
        id: 36,
        type: 'multiple',
        question: 'CSS에서 텍스트 정렬이 양쪽 정렬인 값은?',
        options: ['left', 'right', 'center', 'justify'],
        answer: 3,
        explanation: 'text-align: justify;는 텍스트를 양쪽 정렬합니다.'
    },
    {
        id: 37,
        type: 'multiple',
        question: 'HTML에서 주석을 작성하는 방법은?',
        options: ['<!-- 주석 -->', '// 주석', '/* 주석 */', '# 주석'],
        answer: 0,
        explanation: 'HTML에서는 <!-- 내용 --> 형식으로 주석을 작성합니다.'
    },
    {
        id: 38,
        type: 'multiple',
        question: 'JavaScript의 falsy 값이 아닌 것은?',
        options: ['0', 'null', '[]', 'undefined'],
        answer: 2,
        explanation: '빈 배열 []는 truthy 값입니다. 나머지는 모두 falsy 값입니다.'
    },
    {
        id: 39,
        type: 'multiple',
        question: 'CSS에서 박스 모델에 포함되지 않는 것은?',
        options: ['margin', 'border', 'padding', 'outline'],
        answer: 3,
        explanation: 'outline은 박스 모델에 포함되지 않으며, 레이아웃에 영향을 주지 않습니다.'
    },
    {
        id: 40,
        type: 'multiple',
        question: 'HTML의 DOCTYPE 선언의 목적은?',
        options: ['문서 타입 명시', 'CSS 연결', 'JavaScript 실행', '인코딩 설정'],
        answer: 0,
        explanation: 'DOCTYPE은 브라우저에게 문서 타입과 버전을 알려주는 역할을 합니다.'
    },
    
    // 단답식 문제 (41-50)
    {
        id: 41,
        type: 'short',
        question: 'CSS에서 모든 요소를 선택하는 선택자는 무엇입니까?',
        answer: '*',
        keywords: ['*', 'asterisk', '별표'],
        explanation: '* (asterisk) 선택자는 모든 HTML 요소를 선택하는 유니버설 선택자입니다.'
    },
    {
        id: 42,
        type: 'short',
        question: 'JavaScript에서 콘솔에 메시지를 출력하는 메서드는? (console. 뒤에 오는 메서드명만)',
        answer: 'log',
        keywords: ['log'],
        explanation: 'console.log() 메서드를 사용하여 콘솔에 메시지를 출력합니다.'
    },
    {
        id: 43,
        type: 'short',
        question: 'HTML에서 줄바꿈을 하는 태그는? (< > 제외하고 태그명만)',
        answer: 'br',
        keywords: ['br'],
        explanation: '<br> 태그는 줄바꿈(line break)을 만드는 빈 요소입니다.'
    },
    {
        id: 44,
        type: 'short',
        question: 'CSS에서 16진수 색상 코드는 어떤 기호로 시작합니까?',
        answer: '#',
        keywords: ['#', '샵', 'sharp'],
        explanation: '16진수 색상 코드는 # 기호로 시작합니다. 예: #FF0000 (빨강)'
    },
    {
        id: 45,
        type: 'short',
        question: 'JavaScript에서 현재 날짜와 시간을 가져오는 생성자는? (new 뒤에 오는 것만)',
        answer: 'Date',
        keywords: ['Date', 'date'],
        explanation: 'new Date()를 사용하여 현재 날짜와 시간 객체를 생성합니다.'
    },
    {
        id: 46,
        type: 'short',
        question: 'HTML 문서의 언어를 한국어로 설정하는 lang 속성 값은?',
        answer: 'ko',
        keywords: ['ko', 'ko-KR', 'korean'],
        explanation: 'lang="ko" 또는 lang="ko-KR"을 사용하여 문서 언어를 한국어로 설정합니다.'
    },
    {
        id: 47,
        type: 'short',
        question: 'CSS에서 투명도를 조절하는 속성명은?',
        answer: 'opacity',
        keywords: ['opacity'],
        explanation: 'opacity 속성은 요소의 투명도를 0(완전 투명)에서 1(불투명) 사이 값으로 설정합니다.'
    },
    {
        id: 48,
        type: 'short',
        question: 'JavaScript에서 반복문 중 조건이 참인 동안 계속 실행되는 구문은? (키워드만)',
        answer: 'while',
        keywords: ['while', 'do-while'],
        explanation: 'while 루프는 조건이 참인 동안 코드 블록을 반복 실행합니다.'
    },
    {
        id: 49,
        type: 'short',
        question: 'HTML에서 하이퍼링크를 만드는 태그는? (< > 제외하고 태그명만)',
        answer: 'a',
        keywords: ['a', 'anchor'],
        explanation: '<a> (anchor) 태그를 사용하여 하이퍼링크를 만듭니다.'
    },
    {
        id: 50,
        type: 'short',
        question: 'CSS Box Model에서 콘텐츠와 테두리 사이의 여백을 나타내는 속성은?',
        answer: 'padding',
        keywords: ['padding'],
        explanation: 'padding은 콘텐츠와 테두리(border) 사이의 내부 여백을 설정합니다.'
    }
];