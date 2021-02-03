let options = {
    coinElement: "img",
    coinUrl: 'assets/img/coin.png',
    coinWidth: 50,
    coinHeight: 50,
    coinStyle: 'position: absolute; top: 0px;',

    goblinElement: "img",
    goblinUrl: 'assets/img/goblin.png',
    goblinWidth: 75,
    goblinHeight: 100,
    goblinStyle: "position: absolute; top: 0px; left:",
    goblinPosition: 600,

    heartElement: "img",
    heartUrl: 'assets/img/heart.png',
    heartWidth: 50,
    heartHeight: 50,
    heartStyle: 'position: absolute; top: 0px;',
};

let hearts = {
    "0": {
        "img": "assets/img/heart.png",
    },
    "1": {
        "img": "assets/img/heart.png",
    },
    "2": {
        "img": "assets/img/heart.png",
    }
};

let countOfElems = document.createElement('p');
let counterLbl = document.createElement('div');
let ultimateLbl = document.createElement('p');
let ultimateLblStatus = document.createElement('div');
let pauseLblStatus = document.createElement('div');
let timerLbl = document.createElement('div');
let skippedLbl = document.createElement('div');
let heartsLib = document.getElementById("hearts");
let scoreLib = document.getElementById("score");

let stop = false;

const game = document.querySelectorAll('.game')[0];
const startgameForm = document.querySelectorAll('.start_game')[0];
let counterLabel;

let nickname;
let goblin;
let visibleObjects = [];

const speed = 75;
let count = 0;
let catched = 0;
let startDelay = 100;
let generatingDelay = 1000;
let ult_cool_down = false;
let ult_pressed = 0;
let skipped = 0;

let sec_Tmp = 0;


let out = '';
for (let key in hearts) {

    // <img src="">
    out += '<img src="' + hearts[key].img + '">';

}
heartsLib.innerHTML = out;


function startGame() {
    setInterval(function () {
        if (!stop) {
            sec_Tmp++;
            timer(sec_Tmp);

            let winGame = setTimeout(function () {
                if (!stop) {
                    clearInterval(winGame);
                    stop = true;

                    startgameForm.hidden = true;
                    game.hidden = true;
                    const losingForm = document.querySelector('.losing');
                    losingForm.innerHTML = nickname + ", ваш результат: <br>"
                    losingForm.innerHTML = losingForm.innerHTML + "Всего было произведено: " + count + " элементов <br>";
                    losingForm.innerHTML = losingForm.innerHTML + "Поймано: " + catched;

                    countOfElems.hidden = true;
                    counterLbl.hidden = true;

                    ultimateLbl.hidden = true;
                    ultimateLblStatus.hidden = true;
                    pauseLblStatus.hidden = true;
                    alert("Игра выиграна");
                    return;
                }
            }, 10000);

            let coin = document.createElement(options.coinElement);
            coin.setAttribute('src', options.coinUrl);
            coin.setAttribute('height', options.coinHeight + 'px');
            coin.setAttribute('width', options.coinWidth + 'px');
            coin.setAttribute('style', options.coinStyle);
            coin.setAttribute('id', count.toString());
            let randomLeft = getRandomArbitrary(game.getBoundingClientRect()['left'], game.getBoundingClientRect()['left'] + 750);
            coin.style.left = randomLeft + "px";
            coin.style.top = "5px";
            game.insertAdjacentElement('beforeend', coin);


            visibleObjects.push([coin, setTimeout(function () {
                const moving = setInterval(function () {
                    if (!stop) {

                        if (skipped === 3) {
                            stop = true;
                            alert("Игра проиграна");
                            visibleObjects.forEach(value => {
                                if (value != null) {
                                    game.removeChild(value[0]);
                                }
                            });

                            startgameForm.hidden = true;
                            game.hidden = true;
                            const losingForm = document.querySelector('.losing');
                            losingForm.innerHTML = nickname + ", ваш результат: <br>"
                            losingForm.innerHTML = losingForm.innerHTML + "Всего было произведено: " + count + " элементов <br>";
                            losingForm.innerHTML = losingForm.innerHTML + "Поймано: " + catched;
                            countOfElems.hidden = true;
                            counterLbl.hidden = true;

                            ultimateLbl.hidden = true;
                            ultimateLblStatus.hidden = true;
                            pauseLblStatus.hidden = true;
                            return;
                        }

                        let topCount = parseInt(coin.style.top.substring(0, coin.style.top.length - 2));


                        if (Math.abs(goblin.getBoundingClientRect()['y'] - coin.getBoundingClientRect()["y"]) < 25) {

                            if (Math.abs(goblin.getBoundingClientRect()['x'] - coin.getBoundingClientRect()["x"]) < 50) {
                                catched++;
                                game.removeChild(coin);
                                visibleObjects[parseInt(coin.getAttribute("id"))] = null;
                                clearInterval(moving);
                                counterLabel.innerText = catched.toString();
                                scoreLib.innerText = "Счёт: " + catched.toString();
                            }
                        }


                        if (topCount > game.getBoundingClientRect()['bottom'] - 50) {
                            skippedLbl.innerHTML = "Кол-во пропущенных: " + (skipped + 1);
                            skipped++;
                            heartsLib.firstChild.remove();
                            game.removeChild(coin);
                            visibleObjects[parseInt(coin.getAttribute("id"))] = null;
                            clearInterval(moving);
                        }

                        if (ult_pressed) {
                            coin.style.left = goblin.style.left;
                        }

                        topCount = topCount + getRandomArbitrary(1, 5);
                        coin.style.top = topCount.toString() + "px";
                    }
                }, getRandomArbitrary(1, 50))
            }, startDelay)]);
            count++;
        }
    }, generatingDelay);

}

function execute() {

    goblin.setAttribute('src', options.goblinUrl);
    goblin.setAttribute('style', options.goblinStyle + game.getBoundingClientRect()['left'] + "px;right:0px;");
    goblin.setAttribute('height', options.goblinHeight + 'px');
    goblin.setAttribute('width', options.goblinWidth + 'px');

    goblin.style.top = options.goblinPosition + "px";

    game.insertAdjacentElement('beforeend', goblin);


    function moveLeft() {
        if (!stop || !ult_pressed) {
            let incLeft = parseInt(goblin.style.left.substring(0, goblin.style.left.length - 2));

            if (incLeft - speed > game.getBoundingClientRect()['left'])
                goblin.style.left = incLeft - speed + "px";
            else
                goblin.style.left = game.getBoundingClientRect()['left'] + "px";
        }
    }

    function moveRight() {
        if (!stop || !ult_pressed) {
            let incRight = parseInt(goblin.style.left.substring(0, goblin.style.left.length - 2));
            if (incRight + speed < game.getBoundingClientRect()['left'] + 725)
                goblin.style.left = incRight + speed + "px";
            else
                goblin.style.left = game.getBoundingClientRect()['left'] + 725 + "px";
        }
    }

    function setUltTimeout() {
        if (ult_pressed) {
            setTimeout(function () {
                ult_cool_down = true;
                ult_pressed = false;
                document.querySelector('.ult').innerHTML = "Ульта: Восстановление";
            }, 4000);
        }
    }

    // Нажатие кнопки ульты
    document.addEventListener('keydown', ev => {
        if (ev.key === " " && !ult_pressed && !ult_cool_down) {
            document.querySelector('.ult').innerHTML = "Ульта: Нажата";
            ult_pressed = true;
            setUltTimeout();
        }
    });

    // Событие когда отжимаешь кнопку ульты
    document.addEventListener('keyup', ev => {
        if (ev.key === " " || ult_cool_down || ult_pressed) {

            ult_pressed = false;
            ult_cool_down = true;
            document.querySelector('.ult').innerHTML = "Ульта: Восстановление";
            setTimeout(function () {
                ult_cool_down = false;
                document.querySelector('.ult').innerHTML = "Ульта: Готова";
            }, 5000);
        }
        if (ev.key === " " && !ult_cool_down) {
            document.querySelector('.ult').innerHTML = "Ульта: Восстановление";
        }
    });

    document.addEventListener("keydown", ev => {
        switch (ev.key) {
            case "a":
                moveLeft();
                break;
            case "ArrowLeft":
                moveLeft();
                break;
            case "A":
                moveLeft();
                break;
            case "d" :
                moveRight();
                break;
            case "D":
                moveRight();
                break;
            case "ArrowRight":
                moveRight();
                break;
            case "В":
                moveRight();
                break;
            case "в":
                moveRight();
                break;
            case "ф":
                moveLeft();
                break;
            case "Ф":
                moveLeft();
                break;
            case "Escape":
                stop ^= true;
                document.querySelectorAll(".pause")[0].hidden ^= true;
                break;
        }
    });
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function hideForm() {
    nickname = document.querySelector('.start_game>input').value;
    if (nickname !== "") {
        document.cookie = "nick=" + nickname;
        startgameForm.hidden = true;
        game.hidden = false;
        goblin = document.createElement(options.goblinElement);
        execute();
        startGame();
        stop = false;


        timerLbl.innerHTML = "00:00";
        countOfElems.innerText = "Объектов поймано:"

        counterLbl.innerText = "0";
        counterLabel = counterLbl;

        ultimateLblStatus.innerText = "Ульта: Готова";
        ultimateLblStatus.className = "ult"

        pauseLblStatus.innerText = "ПАУЗА";
        pauseLblStatus.className = "pause"
        pauseLblStatus.hidden = true;
        pauseLblStatus.style = "text-align:center; position: absolute; left: 50%; top: 25%;";

        skippedLbl.innerHTML = "Кол-во пропущенных: " + skipped;

        
        document.body.insertAdjacentElement('beforeend', ultimateLblStatus);
        document.body.insertAdjacentElement('beforeend', pauseLblStatus);
        document.body.insertAdjacentElement('beforeend', timerLbl);
        document.body.insertAdjacentElement('beforeend', skippedLbl);

    }
}

function timer(sec) {

    if (sec !== 11) {
        timerLbl.innerHTML = "Время: " + sec + " | 10";
    }
}

document.querySelector('.start_game>input').value = document.cookie.substring(5)