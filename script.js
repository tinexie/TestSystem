let currentSlide = 0;
const slides = document.querySelectorAll(".slide");

let score = 0;
let checkedSlides = new Set();

function showSlide(index) {
    slides.forEach((s, i) => {
        s.classList.toggle("active", i === index);
    });

    const nextBtn = document.getElementById("nextBtn");

    if (nextBtn) nextBtn.disabled = false;

    if (index === slides.length - 1) {
        nextBtn.style.display = "none";
        document.getElementById("finishBtn").style.display = "inline-block";
    } else {
        nextBtn.style.display = "inline-block";
        document.getElementById("finishBtn").style.display = "none";
    }
}

function nextSlide() {
    if (currentSlide < slides.length - 1) {
        currentSlide++;
        showSlide(currentSlide);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        currentSlide--;
        showSlide(currentSlide);
    }
}

function checkAnswer() {
    const slide = slides[currentSlide];

    // если уже проверяли этот вопрос — ничего не делаем
    if (checkedSlides.has(currentSlide)) return;

    const type = slide.dataset.type;
    const correct = slide.dataset.correct;

    let result = false;

    // RADIO
    if (type === "radio") {
        const checked = slide.querySelector("input[type='radio']:checked");
        if (checked && checked.value === correct) result = true;
    }

    // CHECKBOX
    if (type === "checkbox") {
        const checked = slide.querySelectorAll("input[type='checkbox']:checked");
        let answer = "";
        checked.forEach(c => answer += c.value);

        if (answer.split("").sort().join("") === correct.split("").sort().join("")) {
            result = true;
        }
    }

    // TEXT
    if (type === "text") {
        const input = slide.querySelector("input");
        if (input && input.value.trim().toLowerCase() === correct.toLowerCase()) {
            result = true;
        }
    }

    // MATCH
    if (type === "match") {
        const inputs = slide.querySelectorAll(".match-input");
        let user = "";
        inputs.forEach(i => user += i.value.trim());

        if (user === correct) result = true;
    }

    checkedSlides.add(currentSlide);

    if (result) score++;

    showResult(result);
}

function showResult(isCorrect) {
    const slide = slides[currentSlide];

    let box = slide.querySelector(".result-box");

    if (!box) {
        box = document.createElement("div");
        box.classList.add("result-box");
        slide.appendChild(box);
    }

    if (isCorrect) {
        box.textContent = "✔ правильно";
        box.style.color = "#355c52";
    } else {
        box.textContent = "✖ неправильно";
        box.style.color = "#a6402d";
    }
}

function finishTest() {
    const container = document.querySelector(".container");

    const percent = Math.round((score / slides.length) * 100);

    container.innerHTML = `
        <div class="final-result">
            <h2>Результат теста</h2>
            <p>Правильных ответов: ${score} / ${slides.length}</p>
            <p>Успеваемость: ${percent}%</p>
        </div>
    `;
}

window.addEventListener("DOMContentLoaded", () => {
    showSlide(0);
});