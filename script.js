
const navigationLinks = document.querySelectorAll(".nav-link");
const pageSections = document.querySelectorAll(".page");
const pageButtons = document.querySelectorAll("[data-go]");

function showPage(pageId) {
    const targetPage = document.getElementById(pageId);

    if (!targetPage) return;

    pageSections.forEach((page) => {
        page.classList.toggle("active-page", page.id === pageId);
    });

    navigationLinks.forEach((link) => {
        const isActive = link.dataset.page === pageId;

        link.classList.toggle("active", isActive);

        if (isActive) {
            link.setAttribute("aria-current", "page");
        } else {
            link.removeAttribute("aria-current");
        }
    });

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

navigationLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
        event.preventDefault();
        showPage(link.dataset.page);
    });
});

pageButtons.forEach((button) => {
    button.addEventListener("click", () => {
        showPage(button.dataset.go);
    });
});

/* ===== CAREERLENS AI: CV BUILDER ===== */

const cvForm = document.getElementById("cv-form");
const printCvButton = document.getElementById("print-cv");

if (cvForm) {
    cvForm.addEventListener("submit", function (event) {
        event.preventDefault();

        const name = document.getElementById("cv-name").value.trim();
        const email = document.getElementById("cv-email").value.trim();
        const phone = document.getElementById("cv-phone").value.trim();
        const location = document.getElementById("cv-location").value.trim();
        const summary = document.getElementById("cv-summary").value.trim();
        const education = document.getElementById("cv-education").value.trim();
        const skills = document.getElementById("cv-skills").value.trim();
        const experience = document.getElementById("cv-experience").value.trim();

        document.getElementById("preview-name").textContent =
            name || "Your Full Name";

        const contactDetails = [email, phone, location].filter(Boolean);

        document.getElementById("preview-contact").textContent =
            contactDetails.join(" | ") || "Your contact details";

        document.getElementById("preview-summary").textContent =
            summary || "No professional summary added yet.";

        document.getElementById("preview-education").textContent =
            education || "No education details added yet.";

        document.getElementById("preview-skills").textContent =
            skills
                ? skills.split(",").map(skill => skill.trim()).filter(Boolean).join(" • ")
                : "No skills added yet.";

        document.getElementById("preview-experience").textContent =
            experience || "No experience or projects added yet.";

        document.getElementById("cv-preview").scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

if (printCvButton) {
    printCvButton.addEventListener("click", function () {
        window.print();
    });
}

/* ===== CAREERLENS AI: JOB MATCH CHECKER ===== */

const matchCv = document.getElementById("match-cv");
const matchJob = document.getElementById("match-job");
const analyzeMatchButton = document.getElementById("analyze-match");
const clearMatchButton = document.getElementById("clear-match");
const matchResults = document.getElementById("match-results");

// Count the words entered in each box.
function countWords(text) {
    const trimmed = text.trim();
    return trimmed ? trimmed.split(/\s+/).length : 0;
}

function updateWordCounts() {
    if (matchCv && matchJob) {
        document.getElementById("cv-word-count").textContent =
            countWords(matchCv.value) + " words";

        document.getElementById("job-word-count").textContent =
            countWords(matchJob.value) + " words";
    }
}

if (matchCv && matchJob) {
    matchCv.addEventListener("input", updateWordCounts);
    matchJob.addEventListener("input", updateWordCounts);
}

// Extract meaningful keywords while ignoring common words.
function extractKeywords(text) {
    const stopWords = new Set([
        "the", "and", "for", "with", "from", "that", "this",
        "are", "was", "were", "will", "you", "your", "our",
        "their", "they", "them", "have", "has", "had", "who",
        "what", "when", "where", "how", "why", "can", "could",
        "would", "should", "must", "may", "not", "all", "any",
        "job", "role", "work", "working", "team", "teams",
        "ability", "able", "using", "use", "used", "including",
        "include", "required", "requirements", "responsibilities",
        "experience", "years", "year", "good", "strong",
        "excellent", "relevant", "preferred", "knowledge",
        "skills", "skill", "candidate", "applicant", "position",
        "within", "across", "about", "into", "over", "under",
        "such", "other", "more", "most", "some", "each",
        "ensure", "support", "provide", "manage", "help",
        "based", "various", "related", "including", "etc"
    ]);

    const words = text.toLowerCase().match(/[a-z][a-z+#.-]*/g) || [];

    return new Set(
        words
            .map(word => word.replace(/^[.+-]+|[.+-]+$/g, ""))
            .filter(word =>
                word.length >= 3 &&
                !stopWords.has(word) &&
                /[a-z]/.test(word)
            )
    );
}

// Display keyword chips safely.
function displayKeywords(containerId, keywords, isMissing = false) {
    const container = document.getElementById(containerId);
    container.replaceChildren();

    if (keywords.length === 0) {
        const message = document.createElement("span");
        message.className = "keyword-empty";
        message.textContent = isMissing
            ? "No missing keywords found."
            : "No matching keywords found yet.";
        container.appendChild(message);
        return;
    }

    keywords.forEach(keyword => {
        const chip = document.createElement("span");
        chip.className = isMissing
            ? "keyword-tag missing"
            : "keyword-tag";
        chip.textContent = keyword;
        container.appendChild(chip);
    });
}

// Analyze the CV against the job description.
if (analyzeMatchButton && matchCv && matchJob) {
    analyzeMatchButton.addEventListener("click", function () {
        const cvText = matchCv.value.trim();
        const jobText = matchJob.value.trim();

        if (!cvText || !jobText) {
            alert("Please enter both your CV and the job description.");
            return;
        }

        const cvKeywords = extractKeywords(cvText);
        const jobKeywords = extractKeywords(jobText);

        const matching = [...jobKeywords].filter(keyword =>
            cvKeywords.has(keyword)
        );

        const missing = [...jobKeywords].filter(keyword =>
            !cvKeywords.has(keyword)
        );

        const score = jobKeywords.size > 0
            ? Math.round((matching.length / jobKeywords.size) * 100)
            : 0;

        document.getElementById("match-score").textContent = score + "%";
        document.getElementById("score-bar").style.width = score + "%";

        let title;
        let summary;

        if (jobKeywords.size === 0) {
            title = "Not enough keywords to compare";
            summary = "Try adding a more detailed job description with specific skills and requirements.";
        } else if (score >= 70) {
            title = "Strong keyword overlap!";
            summary = "Your CV contains many of the keywords found in this job description. Review the role's requirements carefully and make sure your CV demonstrates relevant evidence.";
        } else if (score >= 40) {
            title = "Some relevant keywords found";
            summary = "Your CV overlaps with parts of the job description. Review the missing keywords and make sure your relevant skills and experience are clearly described.";
        } else {
            title = "Opportunity to improve your CV";
            summary = "There is limited keyword overlap. Check whether your CV clearly describes relevant skills, projects, training and experience.";
        }

        document.getElementById("match-summary-title").textContent = title;
        document.getElementById("match-summary").textContent = summary;

        displayKeywords("matching-keywords", matching);
        displayKeywords("missing-keywords", missing, true);

        const suggestions = document.getElementById("match-suggestions");
        suggestions.replaceChildren();

        const advice = [];

        if (missing.length > 0) {
            advice.push(
                "Review the missing keywords and add only those that genuinely describe your skills or experience."
            );
        }

        advice.push(
            "Use concrete examples from your projects, education or work to demonstrate your relevant skills."
        );

        advice.push(
            "Check the job's essential qualifications and requirements; keyword overlap alone cannot establish eligibility."
        );

        advice.push(
            "Never add skills you do not have just to increase your match score."
        );

        advice.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            suggestions.appendChild(li);
        });

        matchResults.hidden = false;

        matchResults.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    });
}

// Clear the form and hide previous results.
if (clearMatchButton && matchCv && matchJob) {
    clearMatchButton.addEventListener("click", function () {
        matchCv.value = "";
        matchJob.value = "";
        updateWordCounts();

        matchResults.hidden = true;
        document.getElementById("match-score").textContent = "0%";
        document.getElementById("score-bar").style.width = "0%";

        matchCv.focus();
    });
}

/* ===== CAREERLENS AI: INTERVIEW PRACTICE ===== */

const interviewQuestions = {
    general: [
        {
            type: "mixed",
            question: "Tell me about yourself.",
            tip: "Introduce your background, relevant skills, a project or achievement, and what you can contribute to the role."
        },
        {
            type: "behavioral",
            question: "Tell me about a challenge you faced and how you handled it.",
            tip: "Use the STAR method: Situation, Task, Action and Result. A school assignment or personal project can count."
        },
        {
            type: "mixed",
            question: "Why do you want this job?",
            tip: "Connect your genuine interests and skills to the role and explain what you hope to contribute."
        },
        {
            type: "behavioral",
            question: "How do you handle feedback or criticism?",
            tip: "Explain how you listen, learn from feedback and apply it to improve your work."
        },
        {
            type: "mixed",
            question: "Why should we hire you?",
            tip: "Highlight two or three relevant strengths and support them with a real example."
        },
        {
            type: "behavioral",
            question: "Tell me about a time you worked toward a difficult goal.",
            tip: "Explain the goal, the actions you took, the obstacles you faced and the outcome."
        },
        {
            type: "mixed",
            question: "What is one skill you are currently improving?",
            tip: "Choose a genuine development area and describe the practical steps you are taking."
        }
    ],

    technology: [
        {
            type: "technical",
            question: "Describe a website or software project you have built.",
            tip: "Explain the problem, the technologies used, your contribution and what you learned."
        },
        {
            type: "technical",
            question: "How would you troubleshoot a website that is not working?",
            tip: "Describe how you reproduce the problem, inspect errors, check the code, test a fix and verify the result."
        },
        {
            type: "technical",
            question: "What is the difference between HTML, CSS and JavaScript?",
            tip: "Explain that HTML structures content, CSS styles it, and JavaScript adds behaviour and interactivity."
        },
        {
            type: "behavioral",
            question: "How do you learn a new technology when you get stuck?",
            tip: "Discuss documentation, small experiments, debugging and how you verify what you learn."
        },
        {
            type: "technical",
            question: "How would you make a website usable on both phones and computers?",
            tip: "Mention responsive layouts, flexible sizing, media queries and testing different screen sizes."
        },
        {
            type: "behavioral",
            question: "Describe a technical problem you solved.",
            tip: "Explain the issue, how you investigated it, the solution you tried and what happened."
        }
    ],

    data: [
        {
            type: "technical",
            question: "How would you handle a dataset containing missing values?",
            tip: "Explain how you inspect missing data, understand why it is missing, and decide whether to correct, exclude or appropriately fill values."
        },
        {
            type: "technical",
            question: "What is the difference between Excel and SQL?",
            tip: "Compare spreadsheet analysis with querying and managing structured data in databases."
        },
        {
            type: "technical",
            question: "How would you explain a data trend to someone without a technical background?",
            tip: "Focus on the key finding, a clear visual or example, and what the finding means for the audience."
        },
        {
            type: "behavioral",
            question: "Tell me about a time you used information to make a decision.",
            tip: "Describe the information you considered, how you interpreted it and how it informed your decision."
        },
        {
            type: "technical",
            question: "How would you check whether your analysis is accurate?",
            tip: "Mention validating source data, checking formulas, looking for duplicates and outliers, and verifying results."
        },
        {
            type: "technical",
            question: "When might you use a chart instead of a table?",
            tip: "Explain how charts reveal patterns and comparisons, while tables are useful for exact values."
        }
    ],

    marketing: [
        {
            type: "technical",
            question: "How would you plan content for a new brand?",
            tip: "Discuss the audience, brand goals, content themes, publishing schedule and how you would measure results."
        },
        {
            type: "technical",
            question: "How would you measure whether a social media campaign succeeded?",
            tip: "Choose metrics based on the goal, such as reach, engagement, clicks, leads or conversions."
        },
        {
            type: "behavioral",
            question: "Tell me about a creative idea you developed.",
            tip: "Explain the audience or problem, your idea, how you executed it and what you learned."
        },
        {
            type: "technical",
            question: "What is SEO, and why is it useful for content?",
            tip: "Discuss helping relevant content appear in search results through useful content, search intent and appropriate keywords."
        },
        {
            type: "behavioral",
            question: "How would you respond to negative feedback on a brand's social media page?",
            tip: "Explain how you would remain professional, assess the complaint and respond constructively within brand guidelines."
        },
        {
            type: "technical",
            question: "How would you adapt one piece of content for different platforms?",
            tip: "Discuss adjusting format, length, tone and presentation for each platform and its audience."
        }
    ],

    customer: [
        {
            type: "behavioral",
            question: "How would you handle an angry customer?",
            tip: "Listen without interrupting, acknowledge the concern, clarify the issue and offer an appropriate solution."
        },
        {
            type: "behavioral",
            question: "Tell me about a time you helped someone solve a problem.",
            tip: "Describe what the person needed, how you helped and the outcome."
        },
        {
            type: "technical",
            question: "What would you do if you did not know the answer to a customer's question?",
            tip: "Explain how you would be honest, consult reliable resources or the appropriate colleague, and follow up."
        },
        {
            type: "behavioral",
            question: "How do you prioritise several customer requests at once?",
            tip: "Consider urgency, impact, deadlines, company procedures and communicating realistic expectations."
        },
        {
            type: "technical",
            question: "How would you handle a customer requesting something against company policy?",
            tip: "Show empathy, explain the policy clearly and look for an acceptable alternative."
        },
        {
            type: "behavioral",
            question: "How do you stay calm when work becomes stressful?",
            tip: "Describe practical methods such as prioritising tasks, staying organised and asking for support when necessary."
        }
    ]
};

const interviewRoleSelect = document.getElementById("interview-role");
const interviewTypeSelect = document.getElementById("interview-type");
const startInterviewButton = document.getElementById("start-interview");
const interviewRoom = document.getElementById("interview-room");
const interviewComplete = document.getElementById("interview-complete");
const interviewAnswer = document.getElementById("interview-answer");
const checkInterviewButton = document.getElementById("check-interview-answer");
const showInterviewHintButton = document.getElementById("show-interview-hint");
const nextInterviewButton = document.getElementById("next-interview-question");
const restartInterviewButton = document.getElementById("restart-interview");

let activeInterviewQuestions = [];
let currentInterviewIndex = 0;
let interviewScores = [];
let currentAnswerReviewed = false;

const interviewRoleNames = {
    general: "General / Entry-Level",
    technology: "Technology / IT",
    data: "Data Analyst",
    marketing: "Marketing / Content Creation",
    customer: "Customer Service"
};

function prepareInterviewQuestions() {
    const role = interviewRoleSelect.value;
    const type = interviewTypeSelect.value;
    const questions = interviewQuestions[role] || interviewQuestions.general;

    let filteredQuestions;

    if (type === "behavioral") {
        filteredQuestions = questions.filter(q => q.type === "behavioral");
    } else if (type === "technical") {
        filteredQuestions = questions.filter(q => q.type === "technical");
    } else {
        filteredQuestions = questions.filter(q => q.type === "mixed");
        filteredQuestions = filteredQuestions.concat(
            questions.filter(q => q.type !== "mixed")
        );
    }

    // Shuffle the question order for a fresh practice session.
    return [...filteredQuestions]
        .sort(() => Math.random() - 0.5)
        .slice(0, 5);
}

function startInterviewSession() {
    activeInterviewQuestions = prepareInterviewQuestions();
    currentInterviewIndex = 0;
    interviewScores = [];
    currentAnswerReviewed = false;

    interviewComplete.hidden = true;
    interviewRoom.hidden = false;

    showInterviewQuestion();

    interviewRoom.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function showInterviewQuestion() {
    const question = activeInterviewQuestions[currentInterviewIndex];

    if (!question) {
        finishInterviewSession();
        return;
    }

    currentAnswerReviewed = false;
    interviewAnswer.value = "";

    document.getElementById("question-counter").textContent =
        `Question ${currentInterviewIndex + 1} of ${activeInterviewQuestions.length}`;

    document.getElementById("interview-role-label").textContent =
        interviewRoleNames[interviewRoleSelect.value];

    document.getElementById("interview-progress-bar").style.width =
        `${((currentInterviewIndex + 1) / activeInterviewQuestions.length) * 100}%`;

    document.getElementById("interview-question").textContent =
        question.question;

    document.getElementById("interview-question-tip").textContent =
        "Take a moment to think. Write your answer as if you were speaking to an interviewer.";

    document.getElementById("interview-hint-text").textContent =
        question.tip;

    document.getElementById("interview-hint").hidden = true;
    document.getElementById("interview-review").hidden = true;

    checkInterviewButton.hidden = false;
    nextInterviewButton.hidden = false;
    nextInterviewButton.textContent =
        currentInterviewIndex === activeInterviewQuestions.length - 1
            ? "Finish Practice →"
            : "Next Question →";

    interviewAnswer.focus();
}

function reviewInterviewAnswer() {
    if (currentAnswerReviewed) return;

    const answer = interviewAnswer.value.trim();

    if (!answer) {
        alert("Please write your answer before requesting feedback.");
        interviewAnswer.focus();
        return;
    }

    const words = answer.match(/\b[\w'-]+\b/g) || [];
    const wordCount = words.length;
    const lowerAnswer = answer.toLowerCase();

    // Transparent, rule-based feedback — not an AI judgement.
    const hasExample = /\b(for example|for instance|such as|when i|i once|my project|i worked on|i created|i built|i helped)\b/i.test(answer);
    const hasAction = /\b(i did|i used|i created|i built|i developed|i analysed|i analyzed|i organised|i organized|i improved|i solved|i learned|i learnt|i communicated|i managed|i tested|i researched|i designed|i implemented|i collaborated|i decided|i handled|i checked|i completed|i led)\b/i.test(answer);
    const hasOutcome = /\b(result|as a result|therefore|successfully|improved|achieved|completed|learned|learnt|reduced|increased|saved|delivered|helped|enabled|resolved|which meant|i discovered)\b/i.test(answer);
    const hasReflection = /\b(i learned|i learnt|i would|i could improve|next time|my strength|my experience|my goal|i am interested|i enjoy|i hope|i can contribute)\b/i.test(answer);
    const hasStructure = /\b(first|then|next|finally|because|so that|after|before|although)\b/i.test(answer);

    let score = 0;
    const feedback = [];

    if (wordCount >= 40) {
        score += 25;
    } else if (wordCount >= 20) {
        score += 18;
        feedback.push("Add more relevant detail to develop your answer.");
    } else {
        score += 8;
        feedback.push("Your answer is quite short. Explain your point with more detail.");
    }

    if (hasExample) {
        score += 20;
    } else {
        feedback.push("Include a specific example from work, school, volunteering or a personal project.");
    }

    if (hasAction) {
        score += 20;
    } else {
        feedback.push("Explain the actions YOU personally took, rather than only describing the situation.");
    }

    if (hasOutcome) {
        score += 20;
    } else {
        feedback.push("Describe the result, what changed, or what you learned.");
    }

    if (hasStructure) {
        score += 10;
    } else {
        feedback.push("Organise your answer into a clear beginning, middle and conclusion.");
    }

    if (hasReflection) {
        score += 5;
    } else {
        feedback.push("Where relevant, finish by explaining what the experience taught you or how it relates to the role.");
    }

    score = Math.min(score, 100);

    let summary;

    if (score >= 80) {
        summary = "Your written answer includes several useful interview-answer elements. Review the suggestions below to make it even clearer.";
    } else if (score >= 55) {
        summary = "Your answer has a starting point. Adding concrete evidence and a clearer outcome may make it more persuasive.";
    } else {
        summary = "Use this as a first draft. Build your answer around a specific example, the actions you took and the outcome.";
    }

    if (feedback.length === 0) {
        feedback.push("Keep your answer honest, relevant and concise. Practise saying it aloud in a natural way.");
    }

    document.getElementById("interview-review-score").textContent = `${score}/100`;
    document.getElementById("interview-review-summary").textContent =
        `${summary} This score reflects answer structure only, not your actual interview ability.`;

    const tipsList = document.getElementById("interview-review-tips");
    tipsList.replaceChildren();

    feedback.forEach(tip => {
        const item = document.createElement("li");
        item.textContent = tip;
        tipsList.appendChild(item);
    });

    interviewScores.push(score);
    currentAnswerReviewed = true;

    document.getElementById("interview-review").hidden = false;
    checkInterviewButton.hidden = true;

    document.getElementById("interview-review").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

function finishInterviewSession() {
    interviewRoom.hidden = true;
    interviewComplete.hidden = false;

    const total = interviewScores.length;
    const average = total
        ? Math.round(interviewScores.reduce((sum, score) => sum + score, 0) / total)
        : 0;

    document.getElementById("interview-final-summary").textContent =
        `You completed ${total} question${total === 1 ? "" : "s"}. Your average answer-structure score was ${average}/100. Use your feedback to practise again. This score measures written-answer structure, not whether you would pass an interview.`;

    interviewComplete.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

if (startInterviewButton) {
    startInterviewButton.addEventListener("click", startInterviewSession);
}

if (checkInterviewButton) {
    checkInterviewButton.addEventListener("click", reviewInterviewAnswer);
}

if (showInterviewHintButton) {
    showInterviewHintButton.addEventListener("click", function () {
        const hint = document.getElementById("interview-hint");
        hint.hidden = !hint.hidden;
    });
}

if (nextInterviewButton) {
    nextInterviewButton.addEventListener("click", function () {
        if (!currentAnswerReviewed) {
            alert("Review your answer before moving to the next question.");
            return;
        }

        currentInterviewIndex++;

        if (currentInterviewIndex >= activeInterviewQuestions.length) {
            finishInterviewSession();
        } else {
            showInterviewQuestion();
        }
    });
}

if (restartInterviewButton) {
    restartInterviewButton.addEventListener("click", startInterviewSession);
}

/* ===== CAREERLENS AI: JOB APPLICATIONS TRACKER ===== */

const APPLICATION_STORAGE_KEY = "careerlens_job_applications_v1";

const applicationForm = document.getElementById("application-form");
const applicationList = document.getElementById("application-list");
const applicationSearch = document.getElementById("application-search");
const applicationFilter = document.getElementById("application-filter");
const applicationMessage = document.getElementById("application-form-message");

let jobApplications = [];
let applicationStorageAvailable = true;

function loadApplications() {
    try {
        const saved = localStorage.getItem(APPLICATION_STORAGE_KEY);
        const parsed = saved ? JSON.parse(saved) : [];

        jobApplications = Array.isArray(parsed)
            ? parsed.filter(item =>
                item &&
                typeof item.id === "string" &&
                typeof item.title === "string" &&
                typeof item.company === "string"
            )
            : [];
    } catch (error) {
        applicationStorageAvailable = false;
        jobApplications = [];
        showApplicationMessage(
            "Browser storage is unavailable. Your applications may not persist after refreshing."
        );
    }
}

function saveApplications() {
    try {
        localStorage.setItem(
            APPLICATION_STORAGE_KEY,
            JSON.stringify(jobApplications)
        );

        applicationStorageAvailable = true;
        return true;
    } catch (error) {
        applicationStorageAvailable = false;
        showApplicationMessage(
            "Could not save to browser storage. Check your browser's storage settings or available space."
        );
        return false;
    }
}

function showApplicationMessage(message) {
    if (applicationMessage) {
        applicationMessage.textContent = message;
    }
}

function makeElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

function updateApplicationStats() {
    document.getElementById("stat-total").textContent =
        jobApplications.length;

    document.getElementById("stat-applied").textContent =
        jobApplications.filter(item => item.status === "Applied").length;

    document.getElementById("stat-interview").textContent =
        jobApplications.filter(item => item.status === "Interview").length;

    document.getElementById("stat-offer").textContent =
        jobApplications.filter(item => item.status === "Offer").length;
}

function renderApplications() {
    if (!applicationList) return;

    applicationList.replaceChildren();

    const searchTerm = applicationSearch.value.trim().toLowerCase();
    const statusFilter = applicationFilter.value;

    const filteredApplications = [...jobApplications]
        .filter(item => {
            const matchesSearch =
                item.title.toLowerCase().includes(searchTerm) ||
                item.company.toLowerCase().includes(searchTerm);

            const matchesStatus =
                statusFilter === "All" || item.status === statusFilter;

            return matchesSearch && matchesStatus;
        })
        .sort((a, b) => {
            const dateOrder = b.date.localeCompare(a.date);
            return dateOrder || b.updatedAt.localeCompare(a.updatedAt);
        });

    if (filteredApplications.length === 0) {
        const emptyText = jobApplications.length === 0
            ? "No applications yet. Add your first job above!"
            : "No applications match your search or selected filter.";

        applicationList.appendChild(
            makeElement("p", "application-empty", emptyText)
        );

        updateApplicationStats();
        return;
    }

    filteredApplications.forEach(item => {
        const card = makeElement("article", "application-item");
        const header = makeElement("div", "application-item-header");
        const identity = makeElement("div");
        const title = makeElement("h4", "", item.title);
        const company = makeElement("p", "application-company", item.company);

        identity.append(title, company);

        const status = makeElement(
            "span",
            "application-status-badge",
            item.status
        );

        status.dataset.status = item.status;

        header.append(identity, status);

        const meta = makeElement("div", "application-meta");
        meta.append(
            makeElement("span", "", `Applied: ${item.date}`),
            makeElement("span", "", `Updated: ${item.updatedAt.slice(0, 10)}`)
        );

        const statusLabel = makeElement("label");
        statusLabel.setAttribute("for", `status-${item.id}`);
        statusLabel.textContent = "Update status";

        const statusSelect = document.createElement("select");
        statusSelect.id = `status-${item.id}`;
        statusSelect.setAttribute(
            "aria-label",
            `Update status for ${item.title} at ${item.company}`
        );

        [
            "Applied",
            "Assessment",
            "Interview",
            "Offer",
            "Rejected",
            "Withdrawn"
        ].forEach(statusName => {
            const option = document.createElement("option");
            option.value = statusName;
            option.textContent = statusName;
            option.selected = item.status === statusName;
            statusSelect.appendChild(option);
        });

        statusSelect.addEventListener("change", () => {
            const application = jobApplications.find(
                entry => entry.id === item.id
            );

            if (!application) return;

            const previousStatus = application.status;
            application.status = statusSelect.value;
            application.updatedAt = new Date().toISOString();

            if (!saveApplications()) {
                application.status = previousStatus;
                statusSelect.value = previousStatus;
                return;
            }

            showApplicationMessage("Application status updated.");
            renderApplications();
        });

        const statusControl = makeElement("div");
        statusControl.append(statusLabel, statusSelect);

        const details = makeElement("div", "application-meta");
        details.appendChild(statusControl);

        if (item.link) {
            try {
                const parsedUrl = new URL(item.link);

                if (parsedUrl.protocol === "https:" || parsedUrl.protocol === "http:") {
                    const link = makeElement("a", "", "View job advertisement ↗");
                    link.href = parsedUrl.href;
                    link.target = "_blank";
                    link.rel = "noopener noreferrer";
                    details.appendChild(link);
                }
            } catch (error) {
                // Ignore invalid optional URLs.
            }
        }

        card.append(header, meta, details);

        if (item.notes) {
            card.appendChild(
                makeElement("div", "application-notes", item.notes)
            );
        }

        const actions = makeElement("div", "application-item-actions");

        const editButton = makeElement("button", "", "Edit Details");
        editButton.type = "button";
        editButton.addEventListener("click", () => {
            editApplication(item.id);
        });

        const deleteButton = makeElement(
            "button",
            "application-delete",
            "Delete"
        );

        deleteButton.type = "button";
        deleteButton.addEventListener("click", () => {
            deleteApplication(item.id);
        });

        actions.append(editButton, deleteButton);
        card.appendChild(actions);
        applicationList.appendChild(card);
    });

    updateApplicationStats();
}

function resetApplicationForm() {
    applicationForm.reset();
    document.getElementById("application-edit-id").value = "";
    document.getElementById("application-form-heading").textContent =
        "Add a Job Application";

    document.getElementById("save-application").textContent =
        "Save Application";

    document.getElementById("cancel-application-edit").hidden = true;

    document.getElementById("application-date").value =
        new Date().toLocaleDateString("en-CA");

    document.getElementById("application-status").value = "Applied";
}

function editApplication(id) {
    const item = jobApplications.find(application => application.id === id);
    if (!item) return;

    document.getElementById("application-edit-id").value = item.id;
    document.getElementById("application-title").value = item.title;
    document.getElementById("application-company").value = item.company;
    document.getElementById("application-date").value = item.date;
    document.getElementById("application-status").value = item.status;
    document.getElementById("application-link").value = item.link || "";
    document.getElementById("application-notes").value = item.notes || "";

    document.getElementById("application-form-heading").textContent =
        "Edit Job Application";

    document.getElementById("save-application").textContent =
        "Update Application";

    document.getElementById("cancel-application-edit").hidden = false;

    applicationForm.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    document.getElementById("application-title").focus();
    showApplicationMessage("Edit the details and select Update Application.");
}

function deleteApplication(id) {
    const item = jobApplications.find(application => application.id === id);
    if (!item) return;

    const confirmed = window.confirm(
        `Delete the application for "${item.title}" at "${item.company}"? This cannot be undone.`
    );

    if (!confirmed) return;

    const previousApplications = [...jobApplications];
    jobApplications = jobApplications.filter(application => application.id !== id);

    if (!saveApplications()) {
        jobApplications = previousApplications;
        return;
    }

    if (document.getElementById("application-edit-id").value === id) {
        resetApplicationForm();
    }

    showApplicationMessage("Application deleted.");
    renderApplications();
}

if (applicationForm) {
    applicationForm.addEventListener("submit", event => {
        event.preventDefault();

        const id = document.getElementById("application-edit-id").value;

        const title = document.getElementById("application-title").value.trim();
        const company = document.getElementById("application-company").value.trim();
        const date = document.getElementById("application-date").value;
        const status = document.getElementById("application-status").value;
        const link = document.getElementById("application-link").value.trim();
        const notes = document.getElementById("application-notes").value.trim();

        if (!title || !company || !date) {
            showApplicationMessage("Please complete all required fields.");
            return;
        }

        if (link) {
            try {
                const parsedUrl = new URL(link);

                if (parsedUrl.protocol !== "https:" && parsedUrl.protocol !== "http:") {
                    showApplicationMessage("Please enter a valid HTTP or HTTPS job link.");
                    return;
                }
            } catch (error) {
                showApplicationMessage("Please enter a valid job advertisement URL.");
                return;
            }
        }

        const now = new Date().toISOString();
        const previousApplications = [...jobApplications];

        if (id) {
            const index = jobApplications.findIndex(item => item.id === id);

            if (index === -1) {
                showApplicationMessage("This application could not be found. Please refresh and try again.");
                return;
            }

            jobApplications[index] = {
                ...jobApplications[index],
                title,
                company,
                date,
                status,
                link,
                notes,
                updatedAt: now
            };
        } else {
            jobApplications.push({
                id: window.crypto && typeof window.crypto.randomUUID === "function"
                    ? window.crypto.randomUUID()
                    : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                title,
                company,
                date,
                status,
                link,
                notes,
                createdAt: now,
                updatedAt: now
            });
        }

        if (!saveApplications()) {
            jobApplications = previousApplications;
            return;
        }

        resetApplicationForm();
        showApplicationMessage(
            id ? "Application updated successfully!" : "Application saved successfully!"
        );

        renderApplications();
    });
}

document.getElementById("cancel-application-edit")
    ?.addEventListener("click", () => {
        resetApplicationForm();
        showApplicationMessage("Editing cancelled.");
    });

applicationSearch?.addEventListener("input", renderApplications);
applicationFilter?.addEventListener("change", renderApplications);

function exportApplicationsCsv() {
    const headers = [
        "Job Title",
        "Company",
        "Date Applied",
        "Status",
        "Job URL",
        "Notes"
    ];

    const escapeCsv = value =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = jobApplications.map(item => [
        item.title,
        item.company,
        item.date,
        item.status,
        item.link,
        item.notes
    ]);

    const csv = [headers, ...rows]
        .map(row => row.map(escapeCsv).join(","))
        .join("\r\n");

    // UTF-8 BOM helps spreadsheet applications recognise the file.
    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;"
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "CareerLens-Job-Applications.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

document.getElementById("export-applications")
    ?.addEventListener("click", exportApplicationsCsv);

// Initialise the tracker.
if (applicationForm && applicationList) {
    loadApplications();
    resetApplicationForm();
    renderApplications();
}
