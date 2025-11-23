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

function displayQuestion(index) {
    const question = questions[index];
    const container = document.getElementById('questionContainer');
    
    let html = `
        <div class="question-header">
            <span class="question-number">문제 ${index + 1}</span>
            <span class="question-type">${question.type === 'multiple' ? '객관식' : '단답식'}</span>
        </div>
        <div class="question-text">${question.question}</div>
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
                    <label for="opt${i}">${option}</label>
                </div>
            `;
        });
        html += '</div>';
    } else {
        const savedAnswer = examAnswers[question.id] || '';
        html += `
            <textarea class="short-answer-input" 
                      id="shortAnswer" 
                      placeholder="답을 입력하세요...">${savedAnswer}</textarea>
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
                autoSave();
            });
        });
    } else {
        // 단답식 답안 저장
        const textarea = document.getElementById('shortAnswer');
        textarea.addEventListener('input', function() {
            examAnswers[question.id] = this.value;
            updateNavigation();
            autoSave();
        });
    }
    
    // 버튼 상태 업데이트
    document.getElementById('prevBtn').disabled = index === 0;
    document.getElementById('nextBtn').style.display = index === questions.length - 1 ? 'none' : 'inline-block';
    document.getElementById('submitBtn').style.display = index === questions.length - 1 ? 'inline-block' : 'none';
    
    // 현재 문제 하이라이트
    updateNavigation();
}

function updateNavigation() {
    const allNavBtns = document.querySelectorAll('.nav-btn');
    
    allNavBtns.forEach((btn, i) => {
        btn.classList.remove('current', 'answered');
        
        if (i === currentQuestion) {
            btn.classList.add('current');
        } else if (examAnswers[questions[i].id] !== undefined && examAnswers[questions[i].id] !== '') {
            btn.classList.add('answered');
        }
    });
    
    // 진행률 업데이트
    const answeredCount = Object.keys(examAnswers).filter(key => 
        examAnswers[key] !== undefined && examAnswers[key] !== ''
    ).length;
    document.getElementById('progressText').textContent = `${answeredCount}/50`;
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

// 애니메이션 스타일 추가
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
    }
`;
document.head.appendChild(style);