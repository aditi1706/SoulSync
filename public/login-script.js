document.addEventListener('DOMContentLoaded', () => {
    const screens = {
        login: document.getElementById('login-screen'),
        signup: document.getElementById('signup-screen'),
        info: document.getElementById('info-screen'),
        questionnaire: document.getElementById('questionnaire-screen'),
        welcome: document.getElementById('welcome-screen'),
    };

    const forms = {
        login: document.getElementById('login-form'),
        signup: document.getElementById('signup-form'),
        info: document.getElementById('info-form'),
    };

    const links = {
        showSignup: document.getElementById('show-signup'),
        showLogin: document.getElementById('show-login'),
    };

    const dashboardButton = document.getElementById('go-to-dashboard');

    let currentScreen = 'login';
    
    const showScreen = (screenName) => {
        Object.values(screens).forEach(screen => screen.classList.add('hidden'));
        screens[screenName].classList.remove('hidden');
        currentScreen = screenName;
    };

    // --- Navigation ---
    links.showSignup.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('signup');
    });

    links.showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        showScreen('login');
    });

    // --- Form Submissions ---
    forms.signup.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you would add sign-up logic here (e.g., API call)
        console.log('Signing up...');
        showScreen('info');
    });

    forms.info.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you would save this info
        console.log('Saving user info...');
        startQuestionnaire();
        showScreen('questionnaire');
    });
    
    forms.login.addEventListener('submit', (e) => {
        e.preventDefault();
        // In a real app, you would validate credentials here
        console.log('Logging in...');
        // On successful login, redirect to the dashboard
        window.location.href = '/dashboard.html';
    });
    
    // --- Dashboard Redirect ---
    dashboardButton.addEventListener('click', () => {
        window.location.href = '/dashboard.html';
    });


    // --- Questionnaire Logic ---
    const questions = [
        {
            text: 'Over the last week, how often have you felt overwhelmed by your academic workload?',
            options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
        },
        {
            text: 'On a scale of 1 to 5, how would you rate your current stress level?',
            options: ['1 (Low)', '2', '3', '4', '5 (High)']
        },
        {
            text: 'How often have you felt down, depressed, or hopeless recently?',
            options: ['Never', 'Rarely', 'Sometimes', 'Often', 'Always']
        },
        {
            text: 'How would you describe your quality of sleep lately?',
            options: ['Excellent', 'Good', 'Average', 'Poor', 'Very Poor']
        },
        {
            text: 'How confident do you feel in managing your academic and personal life?',
            options: ['Very Confident', 'Confident', 'Neutral', 'Not Confident', 'Not at All']
        }
    ];

    let currentQuestionIndex = 0;
    const userAnswers = [];
    const questionContainer = document.getElementById('question-container');
    const progressBar = document.getElementById('questionnaire-progress');

    function startQuestionnaire() {
        currentQuestionIndex = 0;
        renderQuestion();
    }

    function renderQuestion() {
        const question = questions[currentQuestionIndex];
        questionContainer.innerHTML = `
            <h2 class="text-xl font-semibold text-white text-center mb-8">${question.text}</h2>
            <div class="space-y-4" id="options-container">
                ${question.options.map((opt, index) => `
                    <button data-value="${opt}" class="option-btn w-full text-left p-4 rounded-lg">
                        ${opt}
                    </button>
                `).join('')}
            </div>
        `;
        
        const progressPercentage = 50 + ((currentQuestionIndex + 1) / questions.length) * 50;
        progressBar.style.width = `${progressPercentage}%`;

        document.querySelectorAll('.option-btn').forEach(btn => {
            btn.addEventListener('click', handleOptionSelect);
        });
    }

    function handleOptionSelect(e) {
        const selectedValue = e.target.dataset.value;
        userAnswers[currentQuestionIndex] = selectedValue;
        
        document.querySelectorAll('.option-btn').forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');

        setTimeout(() => {
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                renderQuestion();
            } else {
                console.log('Questionnaire finished. Answers:', userAnswers);
                showScreen('welcome');
            }
        }, 400);
    }

    // --- Initial State ---
    showScreen('login');
});

