document.addEventListener('DOMContentLoaded', () => {
    // --- Global DOM Elements ---
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a');
    const pages = document.querySelectorAll('.page');
    const startChatBtn = document.getElementById('start-chat-btn');

    // --- Navbar Scroll Effect ---
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- Page Navigation Logic ---
    function showPage(pageId) {
        pages.forEach(page => page.classList.remove('active'));
        const pageToShow = document.getElementById(pageId + '-page');
        if (pageToShow) pageToShow.classList.add('active');
        
        navLinks.forEach(link => {
            link.classList.remove('active-link');
            if (link.getAttribute('data-page') === pageId) {
                link.classList.add('active-link');
            }
        });

        // Conditionally run functions when a specific page is shown
        if (pageId === 'rewards') renderRewards();
        if (pageId === 'dashboard') initializeDashboard();
        if (pageId === 'quotes') showNewQuote();
        if (pageId === 'chat') initializeChat(); // Initialize the chat
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = link.getAttribute('data-page');
            showPage(pageId);
        });
    });
    if(startChatBtn) startChatBtn.addEventListener('click', () => showPage('chat'));

    // --- Chat Logic ---
    const chatWindow = document.getElementById('chat-window');
    const chatForm = document.getElementById('chat-input-form');
    const chatInput = document.getElementById('chat-input');

    function initializeChat() {
        // Only add the initial message if the chat window is empty
        if (chatWindow && chatWindow.children.length === 0) {
            const initialMessage = "Hello! I'm SoulSync, your personal wellness companion. I'm here to listen without judgment. To start, could you tell me how you're feeling today?";
            appendMessage(initialMessage, 'bot');
        }
    }

    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const userMessage = chatInput.value.trim().toLowerCase();
            if (userMessage) {
                appendMessage(userMessage, 'user');
                chatInput.value = '';

                // --- Keyword Definitions ---
                const greetingKeywords = ['hello', 'hi', 'hey', 'good morning', 'good afternoon'];
                const studentStressKeywords = ['exam', 'study', 'studies', 'assignment', 'pressure', 'procrastination', 'overwhelmed', 'burnout'];
                const sadKeywords = ['sad', 'upset', 'not good', 'feeling down', 'anxious', 'bad day', 'feeling low', 'terrible'];
                
                const isGreeting = greetingKeywords.some(keyword => userMessage.includes(keyword));
                const isStudentStressed = studentStressKeywords.some(keyword => userMessage.includes(keyword));
                const isSad = sadKeywords.some(keyword => userMessage.includes(keyword));
                
                if (isGreeting) {
                    const botGreetings = ["Hello there! How can I help you today?", "Hi! It's great to see you. What's on your mind?"];
                    const reply = botGreetings[Math.floor(Math.random() * botGreetings.length)];
                    setTimeout(() => appendMessage(reply, 'bot'), 1000);

                } else if (isStudentStressed) {
                    const studentSolutions = [
                        "It sounds like you're dealing with academic pressure. It's normal to feel this way. Have you tried the 'Pomodoro Technique'? Work for 25 minutes, then take a 5-minute break. It can make studying less overwhelming.",
                        "Feeling overwhelmed by studies is common. Remember to take it one step at a time. Try breaking down a large assignment into smaller, manageable tasks. Ticking off small wins can make a big difference.",
                        "I hear that you're stressed. A helpful technique is 'box breathing': Inhale for 4 seconds, hold for 4, exhale for 4, and hold for 4. Doing this for a minute can calm your nervous system.",
                        "Procrastination often stems from anxiety about the task. Try the '5-Minute Rule': just start for five minutes. Often, getting started is the hardest part. You've got this."
                    ];
                    const reply = studentSolutions[Math.floor(Math.random() * studentSolutions.length)];
                    setTimeout(() => appendMessage(reply, 'bot'), 1200);

                } else if (isSad) {
                    const sympatheticReplies = [
                        "I'm sorry to hear that. It's okay to not be okay. I'm here to listen if you want to talk about it.",
                        "That sounds really tough. Remember to be kind to yourself. Your feelings are valid.",
                        "It takes courage to share that. Thank you for trusting me. I'm here for you."
                    ];
                    const reply = sympatheticReplies[Math.floor(Math.random() * sympatheticReplies.length)];
                    setTimeout(() => appendMessage(reply, 'bot'), 1000);

                } else {
                    // Generic listener responses
                    const botReplies = ["I'm listening.", "Tell me more.", "I understand. What happened next?", "Thanks for sharing. How do you feel about that?"];
                    const reply = botReplies[Math.floor(Math.random() * botReplies.length)];
                    setTimeout(() => appendMessage(reply, 'bot'), 1000);
                }
            }
        });
    }

    function appendMessage(message, sender) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', `${sender}-message`);
        messageElement.innerHTML = `<p>${message}</p>`;
        if(chatWindow) {
            chatWindow.appendChild(messageElement);
            chatWindow.scrollTop = chatWindow.scrollHeight;
        }
    }
    
    // --- Progress, Rewards & Goals Logic ---
    const streakNumber = document.getElementById('streak-number');
    let progress = JSON.parse(localStorage.getItem('wellnessProgress')) || { streak: 0, lastVisit: null };
    const goalForm = document.getElementById('goal-form');
    const goalInput = document.getElementById('goal-input');
    const goalsList = document.getElementById('goals-list');
    let goals = JSON.parse(localStorage.getItem('wellnessGoals')) || [];

    function saveProgress() {
        localStorage.setItem('wellnessProgress', JSON.stringify(progress));
    }

    function updateStreakDisplay() {
        if (streakNumber) {
            streakNumber.textContent = `${progress.streak} Day Streak`;
        }
    }

    function handleStreakUpdate() {
        const today = new Date();
        const todayString = today.toDateString();
        const lastVisit = progress.lastVisit ? new Date(progress.lastVisit) : null;
        
        if (lastVisit) {
            const lastVisitString = lastVisit.toDateString();
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayString = yesterday.toDateString();

            if (lastVisitString === yesterdayString) {
                progress.streak++;
            } else if (lastVisitString !== todayString) {
                progress.streak = 1;
            }
        } else {
            progress.streak = 1;
        }

        progress.lastVisit = today.toISOString();
        saveProgress();
        updateStreakDisplay();
    }

    function checkStreakOnLoad() {
        const today = new Date();
        const lastVisit = progress.lastVisit ? new Date(progress.lastVisit) : null;

        if (lastVisit) {
            const yesterday = new Date();
            yesterday.setDate(today.getDate() - 2);

            if (lastVisit <= yesterday) {
                progress.streak = 0;
            }
        }
        saveProgress();
        updateStreakDisplay();
    }

    function renderRewards() {
        const badge1 = document.getElementById('badge-day1');
        const badge3 = document.getElementById('badge-day3');
        const badge7 = document.getElementById('badge-day7');

        if (progress.streak >= 1 && badge1) badge1.classList.remove('locked');
        if (progress.streak >= 3 && badge3) badge3.classList.remove('locked');
        if (progress.streak >= 7 && badge7) badge7.classList.remove('locked');
    }

    function saveGoals() {
        localStorage.setItem('wellnessGoals', JSON.stringify(goals));
    }

    function renderGoals() {
        if (!goalsList) return;
        goalsList.innerHTML = goals.length === 0 
            ? `<div class="empty-goals-message"><p>No goals yet. Add one to start!</p></div>`
            : goals.map((goal, index) => `
                <li class="goal-item ${goal.completed ? 'completed' : ''}">
                    <label>
                        <input type="checkbox" data-index="${index}" ${goal.completed ? 'checked' : ''}>
                        <span class="custom-checkbox"><span class="checkmark"></span></span>
                        <span class="goal-text">${goal.text}</span>
                    </label>
                    <button class="delete-btn" data-index="${index}">&times;</button>
                </li>
            `).join('');
    }

    if (goalForm) {
        goalForm.addEventListener('submit', e => {
            e.preventDefault();
            const text = goalInput.value.trim();
            if (text) {
                goals.push({ text, completed: false });
                goalInput.value = '';
                saveGoals();
                renderGoals();
            }
        });

        goalsList.addEventListener('click', e => {
            const target = e.target;
            const index = target.dataset.index;

            if (target.matches('input[type="checkbox"]')) {
                goals[index].completed = !goals[index].completed;
                
                if (goals[index].completed) {
                    handleStreakUpdate();
                    fetch('/api/goals/complete', { method: 'POST' })
                        .then(res => res.json())
                        .then(data => console.log('Server updated:', data))
                        .catch(err => console.error("Failed to update server:", err));
                }
                
                saveGoals();
                renderGoals();
            }

            if (target.matches('.delete-btn')) {
                goals.splice(index, 1);
                saveGoals();
                renderGoals();
            }
        });
        
        renderGoals();
    }

    // --- Quotes Logic ---
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    const newQuoteBtn = document.getElementById('new-quote-btn');

    async function showNewQuote() {
        if (!quoteText || !quoteAuthor) return;
        try {
            const response = await fetch('/api/quote');
            const data = await response.json();
            quoteText.textContent = data.text;
            quoteAuthor.textContent = data.author;
        } catch (error) {
            quoteText.textContent = "Could not fetch a new quote.";
            quoteAuthor.textContent = "";
        }
    }

    if (newQuoteBtn) {
        newQuoteBtn.addEventListener('click', showNewQuote);
    }
    
    // --- Dashboard & Charts Logic ---
    let charts = {};
    async function initializeDashboard() {
        let wellnessStats = { goalsCompleted: 0 };
        
        try {
            const response = await fetch('/api/dashboard-stats');
            wellnessStats = await response.json();
        } catch (error) {
            console.error("Could not fetch dashboard stats:", error);
        }
        
        const moodCardText = document.querySelector('.card-mood p');
        if (moodCardText) {
            moodCardText.innerHTML = `You've completed <strong>${wellnessStats.goalsCompleted} goals</strong> today!`;
        }

        const sleepData = [4, 5, 7, 6, 5, 6, 8];
        const activityData = [40, 25, 35];
        let trendsData = [3, 5, 4, 6, 7, 4, 5]; 
        const dayOfWeek = new Date().getDay();
        trendsData[dayOfWeek] = wellnessStats.goalsCompleted;

        Chart.defaults.color = '#94a3b8';
        Chart.defaults.font.family = "'Manrope', sans-serif";

        const trendsCtx = document.getElementById('trendsChart');
        if (trendsCtx) {
            if (charts.trends) {
                charts.trends.data.datasets[0].data = trendsData;
                charts.trends.update();
            } else {
                charts.trends = new Chart(trendsCtx, { type: 'bar', data: { labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], datasets: [{ label: 'Goals Completed', data: trendsData, backgroundColor: 'rgba(59, 130, 246, 0.5)', borderRadius: 5 }] }, options: { maintainAspectRatio: false } });
            }
        }

        const sleepCtx = document.getElementById('sleepChart');
        if (sleepCtx && !charts.sleep) {
            charts.sleep = new Chart(sleepCtx, { type: 'line', data: { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], datasets: [{ label: 'Hours Slept', data: sleepData, borderColor: '#3b82f6', backgroundColor: 'rgba(59, 130, 246, 0.1)', fill: true, tension: 0.4 }] }, options: { maintainAspectRatio: false } });
        }

        const activityCtx = document.getElementById('activityChart');
        if (activityCtx && !charts.activity) {
            charts.activity = new Chart(activityCtx, { type: 'doughnut', data: { labels: ['Work', 'Rest', 'Leisure'], datasets: [{ data: activityData, backgroundColor: ['#3b82f6', '#1e40af', '#60a5fa'], borderWidth: 0 }] }, options: { maintainAspectRatio: false, plugins: { legend: { position: 'top', align: 'center', labels: { boxWidth: 12, padding: 20 } } } } });
        }
    }

    // --- Initial Load ---
    checkStreakOnLoad();
    showPage('home');
});