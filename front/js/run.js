let pause = false;    
const totalTimerHTML = document.querySelector('#total-timer'),
      timerHTML = document.querySelector('#timer'),
      setHTML = document.querySelector('#set'),
      setsHTML = document.querySelector('#sets'),
      cycleHTML = document.querySelector('#cycle'),
      cyclesHTML = document.querySelector('#cycles'),
      activityHTML = document.querySelector('#activity'),
      btnStart = document.querySelector('#button-start'),
      btnPause = document.querySelector('#button-pause');

btnPause.onclick = () => pause = true;


/**
 * Сalculates the total duration of the workout and sets
 * 
 * @param {Object} data 
 * @returns array
 */
function calcTime(data) {
    let timeSet = data.prepare + (data.work * data.cycles + data.rest) * data.cycles;
    let timeTotal;
    if (data.sets > 1) {
        timeTotal = timeSet + data.restbetweensets * (data.sets - 1);
    } else {
        timeTotal = timeSet;
    }
    return [timeSet, timeTotal]
}


/**
 * Set pause on click button
 */
function pauser() {
    // https://www.geeksforgeeks.org/how-to-pause-and-play-a-loop-in-javascript-using-event-listeners/
    return new Promise(resolve => {
        let playbuttonclick = function () {
            btnPause.style.display = 'block';
            btnStart.style.display = 'none';

            btnStart.removeEventListener("click", playbuttonclick);

            pause = false;
            resolve("resolved");
        }
        
        btnPause.style.display = 'none';
        btnStart.style.display = 'block';
        btnStart.addEventListener("click", playbuttonclick)
    })
}

const timer = ms => new Promise(res => setTimeout(res, ms));


async function playSound(name){
    let audio = new Audio('/media/' + name);
    audio.play();
}

/**
 * Converts seconds to time (minutes and seconds)
 * 
 * @param {int} seconds 
 * @returns {str} minutes:seconds
 */
function convertSecondsToTime(seconds) {
    let min = ~~(seconds / 60);
    let sec = ~~seconds % 60;
    if (sec < 10) {
        sec = '0' + sec;
    }
    return `${min}:${sec}`
}

/**
 * 
 * @param {int} seconds
 * @param {int} totalTime 
 * @returns {int} Remaining time
 */
async function countDown(seconds, totalTime) {
    while (seconds > 0) {
        if (pause == true) await pauser();
        if (seconds == 3) playSound('countdown.wav');
        await timer(1000);
        let sec = seconds > 60 ? convertSecondsToTime(--seconds) : --seconds;
        timerHTML.textContent = sec;
        totalTimerHTML.textContent = convertSecondsToTime(--totalTime);
    }
    return totalTime;
}

/**
 * Check if the current cycle is the last, then do not rest
 * 
 * @param {int} current - Current cycle
 * @param {int} cycles - All cycles
 * @param {int} rest - Rest time
 * @returns {int} 
 */
async function restTime(current, cycles, rest) {
   return current == cycles ? 0 : rest
}

/**
 * 
 * @param {Object} data 
 */
async function insertTimerData(data) {
    let totalTime = calcTime(data)[1];
    
    setsHTML.textContent = data.sets;
    cyclesHTML.textContent = data.cycles;
    totalTimerHTML.textContent = convertSecondsToTime(totalTime);

    activityHTML.textContent = 'Prepare';
    timerHTML.textContent = data.prepare;
    
    document.querySelector('.overlay').classList.add('show');
    totalTime = await countDown(data.prepare, totalTime);

    for (let s = 1; s <= data.sets; s++) {
        setHTML.textContent = s;

        for (let c = 1; c <= data.cycles; c++) {
            let rest = await restTime(c, data.cycles, data.rest);
            cycleHTML.textContent = c;
            activityHTML.textContent = 'Work';
            playSound('work.mp3');
            totalTime = await countDown(data.work, totalTime);
            activityHTML.textContent = 'Rest';
            playSound('rest.mp3');
            totalTime = await countDown(rest, totalTime);
        }
        if (s < data.sets) {
            totalTime = await countDown(data.restbetweensets, totalTime);
        } else {
            playSound('final.mp3');
        }
        
    }
}

/**
 * Getting timer data
 */
async function getProgram() {
    let params = (new URL(document.location)).searchParams,
        id = params.get('id'),
        res = await eel.get_tabata_program(JSON.stringify(id))();
        data = JSON.parse(res);
        insertTimerData(data);
}

getProgram();