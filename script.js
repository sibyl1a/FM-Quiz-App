const buttons = document.querySelectorAll('button');
const theme = document.getElementById('theme');
const topicLabel = document.getElementById('topicLabel');
const topicContainer = document.getElementById('topicContainer');
const topicIcon = document.getElementById('topicIcon');
const topicTitle = document.getElementById('topicTitle');
const quizDiv = document.getElementById('quizDiv');

let quizTopic = undefined;
let quizData = undefined;
let questions = [];
let currentQuestion = 0;

fetch('/data.json').then(response => response.json()).then(data => {
    quizData = data;
});

buttons.forEach(button=>{
    button.addEventListener('click', (e)=>{
        e.preventDefault();

        const {title, icon, bg} = button.dataset;
        topicTitle.textContent = title;
        topicIcon.src = icon;
        topicContainer.className = `w-10 h-10 ${bg} rounded-md flex justify-center items-center md:w-14 md:h-14 md:rounded-xl`;
        topicLabel.classList.remove('hidden');
        topicLabel.classList.add('flex');
        theme.classList.add('justify-between');
        const quizTopic = button.value;

        startQuiz(quizTopic, quizData);
    })
});

function startQuiz(quizTopic, quizData){
    quizObject = quizData.quizzes.find(quiz => quiz.title.toLowerCase() === quizTopic.toLowerCase());
    questions = quizObject.questions;
    console.log(questions);
    visual(quizTopic);
};

function visual(quizTopic){
    textDiv.innerHTML = '';
    optionsDiv.innerHTML = '';
    const questionStatus = document.createElement('span');
    questionStatus.innerHTML = `Question ${currentQuestion+1} of 10`;
    questionStatus.className = 'preset-5-mobile text-grey-500 mb-4';
    textDiv.appendChild(questionStatus);

    const currentText = document.createElement('h3');
    currentText.innerHTML = `${questions[currentQuestion].question}`;
    currentText.className = 'preset-3-mobile text-blue-900';
    textDiv.appendChild(currentText);

}

