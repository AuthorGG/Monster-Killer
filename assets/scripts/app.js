const ATTACK_VALUE = 10;
const STRONG_ATTACK_VALUE = 17
const MONSTER_ATTACK_VALUE= 14;
const HEAL_VALUE= 20;

const MODE_ATTACK = 'ATTACK'; // MODE_ATTACK = 0
const MODE_STRONG_ATTACK = 'STRONG_ATTACK'; // MODE_STRONG_ATTACK = 1
const LOG_EVENT_PLAYER_ATTACK= 'PLAYER_ATTACK';
const LOG_EVENT_PLAYER_STRONG_ATTACK = 'PLAYER_STRONG_ATTACK';
const LOG_EVENT_MONSTER_ATTACK = 'MONSTER_ATTACK';
const LOG_EVENT_PLAYER_HEAL = 'PLAYER_HEAL';
const LOG_EVENT_GAME_OVER = 'GAME_OVER';


let lastLoggedEntry
let battleLog=[]

function getMaxLifeValues(){
    const enteredValue= prompt('Maximum life for you and the monster.', '100');
const parsedValue = parseInt(enteredValue);
    if (isNaN(parsedValue) || parsedValue <= 0){
    throw {message: 'Ivalid user input, not a number!'}
    }
    return parsedValue;
}

let chosenMaxLife;

try {
    chosenMaxLife = getMaxLifeValues(); 
}   catch (error) {
    console.log(error);
    chosenMaxLife=100; 
    alert('You entered something wrong, default HP set to 100')
} finally {
    alert('let the fight begin!!!')
}

let currentMonsterHealth= chosenMaxLife; 
let currentPlayerHealth= chosenMaxLife;
let hasBonusLife= true


function writeToLog(ev, val, monsterHealth,playerHealth){
let logEntry= {
    event: ev,
    value: val,
    finalMonsterHealth: monsterHealth, //Max lo tiene asi en el codigo por si luego no funciona cambiar a currentMonsterHealth?
    finalPlayerHealth: playerHealth,
};
switch (ev) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = 'MONSTER';
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: 'MONSTER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: ev,
        value: val,
        target: 'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: ev,
        value: val,
        target: 'PLAYER',
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: ev,
        value: val,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth
      };
      break;
    default:
      logEntry = {};
  }
// if(ev=== LOG_EVENT_PLAYER_ATTACK){
//   logEntry.target = 'MONSTER';
// } else if (ev === LOG_EVENT_PLAYER_STRONG_ATTACK){
//     logEntry.target = 'MONSTER';
// } else if (ev=== LOG_EVENT_PLAYER_HEAL){
//     logEntry.target = 'PLAYER'
//  } else if( ev=== LOG_EVENT_MONSTER_ATTACK){
//     logEntry.target= 'PLAYER'  
//     } else if( ev=== LOG_EVENT_GAME_OVER){
//     logEntry={
//         event: ev,
//         value: val,
//         finalMonsterHealth: monsterHealth,
//         finalPlayerHealth: playerHealth,   
//     };
// }
battleLog.push(logEntry);
}
adjustHealthBars(chosenMaxLife); 

function reset(){
currentMonsterHealth= chosenMaxLife; 
currentPlayerHealth= chosenMaxLife;
resetGame(chosenMaxLife);
}
function startOver(){
    currentMonsterHealth= chosenMaxLife;
    currentPlayerHealth= chosenMaxLife;
    if (hasBonusLife = false){
        hasBonusLife = true;
        giveBonusLife;
    }
}
function endRound(){
    const initialPlayerHealth = currentPlayerHealth;
    const playerDamage = dealPlayerDamage (MONSTER_ATTACK_VALUE);
    currentPlayerHealth -= playerDamage; 
    writeToLog(
      LOG_EVENT_MONSTER_ATTACK,
      playerDamage,
      currentMonsterHealth,
      currentPlayerHealth
    );

    if(currentPlayerHealth<= 0 && hasBonusLife){
        hasBonusLife = false;
        removeBonusLife();
        currentPlayerHealth= initialPlayerHealth
         setPlayerHealth(initialPlayerHealth);
        alert('YOU WOULD BE DEAD BY NOW, FINISH YOUR JOB'); 
    }

    if (currentMonsterHealth <= 0 && currentPlayerHealth > 0){
        alert('YOU WON!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'PLAYER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
   
    } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0){
        alert('YOU LOST!');
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'MONSTER WON',
            currentMonsterHealth,
            currentPlayerHealth
        )
    }else if (currentPlayerHealth <= 0 && currentMonsterHealth<= 0){
        alert('DRAW!')
        writeToLog(
            LOG_EVENT_GAME_OVER,
            'A DRAW',
            currentMonsterHealth,
            currentPlayerHealth
        );
    } 
    

    if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
            reset()
        }
}

function attackMonster(mode){
    const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE // operadores ternarios
    const logEvent =
    mode === MODE_ATTACK
        ? LOG_EVENT_PLAYER_ATTACK
        : LOG_EVENT_PLAYER_STRONG_ATTACK; //ambas formas son correctas. 

/*     if (mode === MODE_ATTACK) {
        maxDamage= ATTACK_VALUE;
        logEvent= LOG_EVENT_PLAYER_ATTACK;
    } else if (mode === MODE_STRONG_ATTACK) {
        maxDamage= STRONG_ATTACK_VALUE;
        logEvent= LOG_EVENT_PLAYER_STRONG_ATTACK;
    }; */
    const damage = dealMonsterDamage(maxDamage);
currentMonsterHealth -= damage;
writeToLog(
    logEvent,
    damage,
    currentMonsterHealth,
    currentPlayerHealth,
);
endRound();
 }

function attackHandler(){
    attackMonster(MODE_ATTACK);
}

function strongAttackHandler(){
    attackMonster(MODE_STRONG_ATTACK);
}

function healPlayerHandler(){
let healValue;
if (currentPlayerHealth>= chosenMaxLife - HEAL_VALUE){
    alert("You can´t heal more than your max initial heath.")
    healValue = chosenMaxLife - currentPlayerHealth
}else{
    healValue = HEAL_VALUE;
}

increasePlayerHealth(HEAL_VALUE);
currentPlayerHealth += HEAL_VALUE;
writeToLog(
  LOG_EVENT_PLAYER_HEAL,
  healValue,
  currentMonsterHealth,
  currentPlayerHealth
);
endRound()
}

function printLogHandler(){
    for(let i= 0; i < 3; i++){
        console.log('----------');
    }
    let j = 3;
    do {console.log(j);
        j++;
    }while(j<3)
    // for (let i = 0; i < battleLog.length; i++){
    //     console.log(battleLog[i]);
    // }
    let i=0;
    for(const logEntry of battleLog){
        if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
            console.log(`#${i}`);
            for (const key in logEntry){
               
                console.log(`${key} => ${logEntry[key]}`);
                
        }        
        lastLoggedEntry = i;
        break;
        }
        i++;
    }
}


attackBtn.addEventListener('click', attackHandler);
strongAttackBtn.addEventListener('click',strongAttackHandler);
healBtn.addEventListener('click', healPlayerHandler);
logBtn.addEventListener('click',printLogHandler);
resetBtn.addEventListener('click',reset);