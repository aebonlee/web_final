// 결과 페이지 JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // 시험 데이터 로드
    const examData = localStorage.getItem('examData');
    if (!examData) {
        alert('시험 데이터가 없습니다. 메인 페이지로 이동합니다.');
        window.location.href = 'index.html';
        return;
    }
    
    const data = JSON.parse(examData);
    
    // 채점 및 결과 표시
    const results = gradeExam(data.answers);
    displayResults(results, data);
    
    // 이벤트 리스너
    setupEventListeners();
});

function gradeExam(answers) {
    let multipleCorrect = 0;
    let shortCorrect = 0;
    const detailedResults = [];
    
    questions.forEach(question => {
        const userAnswer = answers[question.id];
        let isCorrect = false;
        
        if (question.type === 'multiple') {
            // 객관식 채점 - 실제 정답과 비교
            if (userAnswer !== undefined && userAnswer !== null) {
                isCorrect = (userAnswer === question.answer);
                if (isCorrect) {
                    multipleCorrect++;
                }
            }
        } else {
            // 단답식 채점 - 정답과 비교 (대소문자 구분 없이, 앞뒤 공백 제거)
            if (userAnswer && userAnswer.trim() !== '') {
                isCorrect = validateShortAnswer(userAnswer, question.answer);
                if (isCorrect) {
                    shortCorrect++;
                }
            }
        }
        
        detailedResults.push({
            question: question,
            userAnswer: userAnswer,
            isCorrect: isCorrect
        });
    });
    
    // 점수 계산: 정답 문제당 2점씩 누적 (최대 100점)
    const totalScore = (multipleCorrect + shortCorrect) * 2;
    
    return {
        totalScore: totalScore,
        multipleCorrect: multipleCorrect,
        shortCorrect: shortCorrect,
        detailedResults: detailedResults
    };
}

// 단답형 답안 검증 함수
function validateShortAnswer(userAnswer, correctAnswer) {
    // 기본 처리: 대소문자 구분 없이, 앞뒤 공백 제거
    const normalizedUser = userAnswer.trim().toLowerCase();
    const normalizedCorrect = correctAnswer.trim().toLowerCase();
    
    // 완전 일치 검사
    if (normalizedUser === normalizedCorrect) {
        return true;
    }
    
    // 배열 형태의 정답 (여러 정답이 가능한 경우)
    if (Array.isArray(correctAnswer)) {
        return correctAnswer.some(answer => 
            normalizedUser === answer.trim().toLowerCase()
        );
    }
    
    // 부분 매칭 (핵심 키워드 포함 여부)
    // 예: "let, const" 정답에 "let"만 써도 부분 점수
    const keywords = normalizedCorrect.split(/[,\s]+/).filter(k => k.length > 0);
    const userKeywords = normalizedUser.split(/[,\s]+/).filter(k => k.length > 0);
    
    // 모든 핵심 키워드가 포함되어 있는지 확인
    const matchRate = keywords.filter(keyword => 
        userKeywords.some(userWord => userWord.includes(keyword) || keyword.includes(userWord))
    ).length / keywords.length;
    
    // 70% 이상 일치하면 정답으로 처리
    return matchRate >= 0.7;
}

function displayResults(results, examData) {
    // 날짜 표시 (시스템 현지 시간 사용)
    const examDate = new Date();
    const dateOptions = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false
    };
    document.getElementById('examDate').textContent = 
        `응시일: ${examDate.toLocaleString('ko-KR', dateOptions)}`;
    
    // 사용자 정보
    document.getElementById('resultUserName').textContent = examData.userInfo.name;
    // 학번 표시 (이전 버전 호환성 체크)
    if (examData.userInfo.studentId) {
        document.getElementById('resultUserStudentId').textContent = examData.userInfo.studentId;
    } else if (examData.userInfo.email) {
        // 이전 버전에서는 이메일이 있을 수 있음
        document.getElementById('resultUserStudentId').textContent = examData.userInfo.email;
    }
    
    // 소요 시간
    const minutes = Math.floor(examData.timeSpent / 60);
    const seconds = examData.timeSpent % 60;
    document.getElementById('examDuration').textContent = 
        `${minutes}분 ${seconds}초`;
    
    // 점수 표시
    document.getElementById('totalScore').textContent = results.totalScore;
    
    // 등급 판정 - 실제 점수에 따른 등급 부여
    const gradeElement = document.getElementById('scoreGrade');
    if (results.totalScore === 100) {
        gradeElement.textContent = 'S (완벽)';
        gradeElement.className = 'score-grade perfect';
    } else if (results.totalScore >= 90) {
        gradeElement.textContent = 'A (우수)';
        gradeElement.className = 'score-grade pass';
    } else if (results.totalScore >= 80) {
        gradeElement.textContent = 'B (양호)';
        gradeElement.className = 'score-grade pass';
    } else if (results.totalScore >= 70) {
        gradeElement.textContent = 'C (합격)';
        gradeElement.className = 'score-grade pass';
    } else {
        gradeElement.textContent = 'D (재학습 필요)';
        gradeElement.className = 'score-grade fail';
    }
    
    // 정답률
    const correctRate = Math.round((results.multipleCorrect + results.shortCorrect) / 50 * 100);
    document.getElementById('correctRate').textContent = `${correctRate}%`;
    
    // 영역별 점수
    document.getElementById('multipleScore').textContent = results.multipleCorrect;
    document.getElementById('shortScore').textContent = results.shortCorrect;
    
    // 프로그레스 바
    const multipleBar = document.getElementById('multipleBar');
    const shortBar = document.getElementById('shortBar');
    
    setTimeout(() => {
        multipleBar.style.width = `${(results.multipleCorrect / 40) * 100}%`;
        shortBar.style.width = `${(results.shortCorrect / 10) * 100}%`;
    }, 100);
    
    // 상세 결과 표시
    displayDetailedResults(results.detailedResults);
}

// HTML 엔티티 변환 함수
function escapeHtml(text) {
    if (!text) return text;
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

function displayDetailedResults(detailedResults) {
    const multipleContainer = document.getElementById('multipleResults');
    const shortContainer = document.getElementById('shortResults');
    
    detailedResults.forEach((result, index) => {
        const resultHTML = createResultHTML(result, index);
        
        if (result.question.type === 'multiple') {
            multipleContainer.innerHTML += resultHTML;
        } else {
            shortContainer.innerHTML += resultHTML;
        }
    });
}

function createResultHTML(result, index) {
    const q = result.question;
    const statusClass = result.isCorrect ? 'correct' : 'incorrect';
    const statusText = result.isCorrect ? '정답' : '오답';
    
    let html = `
        <div class="question-result ${statusClass}">
            <div class="result-question-header">
                <span class="question-number">문제 ${index + 1}</span>
                <span class="result-status ${statusClass}">${statusText}</span>
            </div>
            <div class="question-text">${escapeHtml(q.question)}</div>
    `;
    
    if (q.type === 'multiple') {
        // 사용자 답안
        if (result.userAnswer !== undefined) {
            html += `
                <div class="user-answer">
                    <strong>선택한 답:</strong> ${escapeHtml(q.options[result.userAnswer])}
                </div>
            `;
        } else {
            html += `
                <div class="user-answer">
                    <strong>선택한 답:</strong> 미답변
                </div>
            `;
        }
        
        // 정답
        html += `
            <div class="correct-answer">
                <strong>정답:</strong> ${escapeHtml(q.options[q.answer])}
            </div>
        `;
    } else {
        // 단답식
        html += `
            <div class="user-answer">
                <strong>작성한 답:</strong> ${escapeHtml(result.userAnswer) || '미답변'}
            </div>
            <div class="correct-answer">
                <strong>정답:</strong> ${escapeHtml(q.answer)}
            </div>
        `;
    }
    
    // 해설
    html += `
        <div class="explanation">
            <strong>해설:</strong> ${escapeHtml(q.explanation)}
        </div>
    </div>
    `;
    
    return html;
}

function setupEventListeners() {
    // 탭 전환
    const tabBtns = document.querySelectorAll('.tab-btn');
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // 버튼 활성화 상태 변경
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // 콘텐츠 전환
            if (tab === 'multiple') {
                document.getElementById('multipleContent').style.display = 'block';
                document.getElementById('shortContent').style.display = 'none';
            } else {
                document.getElementById('multipleContent').style.display = 'none';
                document.getElementById('shortContent').style.display = 'block';
            }
        });
    });
    
    // 다시 응시하기
    document.getElementById('retakeBtn').addEventListener('click', function() {
        if (confirm('정말로 다시 응시하시겠습니까? 현재 결과는 유지됩니다.')) {
            localStorage.removeItem('examAnswers');
            localStorage.removeItem('examSubmitted');
            localStorage.removeItem('timeLeft');
            window.location.href = 'index.html';
        }
    });
}