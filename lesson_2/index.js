const readline = require('readline');
const colors = require('colors');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

console.log('Введите орел - "1" или решка - "0": ');
rl.on('line', (answer) => {
    const randomNum =  Math.random() * 10;
    const isEagle = randomNum > 5 ? true : false
    const result = `Выпало: ${isEagle ? 'орел': 'решка'}\n`;
    let message;


    if (answer !== '0' && answer !== '1') {
        message = 'Введите "1" или "0"'
        console.log(colors.yellow(message));
    } else {
        console.log('бросаем монету...')
        setTimeout(() => {
    
            if ((answer === '0' && !isEagle) || (answer === '1' && isEagle)) {
                message = result + 'Вы выиграли! (~‾▿‾)~'
            } else {
                message = result + 'Удачи в сдедующий раз ¯|_(ツ)_/¯'
            }
    
            console.log(colors.yellow(message));
            rl.close();
        }, 1000)
    }

  });