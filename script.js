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
    questionStatus.className = 'preset-5-mobile text-grey-500';
    textDiv.appendChild(questionStatus);

    const currentText = document.createElement('h3');
    currentText.innerHTML = `${questions[currentQuestion].question}`;
    currentText.className = 'preset-3-mobile text-blue-900 mt-4 mb-6';
    textDiv.appendChild(currentText);

    const progressBar = document.createElement('div');
    progressBar.className = 'w-full h-4 bg-white rounded-[20px] flex items-center px-1.5';
    const progress = document.createElement('div');
    progress.className = 'h-2 bg-purple-600 rounded-[20px]';
    progress.style.width = '10%';
    progressBar.appendChild(progress);
    textDiv.appendChild(progressBar);

    createCards(questions[currentQuestion]);

}

function createCards(question){
    question.options.forEach((optionText, index)=>{
        const card = document.createElement('button');
        card.className = 'md:h-[88px] lg:h-[104px] lg:w-[564px] bg-white w-full h-[72px] cursor-pointer p-4 rounded-xl flex items-center flex-row gap-4 md:gap-8 border-3 border-transparent hover:border-purple-600';
        card.innerHTML = `
            <span class="preset-4-mobile text-grey-500 w-10 h-10 bg-grey-50 rounded-md flex justify-center items-center md:w-14 md:h-14 md:rounded-xl">
                ${String.fromCharCode(65 + index)}
            </span>
            <h3 class="preset-4-mobile text-blue-900 md:text-[28px] text-left">
                ${optionText}
            </h3>`;
        card.addEventListener('click', function(){
            optionsDiv.querySelectorAll('button').forEach(button=>{
                button.classList.remove('border-purple-600!');
            })
            this.classList.add('border-purple-600!');
        });

        optionsDiv.appendChild(card);
        });

}
