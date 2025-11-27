// 시험 페이지 JavaScript
let currentQuestion = 0;
let examAnswers = {};
let examTimer;
let timeLeft = 3600; // 60분 = 3600초

document.addEventListener('DOMContentLoaded', function() {
    // 사용자 정보 확인
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
        alert('사용자 정보가 없습니다. 메인 페이지로 이동합니다.');
        window.location.href = 'index.html';
        return;
    }
    
    const user = JSON.parse(userInfo);
    document.getElementById('examUserName').textContent = `응시자: ${user.name}`;
    
    // 이전 답안 로드
    loadSavedAnswers();
    
    // 문제 네비게이션 생성
    createNavigation();
    
    // 첫 문제 표시
    displayQuestion(currentQuestion);
    
    // 타이머 시작
    startTimer();
    
    // 이벤트 리스너
    document.getElementById('prevBtn').addEventListener('click', previousQuestion);
    document.getElementById('nextBtn').addEventListener('click', nextQuestion);
    document.getElementById('submitBtn').addEventListener('click', showSubmitModal);
    document.getElementById('confirmSubmit').addEventListener('click', submitExam);
    document.getElementById('cancelSubmit').addEventListener('click', hideSubmitModal);
    document.getElementById('timeoutOk').addEventListener('click', function() {
        submitExam(true);
    });
    
    // 학습 가이드 토글 이벤트
    document.getElementById('toggleGuide').addEventListener('click', toggleGuide);
    
    // 자동 저장 (10초마다)
    setInterval(saveAnswers, 10000);
    
    // 페이지 떠날 때 경고
    window.addEventListener('beforeunload', function(e) {
        if (!localStorage.getItem('examSubmitted')) {
            e.preventDefault();
            e.returnValue = '시험이 진행 중입니다. 페이지를 떠나시겠습니까?';
        }
    });
    
    // 복사 방지
    document.addEventListener('copy', function(e) {
        e.preventDefault();
        alert('복사가 금지되어 있습니다.');
        return false;
    });
    
    document.addEventListener('paste', function(e) {
        e.preventDefault();
        alert('붙여넣기가 금지되어 있습니다.');
        return false;
    });
});

function createNavigation() {
    const multipleNav = document.getElementById('multipleChoiceNav');
    const shortNav = document.getElementById('shortAnswerNav');
    
    // 객관식 네비게이션 (1-40)
    for (let i = 0; i < 40; i++) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.textContent = i + 1;
        btn.onclick = () => goToQuestion(i);
        multipleNav.appendChild(btn);
    }
    
    // 단답식 네비게이션 (41-50)
    for (let i = 40; i < 50; i++) {
        const btn = document.createElement('button');
        btn.className = 'nav-btn';
        btn.textContent = i + 1;
        btn.onclick = () => goToQuestion(i);
        shortNav.appendChild(btn);
    }
}

// HTML 엔티티 변환 함수
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function displayQuestion(index) {
    const question = questions[index];
    const container = document.getElementById('questionContainer');
    
    let html = `
        <div class="question-header">
            <span class="question-number">문제 ${index + 1}</span>
            <span class="question-type">${question.type === 'multiple' ? '객관식' : '단답식'}</span>
        </div>
        <div class="question-text">${escapeHtml(question.question)}</div>
    `;
    
    if (question.type === 'multiple') {
        html += '<div class="options">';
        question.options.forEach((option, i) => {
            const isChecked = examAnswers[question.id] === i;
            html += `
                <div class="option ${isChecked ? 'selected' : ''}">
                    <input type="radio" 
                           name="q${question.id}" 
                           id="opt${i}" 
                           value="${i}"
                           ${isChecked ? 'checked' : ''}>
                    <label for="opt${i}">${escapeHtml(option)}</label>
                </div>
            `;
        });
        html += '</div>';
    } else {
        const savedAnswer = examAnswers[question.id] || '';
        html += `
            <textarea class="short-answer-input" 
                      id="shortAnswer" 
                      placeholder="답을 입력하세요...">${escapeHtml(savedAnswer)}</textarea>
        `;
    }
    
    container.innerHTML = html;
    
    // 옵션 클릭 이벤트 (객관식)
    if (question.type === 'multiple') {
        const options = container.querySelectorAll('.option');
        options.forEach((option, i) => {
            option.addEventListener('click', function() {
                const radio = this.querySelector('input[type="radio"]');
                radio.checked = true;
                options.forEach(opt => opt.classList.remove('selected'));
                this.classList.add('selected');
                examAnswers[question.id] = i;
                updateNavigation();
                updateScoreTracker();
                autoSave();
            });
        });
    } else {
        // 단답식 답안 저장
        const textarea = document.getElementById('shortAnswer');
        textarea.addEventListener('input', function() {
            examAnswers[question.id] = this.value;
            updateNavigation();
            updateScoreTracker();
            autoSave();
        });
    }
    
    // 버튼 상태 업데이트
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index === questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = index === questions.length - 1 ? 'inline-block' : 'none';
    
    // 현재 문제 하이라이트
    updateNavigation();
    
    // 학습 가이드 업데이트
    updateReferenceGuide();
    
    // 점수 트래커 업데이트
    updateScoreTracker();
}

function updateNavigation() {
    const allNavBtns = document.querySelectorAll('.nav-btn');
    let answeredCount = 0;
    let correctCount = 0;
    
    allNavBtns.forEach((btn, i) => {
        btn.classList.remove('current', 'answered', 'correct', 'incorrect');
        
        const question = questions[i];
        const userAnswer = examAnswers[question.id];
        
        if (i === currentQuestion) {
            btn.classList.add('current');
        }
        
        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
            answeredCount++;
            btn.classList.add('answered');
            
            // 정답 여부 확인하여 색상 표시
            let isCorrect = false;
            
            if (question.type === 'multiple') {
                isCorrect = (userAnswer === question.answer);
            } else {
                const normalizedUser = userAnswer.toString().trim().toLowerCase();
                const normalizedCorrect = question.answer.toString().trim().toLowerCase();
                
                if (normalizedUser === normalizedCorrect) {
                    isCorrect = true;
                } else if (question.keywords && question.keywords.length > 0) {
                    isCorrect = question.keywords.some(keyword => 
                        normalizedUser === keyword.toLowerCase()
                    );
                }
            }
            
            if (isCorrect) {
                btn.classList.add('correct');
                correctCount++;
            } else {
                btn.classList.add('incorrect');
            }
        }
    });
    
    // 진행률 업데이트
    document.getElementById('progressText').textContent = `${correctCount}/${answeredCount}/50`;
}

function goToQuestion(index) {
    currentQuestion = index;
    displayQuestion(currentQuestion);
}

function previousQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        displayQuestion(currentQuestion);
    }
}

function nextQuestion() {
    if (currentQuestion < questions.length - 1) {
        currentQuestion++;
        displayQuestion(currentQuestion);
    }
}

function startTimer() {
    updateTimerDisplay();
    
    examTimer = setInterval(function() {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(examTimer);
            document.getElementById('timeoutModal').classList.add('show');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer').textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // 10분 이하일 때 빨간색 강조
    if (timeLeft <= 600) {
        document.getElementById('timer').style.color = '#dc2626';
        document.getElementById('timer').style.animation = 'pulse 1s infinite';
    }
}

function saveAnswers() {
    // 보안 저장소 사용
    SecureStorage.setItem('examAnswers', examAnswers);
    SecureStorage.setItem('timeLeft', timeLeft);
    // 일반 localStorage에도 백업 (호환성)
    localStorage.setItem('examAnswers', JSON.stringify(examAnswers));
    localStorage.setItem('timeLeft', timeLeft.toString());
}

function loadSavedAnswers() {
    const saved = localStorage.getItem('examAnswers');
    const savedTime = localStorage.getItem('timeLeft');
    
    if (saved) {
        examAnswers = JSON.parse(saved);
    }
    
    if (savedTime) {
        timeLeft = parseInt(savedTime);
    }
}

function autoSave() {
    saveAnswers();
    showSaveIndicator();
}

function showSaveIndicator() {
    const indicator = document.getElementById('saveIndicator');
    indicator.classList.add('show');
    setTimeout(() => {
        indicator.classList.remove('show');
    }, 2000);
}

function showSubmitModal() {
    const answeredCount = Object.keys(examAnswers).filter(key => 
        examAnswers[key] !== undefined && examAnswers[key] !== ''
    ).length;
    const unansweredCount = 50 - answeredCount;
    
    document.getElementById('answeredCount').textContent = answeredCount;
    document.getElementById('unansweredCount').textContent = unansweredCount;
    document.getElementById('submitModal').classList.add('show');
}

function hideSubmitModal() {
    document.getElementById('submitModal').classList.remove('show');
}

function submitExam(isTimeout = false) {
    clearInterval(examTimer);
    
    // 제출 시간 기록
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    const endTime = new Date().toISOString();
    
    // 시험 데이터 저장
    const examData = {
        userInfo: userInfo,
        answers: examAnswers,
        startTime: userInfo.startTime,
        endTime: endTime,
        timeSpent: 3600 - timeLeft,
        isTimeout: isTimeout
    };
    
    localStorage.setItem('examData', JSON.stringify(examData));
    localStorage.setItem('examSubmitted', 'true');
    
    // 결과 페이지로 이동
    window.location.href = 'result.html';
}

// 학습 가이드 관련 함수들
function updateReferenceGuide() {
    const question = questions[currentQuestion];
    const referenceContent = document.getElementById('referenceContent');
    
    if (question && question.guide) {
        const guideContent = `
            <div class="guide-content">
                <h4>${question.guide.title}</h4>
                ${question.guide.content}
            </div>
        `;
        referenceContent.innerHTML = guideContent;
    } else {
        // 기본 가이드 내용 - 문제 유형별 맞춤 가이드
        const basicGuide = generateBasicGuide(question);
        referenceContent.innerHTML = `
            <div class="guide-content">
                <h4>${basicGuide.title}</h4>
                ${basicGuide.content}
            </div>
        `;
    }
}

function generateBasicGuide(question) {
    const questionText = question.question.toLowerCase();
    
    // HTML 관련 문제
    if (questionText.includes('html') || questionText.includes('태그') || questionText.includes('element')) {
        return {
            title: 'HTML 기초 가이드',
            content: `
                <h5>📖 HTML 핵심 개념</h5>
                <ul>
                    <li><strong>시맨틱 HTML</strong>: 의미를 가진 태그 사용</li>
                    <li><strong>구조와 내용 분리</strong>: HTML은 구조만 담당</li>
                    <li><strong>접근성</strong>: 모든 사용자가 이용할 수 있도록</li>
                </ul>
                <div class="code-example">
                    <h5>💡 기본 HTML 구조</h5>
                    <pre><code>&lt;!DOCTYPE html&gt;
&lt;html lang="ko"&gt;
&lt;head&gt;
    &lt;meta charset="UTF-8"&gt;
    &lt;title&gt;페이지 제목&lt;/title&gt;
&lt;/head&gt;
&lt;body&gt;
    &lt;h1&gt;제목&lt;/h1&gt;
    &lt;p&gt;내용&lt;/p&gt;
&lt;/body&gt;
&lt;/html&gt;</code></pre>
                </div>
            `
        };
    }
    
    // CSS 관련 문제
    if (questionText.includes('css') || questionText.includes('스타일') || questionText.includes('선택자')) {
        return {
            title: 'CSS 기초 가이드',
            content: `
                <h5>🎨 CSS 핵심 개념</h5>
                <ul>
                    <li><strong>선택자</strong>: HTML 요소를 선택하는 방법</li>
                    <li><strong>박스 모델</strong>: margin, border, padding, content</li>
                    <li><strong>레이아웃</strong>: Flexbox, Grid 활용</li>
                </ul>
                <div class="code-example">
                    <h5>💡 기본 CSS 문법</h5>
                    <pre><code>선택자 {
    속성: 값;
    속성: 값;
}

/* 예시 */
.container {
    display: flex;
    justify-content: center;
}</code></pre>
                </div>
            `
        };
    }
    
    // JavaScript 관련 문제
    if (questionText.includes('javascript') || questionText.includes('js') || questionText.includes('변수') || questionText.includes('함수')) {
        return {
            title: 'JavaScript 기초 가이드',
            content: `
                <h5>⚡ JavaScript 핵심 개념</h5>
                <ul>
                    <li><strong>변수 선언</strong>: const, let, var</li>
                    <li><strong>함수</strong>: 재사용 가능한 코드 블록</li>
                    <li><strong>DOM 조작</strong>: 웹 페이지 동적 변경</li>
                </ul>
                <div class="code-example">
                    <h5>💡 기본 JavaScript 문법</h5>
                    <pre><code>// 변수 선언
const name = 'JavaScript';

// 함수 선언
function greet() {
    console.log('Hello!');
}

// DOM 조작
document.getElementById('myElement');</code></pre>
                </div>
            `
        };
    }
    
    // 기본 가이드
    return {
        title: '웹 개발 기초 가이드',
        content: `
            <h5>🌐 웹 개발 핵심 요소</h5>
            <ul>
                <li><strong>HTML</strong>: 웹 페이지의 구조와 내용</li>
                <li><strong>CSS</strong>: 스타일과 레이아웃</li>
                <li><strong>JavaScript</strong>: 동적 기능과 상호작용</li>
            </ul>
            <p><strong>💡 팁:</strong> 문제를 차근차근 읽고 핵심 키워드를 찾아보세요.</p>
            <p>결과 페이지에서 상세한 해설을 확인할 수 있습니다!</p>
        `
    };
}

function toggleGuide() {
    const guide = document.querySelector('.reference-guide');
    const toggleBtn = document.getElementById('toggleGuide');
    
    if (guide.classList.contains('collapsed')) {
        guide.classList.remove('collapsed');
        toggleBtn.textContent = '📖 가이드 닫기';
        toggleBtn.classList.remove('collapsed');
    } else {
        guide.classList.add('collapsed');
        toggleBtn.textContent = '📖 가이드 열기';
        toggleBtn.classList.add('collapsed');
    }
}

// 실시간 점수 업데이트 함수 - 정답만 점수에 반영
function updateScoreTracker() {
    let correctCount = 0;
    let answeredCount = 0;
    
    // 각 답변이 정답인지 확인
    questions.forEach(question => {
        const userAnswer = examAnswers[question.id];
        
        if (userAnswer !== undefined && userAnswer !== null && userAnswer !== '') {
            answeredCount++;
            
            if (question.type === 'multiple') {
                // 객관식: 정답 확인
                if (userAnswer === question.answer) {
                    correctCount++;
                }
            } else {
                // 단답식: 기본적인 정답 확인
                const normalizedUser = userAnswer.toString().trim().toLowerCase();
                const normalizedCorrect = question.answer.toString().trim().toLowerCase();
                
                if (normalizedUser === normalizedCorrect) {
                    correctCount++;
                } else if (question.keywords && question.keywords.length > 0) {
                    // 키워드 방식 체크
                    const isCorrect = question.keywords.some(keyword => 
                        normalizedUser === keyword.toLowerCase()
                    );
                    if (isCorrect) {
                        correctCount++;
                    }
                }
            }
        }
    });
    
    const currentScore = correctCount * 2; // 정답만 점수에 반영
    const progressPercentage = (currentScore / 100) * 100;
    
    // 점수 표시 업데이트
    document.getElementById('currentScore').textContent = currentScore;
    document.getElementById('answeredCount').textContent = `${correctCount}/${answeredCount}`;
    
    // 프로그레스 바 업데이트
    const scoreBar = document.getElementById('scoreBar');
    scoreBar.style.width = `${progressPercentage}%`;
    
    // 점수에 따른 색상 변경
    const scoreDisplay = document.querySelector('.current-score');
    if (currentScore >= 90) {
        scoreDisplay.style.color = '#10b981'; // 초록색
    } else if (currentScore >= 70) {
        scoreDisplay.style.color = '#0ea5e9'; // 파란색
    } else if (currentScore >= 50) {
        scoreDisplay.style.color = '#f59e0b'; // 주황색
    } else {
        scoreDisplay.style.color = '#ef4444'; // 빨간색
    }
}

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);