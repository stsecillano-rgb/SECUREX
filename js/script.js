/*
    SECUREX JavaScript
    -------------------
    This file keeps the website interactive.
    Each function has one job so it is easy to explain in class.

    IMAGE INSERTION GUIDE:
    Put pictures in the images folder, then replace the placeholder
    <div> with an <img> tag. Example:
    <img src="images/dashboard.jpg" alt="Platform Security Dashboard">

    VIDEO INSERTION GUIDE:
    Replace the video placeholder with a YouTube iframe.
    Example:
    <iframe src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
            title="Tutorial Video" allowfullscreen></iframe>
*/

document.addEventListener("DOMContentLoaded", function () {
    setupMenu();
    setupScrollReveal();
    setupSearch();
    setupProgressBars();
    setupLessonButtons();
    setupLibraryButtons();
    setupTutorialTracking();
    displayRecents();
    setupQuiz();
});

/* 1. Mobile navigation */
function toggleMenu() {
    var sidebar = document.getElementById("sidebar");
    var overlay = document.getElementById("overlay");

    if (!sidebar) {
        return;
    }

    sidebar.classList.toggle("open");

    if (overlay) {
        overlay.classList.toggle("show");
    }
}

function setupMenu() {
    var overlay = document.getElementById("overlay");
    if (overlay) {
        overlay.addEventListener("click", toggleMenu);
    }
}

/* 2. Scroll reveal */
function setupScrollReveal() {
    var items = document.querySelectorAll(".reveal");

    function showItems() {
        var windowHeight = window.innerHeight;

        items.forEach(function (item) {
            var top = item.getBoundingClientRect().top;
            if (top < windowHeight - 60) {
                item.classList.add("visible");
            }
        });
    }

    showItems();
    window.addEventListener("scroll", showItems);
}

/* 3. Search / filter visible cards */
function searchContent() {
    var input = document.getElementById("searchInput");
    if (!input) {
        return;
    }

    var text = input.value.toLowerCase();
    var cards = document.querySelectorAll(".search-item");

    cards.forEach(function (card) {
        var content = card.innerText.toLowerCase();
        if (content.indexOf(text) !== -1) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }
    });
}

function setupSearch() {
    var input = document.getElementById("searchInput");
    if (input) {
        input.addEventListener("keyup", searchContent);
    }
}

/* 4. Progress bar animation */
function setupProgressBars() {
    var bars = document.querySelectorAll(".progress-fill");

    bars.forEach(function (bar) {
        var value = bar.getAttribute("data-progress");
        setTimeout(function () {
            bar.style.width = value + "%";
        }, 200);
    });
}

/* 5. Recents using localStorage */
function saveRecent(title, type, link) {
    var recents = JSON.parse(localStorage.getItem("securexRecents") || "[]");

    recents = recents.filter(function (item) {
        return item.title !== title;
    });

    recents.unshift({
        title: title,
        type: type,
        link: link,
        time: new Date().toLocaleString()
    });

    if (recents.length > 8) {
        recents = recents.slice(0, 8);
    }

    localStorage.setItem("securexRecents", JSON.stringify(recents));
}

function displayRecents() {
    var list = document.getElementById("recentsList");
    if (!list) {
        return;
    }

    var recents = JSON.parse(localStorage.getItem("securexRecents") || "[]");

    if (recents.length === 0) {
        list.innerHTML =
            '<p class="empty-note">No saved activity yet. Open a course, tutorial, or library item and it will appear here. Sample topics: Introduction to Platform Security, Computing Platform Layers, Hardware Security, Virtualization Architecture, and Security Best Practices.</p>';
        return;
    }

    list.innerHTML = "";

    recents.forEach(function (item) {
        var card = document.createElement("article");
        card.className = "recent-card search-item";
        card.innerHTML =
            '<div class="icon icon-blue">🕘</div>' +
            "<h3>" + item.title + "</h3>" +
            "<p>" + item.type + "</p>" +
            "<p>" + item.time + "</p>" +
            '<a class="btn btn-outline" href="' + item.link + '">Open Again</a>';
        list.appendChild(card);
    });
}

function clearRecents() {
    localStorage.removeItem("securexRecents");
    displayRecents();
}

/* 6. Course lessons (accordion) */
function toggleLesson(button, title, link) {
    var panel = button.parentElement.querySelector(".lesson-panel");
    if (!panel) {
        return;
    }

    var isOpen = panel.classList.contains("open");
    panel.classList.toggle("open", !isOpen);
    button.textContent = isOpen ? "Open Lesson" : "Hide Lesson";
    saveRecent(title, "Course", link);
}

function setupLessonButtons() {
    var buttons = document.querySelectorAll(".open-lesson");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            toggleLesson(
                button,
                button.getAttribute("data-title"),
                button.getAttribute("data-link")
            );
        });
    });
}

/* 7. Library expandable information */
function setupLibraryButtons() {
    var buttons = document.querySelectorAll(".read-more");
    buttons.forEach(function (button) {
        button.addEventListener("click", function () {
            var extra = button.parentElement.querySelector(".more-info");
            if (!extra) {
                return;
            }

            extra.classList.toggle("open");
            button.textContent = extra.classList.contains("open") ? "Show Less" : "Read More";
            saveRecent(
                button.getAttribute("data-title"),
                "Library",
                "library.html"
            );
        });
    });
}

/* 8. Tutorials: remember when a student opens a card */
function setupTutorialTracking() {
    var cards = document.querySelectorAll(".tutorial-card");
    cards.forEach(function (card) {
        card.addEventListener("click", function () {
            saveRecent(
                card.getAttribute("data-title"),
                "Tutorial",
                "tutorials.html"
            );
        });
    });
}

/* 9 and 10. Quiz scoring and reset */
function setupQuiz() {
    var form = document.getElementById("quizForm");
    if (!form) {
        return;
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();
        checkQuiz();
    });
}

function checkQuiz() {
    var answers = {
        q1: "a",
        q2: "c",
        q3: "b",
        q4: "d",
        q5: "a",
        q6: "b",
        q7: "c",
        q8: "a",
        q9: "d",
        q10: "b"
    };

    var score = 0;
    var total = 10;
    var questionNumber;

    for (questionNumber = 1; questionNumber <= total; questionNumber++) {
        var selected = document.querySelector('input[name="q' + questionNumber + '"]:checked');
        if (selected && selected.value === answers["q" + questionNumber]) {
            score = score + 1;
        }
    }

    var resultBox = document.getElementById("quizResult");
    var scoreText = document.getElementById("scoreText");
    var messageText = document.getElementById("scoreMessage");

    scoreText.textContent = "Your Score: " + score + "/" + total;
    messageText.textContent = getScoreMessage(score);
    resultBox.classList.add("show");
    saveRecent("Platform Security Quiz", "Quiz", "quizzes.html");
    resultBox.scrollIntoView({ behavior: "smooth" });
}

function getScoreMessage(score) {
    if (score >= 9) {
        return "Excellent work! You understand the core ideas of platform security.";
    }
    if (score >= 7) {
        return "Great job! Review the lessons you missed and try again.";
    }
    if (score >= 5) {
        return "Good start. Revisit Courses and Tutorials, then retake the quiz.";
    }
    return "Keep going. Open the Dashboard and Courses again, then try a second attempt.";
}

function resetQuiz() {
    var form = document.getElementById("quizForm");
    var resultBox = document.getElementById("quizResult");

    if (form) {
        form.reset();
    }
    if (resultBox) {
        resultBox.classList.remove("show");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
}
