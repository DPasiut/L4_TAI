let preQuestions = fetch('https://quiztai.herokuapp.com/api/quiz')
    .then(resp => resp.json())
    .then(resp => {
        preQuestions = resp;
        setQuestion(0);
        enableAnswer();

        previous.addEventListener('click', function () {
            index--;
            if (index >= 0) {
                setQuestion(index);
                enableAnswer();
            } else {
                index = 0;
            }

            if (userAnswer[index]) {
                if (userAnswer[index].correctAnswer) {
                    markCorrect(userAnswer[index].elementTarget);
                } else {
                    markIncorrect(userAnswer[index].elementTarget);
                }
                disableAnswer();
            }

        });
        next.addEventListener('click', function () {
            let currentAns = document.getElementById('ans_' + index);
            if (userAnswer[index]){
                if(userAnswer[index].correctAnswer){
                    currentAns.style.backgroundColor = 'green';
                }else {
                    currentAns.style.backgroundColor = 'red';
                }
            }else {
                currentAns.style.backgroundColor = 'pink';
            }

            index++;
            if (index >= preQuestions.length) {
                list.style.display = 'none';
                results.style.display = 'block';
                userScorePoint.innerHTML = points;
                clearInterval(interval);
                document.getElementById('Label1').innerHTML = "Time's up";


                if (games == null) {
                    games = 1;
                    localStorage.setItem('games', '1');
                } else {
                    games++;
                    localStorage.setItem('games', games);
                }

                if (average == null) {
                    localStorage.setItem('average', points);
                    userAverage.innerText = points;
                } else {
                    let av = ((games - 1) * average + points) / games;
                    localStorage.setItem('average', av.toString());
                    userAverage.innerText = av;
                }
            } else {
                setQuestion(index);
                enableAnswer();
            }

            if (userAnswer[index]) {
                if (userAnswer[index].correctAnswer) {
                    markCorrect(userAnswer[index].elementTarget);
                } else {
                    markIncorrect(userAnswer[index].elementTarget);
                }
                disableAnswer();
            }

        });
        restart.addEventListener('click', function (event) {
            event.preventDefault();

            userAnswer = null;
            userAnswer = new Array(preQuestions.length);
            let correctAns = document.getElementById('correctAns');
            correctAns.style.display = 'none';
            time = timeForAnswer;
            index = 0;
            points = 0;
            let userScorePoint = document.querySelector('.score');
            userScorePoint.innerHTML = points;
            setQuestion(index);
            enableAnswer();
            list.style.display = 'block';
            results.style.display = 'none';
            setTimeForAnswer();

            for (let i = 0; i < preQuestions.length; i++){
                let circle = document.getElementById('ans_'+i);
                circle.style.backgroundColor = 'white';

            }
        });

        for (let i = 0; i < preQuestions.length; i++){
            let circle = document.createElement('div');
            circle.setAttribute('class', 'circle');
            circle.setAttribute('id', 'ans_' + i.toString());
            circle.innerHTML = (i+1).toString();
            ansContainer.appendChild(circle);
        }

    });

let time;
let interval;
let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;

let userScorePoint = document.querySelector('.userScorePoint');
let list = document.querySelector('.list');
let results = document.querySelector('.results');
let userAverage = document.querySelector('.average')
let userAnswer = new Array(preQuestions.length);
let games = localStorage.getItem('games');
let average = localStorage.getItem('average');
let timeForAnswer = 20;
let questionNumber = document.querySelector('#index');
let ansContainer = document.getElementById('ansContainer');
let currentsize = 100;


questionNumber.innerHTML = index + 1;

function showCorrectAnswers(){
    let correctAns = document.getElementById('correctAns');
    correctAns.style.display = 'block';
    correctAns.innerHTML = '';

    for (let i = 0; i < preQuestions.length; i++){
        correctAns.innerHTML += ' Question: <span id="index">' + (i+1).toString() + '</span> <h4 class="question">'+ preQuestions[i].question + '</h4>';

        correctAns.innerHTML +=   'Answers: ';
        let listGroup = document.createElement('ul');
        listGroup.setAttribute('class', 'list-group');
        correctAns.appendChild(listGroup);

        for(let k = 0; k < preQuestions[i].answers.length; k ++){
            let listGroupItem = document.createElement('li');
            listGroupItem.setAttribute('class', 'list-group-item');
            listGroupItem.innerHTML = preQuestions[i].answers[k];
            listGroup.appendChild(listGroupItem);

            if(preQuestions[i].answers[k] === preQuestions[i].correct_answer){
                markCorrect(listGroupItem);
            }
            if(userAnswer[i]) {
                if (userAnswer[i].correctAnswer === false && userAnswer[i].elementTarget.attributes.ansnumber.nodeValue === k.toString()) {
                    markIncorrect(listGroupItem);
                }
            }

        }
    }

}

setTimeForAnswer();

function setTimeForAnswer() {

    time = timeForAnswer;


    interval = setInterval(function () {
        document.getElementById('Label1').innerHTML = "" + time + " seconds";
        startround();
        time--;

        if (time < 0) {
            if(index >= preQuestions.length){
                clearInterval(interval);
                clearInterval(timestarttotal);
                document.getElementById('Label1').innerHTML = "Time's up";
                next.click();
                return 0;
            }else {
                time = timeForAnswer;
                next.click();
            }
        }
    }, 1000)

    function startround(){
        currentsize = ((time)/ timeForAnswer)* 100;
        let temp = document.getElementById('sliderId');
        temp.style.width = currentsize + "%";
    }

}

function enableAnswer() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].addEventListener('click', doAction);
        clearAnswers();
    }
}

function disableAnswer() {
    for (let i = 0; i < answers.length; i++) {
        answers[i].removeEventListener('click', doAction);
    }
}

function setQuestion(index) {

    question.innerHTML = preQuestions[index].question;
    questionNumber.innerHTML = index + 1;

    if (preQuestions[index].answers.length === 2) {
        answers[2].style.display = 'none';
        answers[3].style.display = 'none';
    } else {
        answers[2].style.display = 'block';
        answers[3].style.display = 'block';
    }

    question.innerHTML = preQuestions[index].question;
    answers[0].innerHTML = preQuestions[index].answers[0]
    answers[1].innerHTML = preQuestions[index].answers[1]
    answers[2].innerHTML = preQuestions[index].answers[2]
    answers[3].innerHTML = preQuestions[index].answers[3]
}

function markCorrect(elem) {
    elem.classList.add('correct');
}

function markIncorrect(elem) {
    elem.classList.add('incorrect');
}

function clearAnswers() {
    for (let i = 0; i < answers.length; i++) {

        let elem = answers[i];
        if (elem.classList.contains('correct')) {
            elem.classList.remove('correct');
        }
        if (elem.classList.contains('incorrect')) {
            elem.classList.remove('incorrect');
        }
    }
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
        userAnswer[index] = {elementTarget: event.target, correctAnswer: true};

    } else {
        markIncorrect(event.target);
        userAnswer[index] = {elementTarget: event.target, correctAnswer: false};
    }
    disableAnswer();
    setTimeout(function () {
        next.click();
        time = timeForAnswer;
    }, 500);
}

