// Star Rating Functionality
const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');

stars.forEach((star, index) => {
    star.addEventListener('click', () => {
        const value = index + 1;
        ratingInput.value = value;
        updateStars(value);
    });

    star.addEventListener('mouseenter', () => {
        const value = index + 1;
        updateStars(value);
    });
});

document.getElementById('starRating').addEventListener('mouseleave', () => {
    updateStars(ratingInput.value);
});

function updateStars(value) {
    stars.forEach((star, index) => {
        if (index < value) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Character Counter
const messageTextarea = document.getElementById('message');
const charCount = document.getElementById('charCount');

messageTextarea.addEventListener('input', () => {
    const count = messageTextarea.value.length;
    charCount.textContent = count;

    if (count > 1000) {
        charCount.style.color = 'var(--error)';
        messageTextarea.value = messageTextarea.value.substring(0, 1000);
    } else if (count > 900) {
        charCount.style.color = 'var(--warning)';
    } else {
        charCount.style.color = 'var(--text-muted)';
    }
});

// Form Submission
const feedbackForm = document.getElementById('feedbackForm');
const submitBtn = document.getElementById('submitBtn');
const successMessage = document.getElementById('successMessage');

feedbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="btn-text">Submitting...</span>';

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        feedbackType: document.getElementById('feedbackType').value,
        rating: document.getElementById('rating').value,
        message: document.getElementById('message').value,
        subscribe: document.getElementById('subscribe').checked,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent
    };

    try {
        // Save to localStorage (as a backup/demo)
        saveFeedbackLocally(formData);

        // Submit to GitHub (you'll need to configure this)
        await submitToGitHub(formData);

        // Show success message
        feedbackForm.style.display = 'none';
        successMessage.classList.remove('hidden');

        // Scroll to success message
        successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });

    } catch (error) {
        console.error('Error submitting feedback:', error);
        alert('There was an error submitting your feedback. Please try again or contact us directly.');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<span class="btn-text">Submit Feedback</span><span class="btn-icon">→</span>';
    }
});

// Save feedback to localStorage
function saveFeedbackLocally(data) {
    const feedbacks = JSON.parse(localStorage.getItem('techsambad_feedbacks') || '[]');
    feedbacks.push(data);
    localStorage.setItem('techsambad_feedbacks', JSON.stringify(feedbacks));
}

// Submit to GitHub Issues (requires configuration)
async function submitToGitHub(data) {
    // CONFIGURATION REQUIRED:
    // Replace these values with your GitHub repository details
    const GITHUB_TOKEN = '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'; // Create a personal access token
    const REPO_OWNER = 'subu-prog'; // Your GitHub username
    const REPO_NAME = 'FeedbackAPP'; // Your repository name

    // If you haven't configured GitHub yet, we'll just simulate success
    if (GITHUB_TOKEN === 'YOUR_GITHUB_TOKEN') {
        console.log('GitHub not configured. Feedback saved locally:', data);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }

    // Create issue title and body
    const title = `[${data.feedbackType}] Feedback from ${data.name}`;
    const body = `
## Feedback Details

**Name:** ${data.name}
**Email:** ${data.email}
**Type:** ${data.feedbackType}
**Rating:** ${'⭐'.repeat(parseInt(data.rating) || 0)}
**Subscribe to Updates:** ${data.subscribe ? 'Yes' : 'No'}
**Submitted:** ${new Date(data.timestamp).toLocaleString()}

---

### Message

${data.message}

---

<details>
<summary>Technical Details</summary>

**User Agent:** ${data.userAgent}
**Timestamp:** ${data.timestamp}

</details>
`;

    // Submit to GitHub Issues API
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`, {
        method: 'POST',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            title: title,
            body: body,
            labels: ['feedback', data.feedbackType]
        })
    });

    if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`);
    }

    return await response.json();
}

// Alternative: Submit to GitHub Discussions (if you prefer discussions over issues)
async function submitToGitHubDiscussions(data) {
    // This requires GraphQL API and is more complex
    // See: https://docs.github.com/en/graphql/guides/using-the-graphql-api-for-discussions
    console.log('GitHub Discussions integration - implement if needed');
}

// Close success message and reset form
function closeSuccessMessage() {
    successMessage.classList.add('hidden');
    feedbackForm.style.display = 'block';
    feedbackForm.reset();
    ratingInput.value = '0';
    updateStars(0);
    charCount.textContent = '0';
    submitBtn.disabled = false;
    submitBtn.innerHTML = '<span class="btn-text">Submit Feedback</span><span class="btn-icon">→</span>';

    // Scroll back to form
    feedbackForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Make closeSuccessMessage available globally
window.closeSuccessMessage = closeSuccessMessage;

// Form validation enhancements
document.getElementById('email').addEventListener('blur', function () {
    const email = this.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email && !emailRegex.test(email)) {
        this.style.borderColor = 'var(--error)';
    } else {
        this.style.borderColor = '';
    }
});

// Auto-save draft to localStorage
let autoSaveTimeout;
['name', 'email', 'feedbackType', 'message'].forEach(fieldId => {
    document.getElementById(fieldId).addEventListener('input', () => {
        clearTimeout(autoSaveTimeout);
        autoSaveTimeout = setTimeout(() => {
            saveDraft();
        }, 1000);
    });
});

function saveDraft() {
    const draft = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        feedbackType: document.getElementById('feedbackType').value,
        message: document.getElementById('message').value,
        rating: document.getElementById('rating').value
    };
    localStorage.setItem('techsambad_draft', JSON.stringify(draft));
}

function loadDraft() {
    const draft = localStorage.getItem('techsambad_draft');
    if (draft) {
        const data = JSON.parse(draft);
        document.getElementById('name').value = data.name || '';
        document.getElementById('email').value = data.email || '';
        document.getElementById('feedbackType').value = data.feedbackType || '';
        document.getElementById('message').value = data.message || '';
        if (data.rating) {
            ratingInput.value = data.rating;
            updateStars(data.rating);
        }
        if (data.message) {
            charCount.textContent = data.message.length;
        }
    }
}

// Load draft on page load
window.addEventListener('load', loadDraft);

// Clear draft after successful submission
function clearDraft() {
    localStorage.removeItem('techsambad_draft');
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});
