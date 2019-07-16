'use strict';

// console.log('menu');

const menu = {

// меню и его элементы
menu: domOperations.finder('.menu'),

burger: domOperations.finder('.burger', this.menu),
new: domOperations.finder('.new', this.menu),

comments: domOperations.finder('.comments', this.menu),
commentsTools: domOperations.finder('.comments-tools', this.menu),
commentsToggleInputs: domOperations.finderAll('.menu__toggle', this.commentsTools),

draw: domOperations.finder('.draw', this.menu),
drawTools: domOperations.finder('.draw-tools', this.menu),

share: domOperations.finder('.share', this.menu),
shareTools: domOperations.finder('.share-tools', this.menu),
shareUrl: domOperations.finder('.menu__url', this.shareTools),
shareCopyButton: domOperations.finder('.menu_copy', this.shareTools),

// инпуты для смены цвета рисования
colorInputs: domOperations.finderAll('.menu__color', this.drawTools ), 

////////////////////////работа меню////////////////////////////////////////////////////////

// скрывает все элементы меню
elementsHiden() {
    menu.new.style.display = 'none';
    menu.draw.style.display = 'none';
    menu.share.style.display = 'none';
    menu.burger.style.display = 'none';
    menu.comments.style.display = 'none';
    menu.drawTools.style.display = 'none';
    menu.shareTools.style.display = 'none';
    menu.commentsTools.style.display = 'none';  
},

// показывает только главные элементы меню
showMainItem() {
    menu.elementsHiden()
    menu.new.style.display = 'inline-block';
    menu.draw.style.display = 'inline-block';
    menu.share.style.display = 'inline-block';
    menu.comments.style.display = 'inline-block';
},
// shows share elemnts
showShareItem() {
    menu.elementsHiden();
    menu.share.style.display = 'inline-block';
    menu.burger.style.display = 'inline-block';
    menu.shareTools.style.display = 'inline-block';
},
// shows commnts elements
showCommentsItem() {
    menu.elementsHiden();
    menu.burger.style.display = 'inline-block';
    menu.comments.style.display = 'inline-block';
    menu.commentsTools.style.display = 'inline-block';
},
// shows painting elements
showDrawItem() {
    menu.draw.style.display = 'inline-block';
    menu.burger.style.display = 'inline-block';
    menu.drawTools.style.display = 'inline-block';
},
// shows downlosd new picture wlwmwnt
startCondition() {
    menu.elementsHiden();
    menu.new.style.display = 'inline-block';
    if (localStorage.menuX !== undefined && localStorage.menuY !== undefined) {
        menu.menu.style.top = localStorage.menuY + 'px';
        menu.menu.style.left = localStorage.menuX + 'px';
        menu.checkMenuSize();
    }
},

// обрабатывает клики по элментам меню
menuWorker(event) {
    // if shows the error element hides it
    if (domOperations.error) {
        domOperations.error = false;
        domOperations.finder('.error').style.display = 'none';
    }
    if (!event.target.classList.contains('comments') || !event.target.parentElement.classList.contains('comments')) {
        comments.newCommentsDeleter();
    }

    if (event.target.classList.contains('burger') || event.target.parentElement.classList.contains('burger')) {
        menu.showMainItem();
        
        // removes events listeners
        // comments.stop()
        painting.stopPaint();
        comments.start();
    }

    if (event.target.classList.contains('comments') || event.target.parentElement.classList.contains('comments')) {
        // adds event listeners
        // comments.start();
        menu.elementsHiden();
        menu.showCommentsItem();
    }

    if (event.target.classList.contains('draw') || event.target.parentElement.classList.contains('draw')) {
        menu.elementsHiden();
        menu.showDrawItem();
        // adds events listeners
        comments.stop();
        painting.paint();
    }

    if (event.target.classList.contains('share') || event.target.parentElement.classList.contains('share')) {
        menu.showShareItem();
    }

    // проверяет влазит ли меню в окно при необходимости корректирует положение
    menu.checkMenuSize();

    if (event.target.classList.contains('new') || event.target.parentElement.classList.contains('new')) {
        // ищем инпут и кликаем его
        const input = domOperations.finder('input', domOperations.finder('.inputContainer'));
        input.click();
    }
},

/////////////////////menu moving ///////////////////////////////////////////////
// this variables used for moving the menu
moved: undefined,
shiftX: 0,
shiftY: 0,

isItMenu(event) {
    // проверяет произошел ли клик на элементе, закоторый претаскиваем меню
    // если да, то заполняем вспомогательные переменные
    // сдвиг по осям для пердовращения скачков при перетаскивании
    // и сам перетаскиваемый элемент
    if (event.target.classList.contains('drag')) {

        menu.moved = event.target.parentElement;
        const bounds = event.target.getBoundingClientRect();
        menu.shiftX = event.pageX - bounds.left - window.pageXOffset;
        menu.shiftY = event.pageY - bounds.top - window.pageYOffset;
    }
},

// move the menu
menuMover(event) {
    if (menu.moved) {
        event.preventDefault();

        const menuX = event.pageX - menu.shiftX; // координата верхней левой точки
        // максимально возможная коррдината х чтобы менбю не вышло за пределы окна
        const xMax = document.documentElement.clientWidth - Math.ceil(menu.moved.getBoundingClientRect().width);
        // выбираем меньшую точку
        const x = Math.min(menuX, xMax);
        // передвигаем меню в выбранну точку при этом проверяем чтобы оно не вышло за пределы окна
        menu.moved.style.left = (x > 0) ? x + 'px' : 0 + 'px';

        // аналогично с координатой у
        const menuY = event.pageY - menu.shiftY; 
        const yMax = document.documentElement.clientHeight - menu.moved.offsetHeight;
        const y = Math.min(menuY, yMax);
       
        menu.moved.style.top = (y > 0) ? y + 'px' : 0 + 'px';
    }
},

// закнчиваем двигать меню 
stopMenuMove() {
    if (menu.moved) {
        menu.moved = undefined;
    }
    // save the menu position
    const menuBound = menu.menu.getBoundingClientRect();
    localStorage.menuX = menuBound.x;
    localStorage.menuY = menuBound.y;
},

// изменяет положение меню, если при изменении вида меню, оно перстает влаpить в размеры документа по правому краю
checkMenuSize() {
    // вычисляем размер меню без бордеров
    const menuWidth = Array.from(menu.menu.children).reduce( (memo, el) => {
        memo += el.getBoundingClientRect().width;
        return memo;
    }, 0);
    const menuBound = menu.menu.getBoundingClientRect();
    //вычисляем размер бордеров
    const bordersWidth = parseInt(getComputedStyle(menu.menu).borderLeftWidth) + parseInt(getComputedStyle(menu.menu).borderRightWidth);
    //проверяем выходит ли меню за пределы окна
    if ( Math.ceil(menu.menu.getBoundingClientRect().x + menuWidth + bordersWidth) > document.documentElement.offsetWidth) {
        //  если выходит, то передвигаем влево на минимальное безопасное расстояние
        menu.menu.style.left = document.documentElement.offsetWidth - Math.ceil(menuWidth) - bordersWidth + 'px';
    }
    if (menu.menu.getBoundingClientRect().x < 0) {
        menu.menu.style.left = '0px'
    }
    if (menuBound.y + Math.ceil(menuBound.height) > document.body.clientHeight) {
        menu.menu.style.top = (document.body.clientHeight - Math.ceil(menuBound.height)) + 'px'; 
    }
}

}
