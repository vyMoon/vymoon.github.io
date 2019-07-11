'use strict';

// console.log('script');

const app = domOperations.finder('.app');

// document.addEventListener('DOMContentLoaded', domOperations.start.call(domOperations));
document.addEventListener('DOMContentLoaded', domOperations.start);

// передвигаем меню
document.addEventListener('mousedown', menu.isItMenu);
document.addEventListener('mousemove', menu.menuMover);
document.addEventListener('mouseup', menu.stopMenuMove);

// запрещаем браузеру открывать файлы
app.addEventListener( 'dragover', event => event.preventDefault() );
// загрузка файлов drop
app.addEventListener('drop', image.imgLoadDrop);

// check menu size when window resize
window.addEventListener('resize', () => {
    // console.log('resize');
    menu.checkMenuSize();
})

menu.menu.addEventListener('click', menu.menuWorker)

// навешиваем события на инпуты, изменяющие цвет рисования
menu.colorInputs.forEach( el => el.addEventListener( 'change', painting.actualColorChanger ) );

// навешиваем события на инпуты в меню, которые показывают и скрывают комментарии
menu.commentsToggleInputs.forEach( el => {
    if ( el.value === 'on') {
        el.addEventListener('change', comments.commentsShower)
    }
    if (el.value === 'off') {
        el.addEventListener('change', comments.commentsHider)
    }
});

// отмена  захвата значения, чтобы случайно не дропнуть его в окно
menu.shareUrl.addEventListener('mousedown', event => event.preventDefault());

// копирование ссылки
menu.shareCopyButton.addEventListener('click', () => {
    menu.shareUrl.select();
    document.execCommand('copy');
})