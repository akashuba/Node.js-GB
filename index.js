//Lesson1
//Node JS

console.log('Hello Node.js!');

//import-export - ES6+, require - CommonJS
const ansi = require('ansi');

//Создаем курсор
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

/**
 * PHP
 * Количество библиотек =
 * Поддерживают все хостинги +
 * Более легкий в освоении +
 * Только под Backend -
 * Линейное выполнение кода, перерасход ресурсов -
 * 
 * NODE
 * Количество библиотек =
 * Поддерживают все хостинги (есть решение: VPS) -
 * Более легкий в освоении -
 * Очень универсальный язык +++
 * Ассинхронное выполнение кода, 1 процесс ++
 * 
 * Быстрее ли Node чем PHP? Всегда ли быстрее? Во сколько раз?
 * 
 * Что бысрее Node.js из коробки?
 * Go (golang)
 */