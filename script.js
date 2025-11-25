const topicButtons = document.querySelectorAll('.topic-button');
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
let answer = undefined;
let score = 0;
let selectedCard = undefined;

fetch('/data.json').then(response => response.json()).then(data => {
    quizData = data;
});

topicButtons.forEach(button=>{
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
    progress.style.width = `${(currentQuestion + 1) * 10}%`;
    progressBar.appendChild(progress);
    textDiv.appendChild(progressBar);

    const submitBtn = document.createElement('button');
    submitBtn.className = 'w-full h-14 bg-purple-600 preset-4-mobile text-white rounded-[12px] cursor-pointer';
    submitBtn.textContent = "Submit Answer";
    createCards(questions[currentQuestion]);
    optionsDiv.appendChild(submitBtn);
    checkAnswer(submitBtn);

};

function createCards(question){
    question.options.forEach((optionText, index)=>{
        const card = document.createElement('button');
        card.className = 'option-card md:h-[88px] lg:h-[104px] lg:w-[564px] bg-white w-full h-[72px] cursor-pointer p-4 rounded-xl flex items-center flex-row gap-4 md:gap-8 border-3 border-transparent hover:border-purple-600';
        card.innerHTML = `
            <span class="preset-4-mobile text-grey-500 w-10 h-10 shrink-0 overflow-hidden flex-none bg-grey-50 rounded-md flex justify-center items-center md:w-14 md:h-14 md:rounded-xl">
                ${String.fromCharCode(65 + index)}
            </span>
            <h3 class="preset-4-mobile text-blue-900 md:text-[28px] text-left">
                ${optionText
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')}
                
            </h3>`;
        card.addEventListener('click', function(){
            optionsDiv.querySelectorAll('button').forEach(button=>{
                button.classList.remove('border-purple-600!');
                const span = button.querySelector('span');
                if(span){
                    span.classList.remove('bg-purple-600');
                    span.classList.remove('text-white');
                }
            });

            answer = optionText;
            selectedCard = this;
            this.classList.add('border-purple-600!');
            this.querySelector('span').classList.add('bg-purple-600');
            this.querySelector('span').classList.add('text-white');
        });

        optionsDiv.appendChild(card);
        });
};

function alertMessage(){
    if (document.querySelector('.alert')) return;
    const alert = document.createElement('div');
    alert.className = 'alert w-full justify-center items-center flex flex-row gap-2';
    alert.innerHTML = `
    <img src="images/icon-error.svg" class="w-8 h-8"/>
    <span class="preset-4-mobile text-red-500">Please select an answer</span>
    `;
    optionsDiv.appendChild(alert);
}
        
function checkAnswer(submitBtn){
    submitBtn.addEventListener('click', (e)=>{
        e.preventDefault();

        if(submitBtn.textContent==="Next Question" || submitBtn.textContent==="Show Results"){
            currentQuestion++;
            if(currentQuestion<questions.length){
                answer=undefined;
                selectedCard=undefined;
                visual();
            }else{
                showResult();
            }
            return;
        };

        if(!answer){
            alertMessage();
            return;
        }

        document.querySelector('.alert')?.remove();

        if(currentQuestion<questions.length){
            if(answer===questions[currentQuestion].answer){
                score+=1;
                if(selectedCard){
                    const correct = document.createElement('img');
                    correct.src='images/icon-correct.svg';
                    correct.className = 'w-6 h-6 ml-auto';
                    selectedCard.appendChild(correct);

                    const span = selectedCard.querySelector('span');
                    if(span){
                        span.classList.remove('bg-grey-50', 'bg-purple-600');
                        span.classList.add('bg-green-500');
                        selectedCard.classList.add('border-green-500');
                        selectedCard.classList.remove('border-transparent', 'border-purple-600!');
                    }
                } 
            }else{
                if(selectedCard){
                    const incorrect = document.createElement('img');
                    incorrect.src='images/icon-incorrect.svg';
                    incorrect.className = 'w-6 h-6 ml-auto';
                    selectedCard.appendChild(incorrect);
                    const span = selectedCard.querySelector('span');
                    if(span){
                        span.classList.add('bg-red-500');
                        selectedCard.classList.add('border-red-500!')

                    }
                }
            }

            optionsDiv.querySelectorAll('.option-card').forEach(card=>card.disabled = true);
            if(currentQuestion<questions.length-1){
                submitBtn.textContent = "Next Question";
            }else{
                submitBtn.textContent = "Show Results";
            }
            
        }
        
    })
    
}

