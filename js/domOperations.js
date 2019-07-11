'use strict';

const domOperations = {

ready: false,
error: false,

get errorElement() {
    return domOperations.finder('.error');
},

typeErrorMessage: 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.',
serverErrorMessage: 'Что то пошло не так!! Попробуйте позже',
behaviorErrorMessage: 'Для загрузки нового изображения нужно воспользовать пунктом меню  "ЗАГРУЗИТЬ НОВОЕ"',

commentMaker(date, message) { // create an comment element

    const currentComment = domOperations.structureMaker(structures.comment);
    domOperations.finder('.comment__time', currentComment).innerText = date;
    domOperations.finder('.comment__message', currentComment).innerText = message;

    return currentComment;
},

dateMaker(timestamp) {  // create apropriate date string 

    const date = new Date(timestamp);
    let mounth = '' + (date.getMonth() + 1);
    if (mounth.length === 1) {
        mounth = '0' + mounth;
    }

    return `${date.getDate()}.${mounth}.${('' + date.getFullYear()).slice(2)} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
},

// функция поиска элементов на странице
// принимает класс и контэйнер
finder(needle, container) {
    
    if (container !== undefined) {
        return container.querySelector(needle);
    }
    return document.querySelector(needle);

},

// ищет и возвращает массив этмл элементов
// принимает класс и контэйнер
finderAll(needle, container) {

    if (container !== undefined) {
        return Array.from( container.querySelectorAll(needle) );
    }
    return Array.from( document.querySelectorAll(needle) );

},

loaderFinder(constainer) {  // finds the loader element in form element

    return domOperations.finderAll( '.comment', constainer).find( el => {
        if (el.firstElementChild.classList.contains('loader')) {
            return true;
        }
    })

},

elementMaker(tag, ...classes) {  // creates an element and add claesses if they passed

    const element = document.createElement(tag);
    if (classes.length > 0) {
        classes.forEach( el => element.classList.add(el) )
    }
    return element;

},

elementStyler(element, imgBound) {  // appliea styles to passed element
    element.style.position = 'absolute';
    element.style.display = 'block';
    element.width = imgBound.width;
    element.height = imgBound.height;
    element.style.top = '50%';
    element.style.left = '50%';
    element.style.transform = 'translate(-50%, -50%)';
},

structureMaker(el, container) {  //creates complicated element

    const my = document.createElement(el.type);

    if (el.classes && Array.isArray(el.classes)) {
        
        el.classes.forEach( el => {
            my.classList.add(el);
        })
    }

    if (el.atr && typeof el.atr === 'object') {
        
        const keys = Object.keys(el.atr);
        keys.forEach( atrName => {
            my[atrName] = el.atr[atrName];
        });
        
    }

    if (el.styles && typeof el.styles === 'object') {

        const keys = Object.keys(el.styles);
        keys.forEach( stlName => {
            my.style[stlName] = el.styles[stlName];
        })
    }

    if (el.children && Array.isArray(el.children)) {

        el.children.forEach( el => {
            domOperations.structureMaker(el, my);
        })
    }

    if (container !== undefined) {
        container.appendChild(my);
    } else {
        return my;
    }

},

errorShower(message) {  // finde the error element and shows it
    domOperations.error = true;
    domOperations.finder('.error__message').innerText = message;
    domOperations.finder('.error').style.display = 'block';
},

errorHider() {
    domOperations.finder('.error').style.display = 'none';
},

commentsStarter() {  // adds eventlisteners to comments container after load pictures, waits comments contaener if need
    if(domOperations.finder('.commentsContainer')) {
        // console.log('comments container found')
        comments.start()
    } else {
        // console.log('we need wait');
        setTimeout(domOperations.commentsStarter, 500)
    }
},

start() {
    // console.log('dom start');
    // чистим страницу, чтобы не было отображено лишнее
    domOperations.finder('.comments__form').style.display = 'none';

    const img = domOperations.finder('.current-image');
    img.parentElement.removeChild(img);

    menu.startCondition();
    // makes input to load picture
    domOperations.structureMaker(structures.input, domOperations.finder('.app'));
    domOperations.finder('.input').addEventListener('change', function(event) {
        event.stopPropagation();
        const file = event.currentTarget.files[0];  // получаем файл
        image.imgLoad(file);                              // отображаем файл
    });

    // if there is an id of picture in the GET or in the LocalStorage it should open this picture
    const id = window.location.search.slice(1) || sessionStorage.id;

    if (id) {
        
        sessionStorage.id = id;
        const url = `${linkage.apiURL}/pic/${id}`;
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', function() {
            
            if (xhr.status === 200) {
                
                const response = JSON.parse(xhr.responseText);
                // console.log(response);

                sessionStorage.id = response.id;
                menu.shareUrl.value = `${window.location.origin}?${response.id}`;

                // открыывает вэб соккет
                linkage.wsOpen();

                menu.showCommentsItem();
                menu.checkMenuSize();

                domOperations.commentsStarter();
            }
        })

        xhr.send();
    }
}

}