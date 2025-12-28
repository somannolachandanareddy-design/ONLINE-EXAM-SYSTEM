// ExamPro Online Examination System
// Complete application in a single file

// ==================== DATA ====================

const users = {
    students: [
        { username: 'student1', password: 'pass123', name: 'Chandana' },
        { username: 'student2', password: 'pass123', name: 'Jane Smith' },
        { username: 'student3', password: 'pass123', name: 'Mike Johnson' }
    ],
    admins: [
        { username: 'admin', password: 'admin123', name: 'Administrator' }
    ]
};

const exams = [
    {
        id: 1,
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and control structures.',
        duration: 10,
        passingScore: 60,
        questions: [
            {
                id: 1,
                text: 'What is the correct syntax for declaring a variable in JavaScript?',
                options: ['var myVariable;', 'variable myVariable;', 'v myVariable;', 'declare myVariable;'],
                correctAnswer: 0
            },
            {
                id: 2,
                text: 'Which of the following is NOT a JavaScript data type?',
                options: ['String', 'Boolean', 'Float', 'Undefined'],
                correctAnswer: 2
            },
            {
                id: 3,
                text: 'What does the "typeof" operator return?',
                options: ['The value of a variable', 'The type of a variable', 'The name of a variable', 'The memory address'],
                correctAnswer: 1
            },
            {
                id: 4,
                text: 'Which method is used to add an element to the end of an array?',
                options: ['append()', 'push()', 'add()', 'insert()'],
                correctAnswer: 1
            },
            {
                id: 5,
                text: 'What is the result of "2" + 2 in JavaScript?',
                options: ['4', '"22"', '22', 'Error'],
                correctAnswer: 1
            }
        ]
    },
    {
        id: 2,
        title: 'HTML & CSS Basics',
        description: 'Evaluate your understanding of HTML structure and CSS styling fundamentals.',
        duration: 8,
        passingScore: 70,
        questions: [
            {
                id: 1,
                text: 'What does HTML stand for?',
                options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyperlinks and Text Markup Language'],
                correctAnswer: 0
            },
            {
                id: 2,
                text: 'Which CSS property is used to change the text color?',
                options: ['text-color', 'font-color', 'color', 'text-style'],
                correctAnswer: 2
            },
            {
                id: 3,
                text: 'What is the correct HTML for creating a hyperlink?',
                options: ['<a url="http://example.com">Link</a>', '<a href="http://example.com">Link</a>', '<link src="http://example.com">Link</link>', '<hyperlink>http://example.com</hyperlink>'],
                correctAnswer: 1
            },
            {
                id: 4,
                text: 'Which CSS property controls the spacing between elements?',
                options: ['padding', 'margin', 'spacing', 'gap'],
                correctAnswer: 1
            },
            {
                id: 5,
                text: 'What is the purpose of the <head> element in HTML?',
                options: ['To display the main content', 'To contain metadata about the document', 'To create headers', 'To define the footer'],
                correctAnswer: 1
            }
        ]
    },
    {
        id: 3,
        title: 'Web Development Concepts',
        description: 'Test your knowledge of general web development principles and best practices.',
        duration: 12,
        passingScore: 65,
        questions: [
            {
                id: 1,
                text: 'What does API stand for?',
                options: ['Application Programming Interface', 'Advanced Programming Integration', 'Automated Process Integration', 'Application Process Interface'],
                correctAnswer: 0
            },
            {
                id: 2,
                text: 'Which HTTP method is used to retrieve data from a server?',
                options: ['POST', 'PUT', 'GET', 'DELETE'],
                correctAnswer: 2
            },
            {
                id: 3,
                text: 'What is the purpose of responsive web design?',
                options: ['To make websites load faster', 'To make websites work on different screen sizes', 'To add animations', 'To improve SEO'],
                correctAnswer: 1
            },
            {
                id: 4,
                text: 'Which of the following is a front-end framework?',
                options: ['Django', 'Express', 'React', 'Laravel'],
                correctAnswer: 2
            },
            {
                id: 5,
                text: 'What does DOM stand for?',
                options: ['Document Object Model', 'Data Object Management', 'Digital Output Method', 'Document Orientation Model'],
                correctAnswer: 0
            },
            {
                id: 6,
                text: 'Which storage option persists even after closing the browser?',
                options: ['sessionStorage', 'cookies', 'localStorage', 'Both B and C'],
                correctAnswer: 3
            }
        ]
    }
];

// ==================== STATE ====================

let currentUser = null;
let currentRole = null;
let currentExam = null;
let currentQuestionIndex = 0;
let userAnswers = {};
let examStartTime = null;
let timerInterval = null;
let remainingTime = 0;

// ==================== UTILITY FUNCTIONS ====================

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
}

function getAttemptHistory() {
    const history = localStorage.getItem('examHistory');
    if (!history) return [];
    const allHistory = JSON.parse(history);
    return allHistory.filter(h => h.username === currentUser.username);
}

function saveAttempt(attempt) {
    const history = localStorage.getItem('examHistory');
    const allHistory = history ? JSON.parse(history) : [];
    allHistory.push(attempt);
    localStorage.setItem('examHistory', JSON.stringify(allHistory));
}

// ==================== STUDENT DASHBOARD ====================

function showStudentDashboard() {
    showPage('studentDashboard');
    document.getElementById('studentName').textContent = currentUser.name;
    renderExamList();
    renderAttemptHistory();
}

function renderExamList() {
    const examList = document.getElementById('examList');
    examList.innerHTML = '';
    
    exams.forEach(exam => {
        const card = document.createElement('div');
        card.className = 'exam-card';
        card.innerHTML = `
            <div class="exam-card-header">
                <div><h3>${exam.title}</h3></div>
                <span class="exam-badge">${exam.questions.length} Questions</span>
            </div>
            <p>${exam.description}</p>
            <div class="exam-meta">
                <div class="meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" stroke-width="2"/>
                        <polyline points="12 6 12 12 16 14" stroke-width="2"/>
                    </svg>
                    ${exam.duration} minutes
                </div>
                <div class="meta-item">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke-width="2"/>
                    </svg>
                    Pass: ${exam.passingScore}%
                </div>
            </div>
            <button class="btn btn-primary" onclick="startExam(${exam.id})">Start Exam</button>
        `;
        examList.appendChild(card);
    });
}

function renderAttemptHistory() {
    const historyList = document.getElementById('attemptHistory');
    const attempts = getAttemptHistory();
    
    if (attempts.length === 0) {
        historyList.innerHTML = '<div class="empty-state"><h3>No Attempts Yet</h3><p>Start an exam to see your history here</p></div>';
        return;
    }
    
    historyList.innerHTML = '';
    attempts.reverse().forEach(attempt => {
        const item = document.createElement('div');
        item.className = 'history-item';
        const status = attempt.score >= attempt.passingScore ? 'pass' : 'fail';
        const statusText = attempt.score >= attempt.passingScore ? 'PASSED' : 'FAILED';
        
        item.innerHTML = `
            <div class="history-info">
                <h4>${attempt.examTitle}</h4>
                <p>${new Date(attempt.date).toLocaleString()}</p>
            </div>
            <div class="history-stats">
                <div class="history-score">
                    <div class="score-value">${attempt.score}%</div>
                    <div class="score-label">Score</div>
                </div>
                <div class="history-status status-${status}">${statusText}</div>
            </div>
        `;
        historyList.appendChild(item);
    });
}

// ==================== EXAM FUNCTIONS ====================

function startExam(examId) {
    currentExam = exams.find(e => e.id === examId);
    currentQuestionIndex = 0;
    userAnswers = {};
    examStartTime = Date.now();
    remainingTime = currentExam.duration * 60;
    
    showPage('examPage');
    document.getElementById('examTitle').textContent = currentExam.title;
    renderQuestionPalette();
    renderQuestion();
    startTimer();
}

function renderQuestionPalette() {
    const palette = document.getElementById('questionPalette');
    palette.innerHTML = '';
    
    currentExam.questions.forEach((q, index) => {
        const btn = document.createElement('button');
        btn.className = 'palette-btn';
        btn.textContent = index + 1;
        btn.onclick = () => goToQuestion(index);
        
        if (index === currentQuestionIndex) btn.classList.add('active');
        if (userAnswers[index] !== undefined) btn.classList.add('answered');
        
        palette.appendChild(btn);
    });
}

function renderQuestion() {
    const container = document.getElementById('questionContainer');
    const question = currentExam.questions[currentQuestionIndex];
    
    container.innerHTML = `
        <div class="question-header">
            <span class="question-number">Question ${currentQuestionIndex + 1} of ${currentExam.questions.length}</span>
        </div>
        <div class="question-text">${question.text}</div>
        <div class="options-list">
            ${question.options.map((option, index) => `
                <div class="option ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}" onclick="selectOption(${index})">
                    <input type="radio" name="answer" id="option${index}" value="${index}" ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''}>
                    <label for="option${index}">${option}</label>
                </div>
            `).join('')}
        </div>
    `;
    
    document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
    document.getElementById('nextBtn').disabled = currentQuestionIndex === currentExam.questions.length - 1;
    
    renderQuestionPalette();
}

function selectOption(optionIndex) {
    userAnswers[currentQuestionIndex] = optionIndex;
    renderQuestion();
}

function previousQuestion() {
    if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        renderQuestion();
    }
}

function nextQuestion() {
    if (currentQuestionIndex < currentExam.questions.length - 1) {
        currentQuestionIndex++;
        renderQuestion();
    }
}

function goToQuestion(index) {
    currentQuestionIndex = index;
    renderQuestion();
}

function startTimer() {
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        remainingTime--;
        updateTimerDisplay();
        
        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            autoSubmitExam();
        } else if (remainingTime <= 60) {
            document.getElementById('timer').classList.add('warning');
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    document.getElementById('timeDisplay').textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function submitExam() {
    const answeredCount = Object.keys(userAnswers).length;
    const totalQuestions = currentExam.questions.length;
    
    if (answeredCount < totalQuestions) {
        const confirm = window.confirm(`You have answered ${answeredCount} out of ${totalQuestions} questions. Do you want to submit the exam?`);
        if (!confirm) return;
    }
    
    clearInterval(timerInterval);
    calculateResults();
}

function autoSubmitExam() {
    alert('Time is up! Your exam will be submitted automatically.');
    calculateResults();
}

function calculateResults() {
    let correctAnswers = 0;
    const totalQuestions = currentExam.questions.length;
    const timeTaken = currentExam.duration * 60 - remainingTime;
    
    const results = currentExam.questions.map((question, index) => {
        const userAnswer = userAnswers[index];
        const isCorrect = userAnswer !== undefined && userAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        
        return {
            question: question.text,
            userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Not answered',
            correctAnswer: question.options[question.correctAnswer],
            isCorrect: isCorrect
        };
    });
    
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const passed = score >= currentExam.passingScore;
    
    saveAttempt({
        username: currentUser.username,
        examId: currentExam.id,
        examTitle: currentExam.title,
        score: score,
        correctAnswers: correctAnswers,
        totalQuestions: totalQuestions,
        timeTaken: timeTaken,
        passingScore: currentExam.passingScore,
        passed: passed,
        date: new Date().toISOString(),
        results: results
    });
    
    showResults(score, correctAnswers, totalQuestions, timeTaken, passed, results);
}

function showResults(score, correct, total, timeTaken, passed, details) {
    showPage('resultsPage');
    
    const statusBadge = document.getElementById('statusBadge');
    statusBadge.textContent = passed ? 'PASSED' : 'FAILED';
    statusBadge.className = `status-badge ${passed ? 'pass' : 'fail'}`;
    
    document.getElementById('scoreValue').textContent = `${score}%`;
    document.getElementById('correctCount').textContent = correct;
    document.getElementById('wrongCount').textContent = total - correct;
    
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken % 60;
    document.getElementById('timeTaken').textContent = `${minutes}m ${seconds}s`;
    
    const detailsContainer = document.getElementById('resultsDetails');
    detailsContainer.innerHTML = '<h3>Detailed Results</h3>';
    
    details.forEach((detail, index) => {
        const item = document.createElement('div');
        item.className = `result-item ${detail.isCorrect ? 'correct' : 'incorrect'}`;
        item.innerHTML = `
            <div class="result-question">Q${index + 1}: ${detail.question}</div>
            <div class="result-answer"><strong>Your Answer:</strong> ${detail.userAnswer}</div>
            <div class="result-answer"><strong>Correct Answer:</strong> ${detail.correctAnswer}</div>
        `;
        detailsContainer.appendChild(item);
    });
    
    window.scrollTo(0, 0);
}

function goToDashboard() {
    if (currentRole === 'student') {
        showStudentDashboard();
    } else {
        showAdminDashboard();
    }
}

// ==================== ADMIN DASHBOARD ====================

function showAdminDashboard() {
    showPage('adminDashboard');
    calculateAnalytics();
}

function calculateAnalytics() {
    const history = localStorage.getItem('examHistory');
    const allAttempts = history ? JSON.parse(history) : [];
    
    document.getElementById('totalAttempts').textContent = allAttempts.length;
    
    if (allAttempts.length > 0) {
        const avgScore = allAttempts.reduce((sum, a) => sum + a.score, 0) / allAttempts.length;
        document.getElementById('avgScore').textContent = `${Math.round(avgScore)}%`;
        
        const passedCount = allAttempts.filter(a => a.passed).length;
        const passRate = (passedCount / allAttempts.length) * 100;
        document.getElementById('passRate').textContent = `${Math.round(passRate)}%`;
    } else {
        document.getElementById('avgScore').textContent = '0%';
        document.getElementById('passRate').textContent = '0%';
    }
    
    const uniqueStudents = new Set(allAttempts.map(a => a.username));
    document.getElementById('activeStudents').textContent = uniqueStudents.size;
    
    renderExamAnalytics(allAttempts);
    renderRecentAttempts(allAttempts);
}

function renderExamAnalytics(allAttempts) {
    const tbody = document.getElementById('examAnalytics');
    tbody.innerHTML = '';
    
    exams.forEach(exam => {
        const examAttempts = allAttempts.filter(a => a.examId === exam.id);
        const row = document.createElement('tr');
        
        if (examAttempts.length === 0) {
            row.innerHTML = `
                <td><strong>${exam.title}</strong></td>
                <td>0</td>
                <td>-</td>
                <td>-</td>
                <td>-</td>
            `;
        } else {
            const avgScore = examAttempts.reduce((sum, a) => sum + a.score, 0) / examAttempts.length;
            const passedCount = examAttempts.filter(a => a.passed).length;
            const passRate = (passedCount / examAttempts.length) * 100;
            const highestScore = Math.max(...examAttempts.map(a => a.score));
            
            row.innerHTML = `
                <td><strong>${exam.title}</strong></td>
                <td>${examAttempts.length}</td>
                <td>${Math.round(avgScore)}%</td>
                <td>${Math.round(passRate)}%</td>
                <td>${highestScore}%</td>
            `;
        }
        tbody.appendChild(row);
    });
}

function renderRecentAttempts(allAttempts) {
    const tbody = document.getElementById('recentAttempts');
    tbody.innerHTML = '';
    
    if (allAttempts.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; color: var(--text-secondary);">No attempts yet</td></tr>';
        return;
    }
    
    const recentAttempts = allAttempts.slice(-10).reverse();
    
    recentAttempts.forEach(attempt => {
        const row = document.createElement('tr');
        const status = attempt.passed ? 'pass' : 'fail';
        const statusText = attempt.passed ? 'PASSED' : 'FAILED';
        
        row.innerHTML = `
            <td><strong>${attempt.username}</strong></td>
            <td>${attempt.examTitle}</td>
            <td><strong>${attempt.score}%</strong></td>
            <td><span class="table-badge badge-${status}">${statusText}</span></td>
            <td>${new Date(attempt.date).toLocaleString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// ==================== AUTHENTICATION ====================

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('examSession');
        if (timerInterval) clearInterval(timerInterval);
        location.reload();
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    console.log('ExamPro Loading...');
    
    // Check for existing session
    const session = localStorage.getItem('examSession');
    if (session) {
        const sessionData = JSON.parse(session);
        currentUser = sessionData.user;
        currentRole = sessionData.role;
        console.log('Session found:', currentUser.name);
        
        if (currentRole === 'student') {
            showStudentDashboard();
        } else if (currentRole === 'admin') {
            showAdminDashboard();
        }
    } else {
        showPage('loginPage');
    }
    
    // Setup login form
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            tabButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const role = document.querySelector('.tab-btn.active').dataset.role;
            
            if (!username || !password) {
                alert('Please enter both username and password!');
                return;
            }
            
            let user = null;
            if (role === 'student') {
                user = users.students.find(u => u.username === username && u.password === password);
            } else {
                user = users.admins.find(u => u.username === username && u.password === password);
            }
            
            if (user) {
                console.log('Login successful:', user.name);
                localStorage.setItem('examSession', JSON.stringify({ user, role, loginTime: new Date().toISOString() }));
                currentUser = user;
                currentRole = role;
                loginForm.reset();
                
                if (role === 'student') {
                    showStudentDashboard();
                } else {
                    showAdminDashboard();
                }
            } else {
                alert('Invalid credentials! Please try again.');
                document.getElementById('password').value = '';
            }
        });
    }
    
    console.log('ExamPro Ready!');
});