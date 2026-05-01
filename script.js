document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('q');

    const generatorView = document.getElementById('generator-view');
    const animationView = document.getElementById('animation-view');

    if (query) {
        // Animation Mode
        animationView.classList.remove('hidden');
        runAnimation(query);
    } else {
        // Generator Mode
        generatorView.classList.remove('hidden');
        setupGenerator();
    }
});

function setupGenerator() {
    const input = document.getElementById('question-input');
    const generateBtn = document.getElementById('generate-btn');
    const resultGroup = document.getElementById('result-group');
    const linkOutput = document.getElementById('link-output');
    const copyBtn = document.getElementById('copy-btn');
    const copyRedditBtn = document.getElementById('copy-reddit-btn');
    const toast = document.getElementById('toast');
    
    // Modal elements
    const adModal = document.getElementById('ad-modal');
    const countdownEl = document.getElementById('countdown');

    generateBtn.addEventListener('click', () => {
        const val = input.value.trim();
        if (!val) return;

        // Construct current URL without query params, then add new one
        const baseUrl = window.location.origin + window.location.pathname;
        const finalUrl = `${baseUrl}?q=${encodeURIComponent(val)}`;
        
        linkOutput.value = finalUrl;
        
        // Show modal instead of instantly showing the link
        adModal.classList.remove('hidden');
        let timeLeft = 8;
        countdownEl.textContent = timeLeft;
        
        const timer = setInterval(() => {
            timeLeft -= 1;
            countdownEl.textContent = timeLeft;
            
            if (timeLeft <= 0) {
                clearInterval(timer);
                adModal.classList.add('hidden');
                resultGroup.classList.remove('hidden');
            }
        }, 1000);
    });

    // Also trigger on enter
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            generateBtn.click();
        }
    });

    copyBtn.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(linkOutput.value);
            showToast(toast);
        } catch (err) {
            // Fallback
            linkOutput.select();
            document.execCommand('copy');
            showToast(toast);
        }
    });

    copyRedditBtn.addEventListener('click', async () => {
        const url = linkOutput.value;
        const markdown = `[Have you tried the search bar?](${url})`;
        try {
            await navigator.clipboard.writeText(markdown);
            showToast(toast);
        } catch (err) {
            // Fallback
            const tempInput = document.createElement('input');
            tempInput.style.position = 'absolute';
            tempInput.style.left = '-9999px';
            tempInput.value = markdown;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            showToast(toast);
        }
    });
}

function showToast(toast) {
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

async function runAnimation(query) {
    const mouse = document.getElementById('mouse-cursor');
    const searchBar = document.getElementById('fake-search-bar');
    const typingText = document.getElementById('typing-text');
    const cursorBlink = document.getElementById('cursor-blink');
    
    // Chrome elements
    const addressBar = document.getElementById('fake-address-bar');
    const addressTyping = document.getElementById('address-typing');
    const addressCursor = document.getElementById('address-cursor');
    const newTabView = document.getElementById('new-tab-view');
    const redditView = document.getElementById('reddit-view');
    const tabTitle = document.getElementById('tab-title');

    // Utility for waiting
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    // Wait for initial "page load" feel
    await wait(1000);

    // --- PHASE 1: Type URL in Chrome Address Bar ---
    const addressRect = addressBar.getBoundingClientRect();
    const addressTargetX = addressRect.left + 50;
    const addressTargetY = addressRect.top + (addressRect.height / 2);

    mouse.style.left = `${addressTargetX}px`;
    mouse.style.top = `${addressTargetY}px`;

    // Wait for mouse movement
    await wait(1200);

    mouse.classList.add('clicking');
    await wait(150);
    mouse.classList.remove('clicking');
    
    // Move mouse out of the way so it doesn't block text
    mouse.style.left = `${addressTargetX + 100}px`;
    mouse.style.top = `${addressTargetY + 100}px`;

    // Focus address bar
    addressBar.classList.add('focus');
    await wait(200);

    const siteUrl = "reddit.com";
    for (let i = 0; i < siteUrl.length; i++) {
        addressTyping.textContent += siteUrl[i];
        const delay = Math.floor(Math.random() * 80) + 40;
        await wait(delay);
    }

    await wait(300);
    // Simulate hitting enter (cursor disappears, loading happens)
    addressCursor.style.display = 'none';
    
    // Switch to Reddit View
    await wait(600);
    newTabView.classList.add('hidden');
    redditView.classList.remove('hidden');
    tabTitle.textContent = "reddit: the front page of the internet";

    // --- PHASE 2: Type in Reddit Search Bar ---
    await wait(800);

    // Calculate position of search bar
    const searchRect = searchBar.getBoundingClientRect();
    
    // We want to click somewhere in the middle-left of the search bar
    const targetX = searchRect.left + 80;
    const targetY = searchRect.top + (searchRect.height / 2);

    // Move mouse
    mouse.style.left = `${targetX}px`;
    mouse.style.top = `${targetY}px`;

    // Wait for mouse movement CSS transition (1s)
    await wait(1200);

    // Simulate click
    mouse.classList.add('clicking');
    await wait(150);
    mouse.classList.remove('clicking');
    
    // Move mouse out of the way so it doesn't block text
    mouse.style.left = `${targetX + 150}px`;
    mouse.style.top = `${targetY + 150}px`;

    // Focus search bar
    searchBar.classList.add('focus');
    typingText.classList.remove('placeholder');
    typingText.textContent = '';
    cursorBlink.classList.remove('hidden');

    await wait(500);

    // Type query
    for (let i = 0; i < query.length; i++) {
        typingText.textContent += query[i];
        // Random typing speed between 50ms and 150ms
        const delay = Math.floor(Math.random() * 100) + 50;
        await wait(delay);
    }

    // Wait a moment after typing
    await wait(600);

    // Redirect to actual Reddit
    window.location.href = `https://www.reddit.com/search/?q=${encodeURIComponent(query)}`;
}
