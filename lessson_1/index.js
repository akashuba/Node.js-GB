//Lesson1
//Node JS
//import-export - ES6+, require - CommonJS
const ansi = require('ansi');
const colors = require('colors');
const ora = require('ora');

//Создаем курсор
console.log(colors.white.bold('ansi lib:'));

const cursor = ansi(process.stdout);

cursor
.white() //Color
.bg.green() //Background
.write('Hello world!')
.reset()
.bg.reset()
.write('\n');

//ДЗ
//1. Доработать этот скрипт
//2. Расширенное. Взять другую похожую библиотеку и использовать ее для изменения цвета шрифта
//https://www.npmjs.com/package/colors

//Важно. При сдаче ДЗ необходимо удалить папку node_modudes
cursor
	.red() 
	.write('Error message \n')
	.reset()
	.yellow() 
	.write('Warning message \n')
	.reset()
	.green().bold()
	.write('Fallout style text \n')
	.reset()
	.horizontalAbsolute(0).write('_____________________________________ \n')

// use colors lib
	console.log(colors.white.bold('Colors lib:'));
	console.log(colors.rainbow('https://www.npmjs.com/package/colors'));
	console.log(colors.white('_____________________________________'));

// use ora (spinner lib)
console.log(colors.white.bold('ora lib:'));
const spinner = ora('Connecting spinner').start();
	spinner.color = 'green';
	// spinner.text = 'Loading rainbows';
	spinner.spinner = 'line';
 
setTimeout(() => {
	spinner.succeed('success');
}, 2000);