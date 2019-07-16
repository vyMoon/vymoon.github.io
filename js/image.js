'use strict';

// console.log('img');

const image = {

get image() {
    return domOperations.finder('.current-image');
},

imgWorker(id, url, mask, responseComments) {
        // if there is a picture on the page
        // deletes img comments container canvases
        if (domOperations.finder('.current-image')) {
            image.image.parentElement.removeChild(image.image);
            
            domOperations.finder('.mask').parentElement.removeChild(domOperations.finder('.mask'));
            domOperations.finder('.canvas').parentElement.removeChild(domOperations.finder('.canvas'));
            domOperations.finder('.canvasHelper').parentElement.removeChild(domOperations.finder('.canvasHelper'));
            comments.stop();
            domOperations.finder('.commentsContainer').parentElement.removeChild(domOperations.finder('.commentsContainer'));
        }

        const app = domOperations.finder('.app');
        //creates new img element
        const img = domOperations.elementMaker('img', 'current-image');
        img.src = url;
        app.insertBefore(img, domOperations.finder('.error') );
        // prohibits image capture
        img.addEventListener('mousedown', event => event.preventDefault() );
       
        // creates commentsContainer, mask, canvases
        app.insertBefore(domOperations.elementMaker('img', 'mask'), domOperations.errorElement );
        app.insertBefore(domOperations.elementMaker('canvas', 'canvasHelper'), domOperations.errorElement );
        app.insertBefore(domOperations.elementMaker('canvas', 'canvas'), domOperations.errorElement );
        app.insertBefore(domOperations.structureMaker(structures.commentsContainer), domOperations.errorElement );
        comments.start();
        
        sessionStorage.id = id;
        menu.shareUrl.value = `${window.location.origin}?${id}`;    
    
        img.addEventListener('load', function() {

            const imgBound = img.getBoundingClientRect();
            // // задает стили для холста и контейнера комментариев
            domOperations.elementStyler(domOperations.finder('.canvas'), imgBound);
            domOperations.elementStyler(domOperations.finder('.canvasHelper'), imgBound);
            domOperations.elementStyler(domOperations.finder('.commentsContainer'), imgBound);
            domOperations.finder('.commentsContainer').style.width = imgBound.width + 'px';
            domOperations.finder('.commentsContainer').style.height = imgBound.height + 'px';


            if (responseComments) {
                // if there is any comment creates them
                for (let i in responseComments) {
                    comments.commentAdder(
                        responseComments[i].top, 
                        responseComments[i].left, 
                        responseComments[i].message, 
                        responseComments[i].timestamp
                    )
                }
                //closes the body of every comment
                comments.commentsFinder().forEach( el => {
                    domOperations.finder('.comments__marker-checkbox', el).checked = false;
                })
            }
    
            if (mask) {
                // if there is a mask loads mask and styles it
                domOperations.ready = true;
                domOperations.elementStyler(domOperations.finder('.mask'), imgBound);
                domOperations.finder('.mask').src = mask;
            }
    

            painting.ctx = domOperations.finder('.canvas').getContext('2d');
            painting.ctxHelper = domOperations.finder('.canvasHelper').getContext('2d');

        });
},

imgLoad(file) {

    domOperations.errorHider();
    // domOperations.finder('.error').style.display = 'none';

    // регулярное выражение для проверки файла
    const imageTypeRegExp = /^image\//;
    // if the file attached
    if (imageTypeRegExp.test(file.type)) {

        // формирование форм даты для отправки
        const imgFormData = new FormData();
        imgFormData.append('title', file.name);
        imgFormData.append('image', file);

        // отправляет изобразение
        let imgXML = new XMLHttpRequest();
        imgXML.open('POST', 'https://neto-api.herokuapp.com/pic/');
        // показывает - скрывает лоадер при загрузке изображения
        imgXML.addEventListener('loadstart', () => domOperations.finder('.image-loader').style.display = 'block');
        imgXML.addEventListener('loadend', () => domOperations.finder('.image-loader').style.display = 'none');
        imgXML.addEventListener('error', () => {

            domOperations.errorShower(domOperations.serverErrorMessage)

        } );

        imgXML.addEventListener('load', function() {

            domOperations.ready = false;

            // очищаем холст, удаляет комментарии
            painting.canvasCleaner();

            if (imgXML.status === 200) {
                sessionStorage.prepare = true;
                const response = JSON.parse(imgXML.responseText);
                // отображает изображение. открывает нужные пункты меню
                menu.showShareItem();
                menu.checkMenuSize();

                sessionStorage.id = response.id;
                menu.shareUrl.value = `${window.location.origin}?${response.id}`;
                // открыывает вэб соккет
                linkage.wsClose();
                linkage.wsOpen();
                
            }
            // отображает ошлибку
            if (imgXML.status >= 500) {

                domOperations.errorShower(domOperations.serverErrorMessage)

            }
        });

        imgXML.send(imgFormData);       

    } else { // иначе осталяем тольок пункт меню загрузить и выводим ошибку
        domOperations.errorShower(domOperations.typeErrorMessage);
    }

},

imgLoadDrop(event) {
    event.preventDefault();                             // предовращаем открытие
    
    if (!image.image) {
        const file = event.dataTransfer.files[0];       // получаем файл
        image.imgLoad(file);                            // отображаем файл
    } else {
        // отображает ошибку, если файл не  того типа
        domOperations.errorShower(domOperations.behaviorErrorMessage);
    }
}

}
