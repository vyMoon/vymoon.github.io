const domOperations = {

ready: false,
error: false,

get errorElement() { // returns the error container
    return domOperations.finder('.error');
},

// textes of errors messages
// typeErrorMessage: 'Неверный формат файла. Пожалуйста, выберите изображение в формате .jpg или .png.',
// serverErrorMessage: 'Что то пошло не так!! Попробуйте позже',
// behaviorErrorMessage: 'Для загрузки нового изображения нужно воспользовать пунктом меню  "ЗАГРУЗИТЬ НОВОЕ"',

typeErrorMessage: 'Wrong file format. Please chose .jpg or .png file.',
serverErrorMessage: 'Something goes wrong. Please will try later',
behaviorErrorMessage: 'For uploading the picture use the menu item "UPLOAD NEW"',

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

// looks for elements on the page
finder(needle, container) {
    
    if (container !== undefined) {
        return container.querySelector(needle);
    }
    return document.querySelector(needle);

},

// looks for elements on the page
finderAll(needle, container) {

    if (container !== undefined) {
        return Array.from( container.querySelectorAll(needle) );
    }
    return Array.from( document.querySelectorAll(needle) );

},

loaderFinder(constainer) {  // finds the loader element in the form element

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

elementStyler(element, imgBound) {  //  styles a passed element
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
    // adds classes if they are
    if (el.classes && Array.isArray(el.classes)) {
        
        el.classes.forEach( el => {
            my.classList.add(el);
        })
    }
    // adds atributes if they are
    if (el.atr && typeof el.atr === 'object') {
        
        const keys = Object.keys(el.atr);
        keys.forEach( atrName => {
            my[atrName] = el.atr[atrName];
        });
        
    }
    // styles the elements if it needs
    if (el.styles && typeof el.styles === 'object') {

        const keys = Object.keys(el.styles);
        keys.forEach( stlName => {
            my.style[stlName] = el.styles[stlName];
        })
    }
    // creates children if they exist
    if (el.children && Array.isArray(el.children)) {

        el.children.forEach( el => {
            domOperations.structureMaker(el, my);
        })
    }
    // put the elemnt to the container if it passed or returns element
    if (container !== undefined) {
        container.appendChild(my);
    } else {
        return my;
    }

},

errorShower(message) {  // finds the error element and shows it
    domOperations.error = true;
    domOperations.finder('.error__message').innerText = message;
    domOperations.finder('.error').style.display = 'block';
},

errorHider() {
    domOperations.finder('.error').style.display = 'none';
},

start() {
    //cleans the page
    domOperations.finder('.comments__form').style.display = 'none';

    const img = domOperations.finder('.current-image');
    img.parentElement.removeChild(img);

    menu.startCondition();
    // makes input to load picture
    domOperations.structureMaker(structures.input, domOperations.finder('.app'));
    domOperations.finder('.input').addEventListener('change', function(event) {
        event.stopPropagation();
        const file = event.currentTarget.files[0];        // abtain the file
        image.imgLoad(file);                              // shows the file
    });

    // if there is the id of the picture in the GET request or in the LocalStorage opens the picture by this id
    const id = window.location.search.slice(1) || sessionStorage.id;

    if (id) {
        
        sessionStorage.id = id;
        const url = `${linkage.apiURL}/pic/${id}`;
        
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.addEventListener('load', function() {
            
            if (xhr.status === 200) {
                
                const response = JSON.parse(xhr.responseText);

                sessionStorage.id = response.id;
                //makes the link for sharing
                menu.shareUrl.value = `${window.location.origin}?${response.id}`;

                // opens web socket
                linkage.wsOpen();
                //shows the menu items
                menu.showCommentsItem();
                menu.checkMenuSize();

                // domOperations.commentsStarter();
            }
        })

        xhr.send();
    }
}

}
