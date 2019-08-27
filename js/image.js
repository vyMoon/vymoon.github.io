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
        app.insertBefore(domOperations.elementMaker('canvas', 'canvas'), domOperations.errorElement );
        app.insertBefore(domOperations.structureMaker(structures.commentsContainer), domOperations.errorElement );

        comments.start();
        
        sessionStorage.id = id;
        menu.shareUrl.value = `${window.location.origin}?${id}`;    
    
        img.addEventListener('load', function() {

            const imgBound = img.getBoundingClientRect();
            // styles elements
            domOperations.elementStyler(domOperations.finder('.canvas'), imgBound);
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
            
            // gets 2d context for painting
            painting.ctx = domOperations.finder('.canvas').getContext('2d');

        });
},

imgLoad(file) {

    domOperations.errorHider();

    // regexp for cheking downloaded file
    const imageTypeRegExp = /^image\//;
    // if the file attached
    if (imageTypeRegExp.test(file.type)) {

        // makes formdata for sending the picture
        const imgFormData = new FormData();
        imgFormData.append('title', file.name);
        imgFormData.append('image', file);

        // sends the picture
        let imgXML = new XMLHttpRequest();
        imgXML.open('POST', 'https://neto-api.herokuapp.com/pic/');
        
        // shows and hides preloader 
        imgXML.addEventListener('loadstart', () => domOperations.finder('.image-loader').style.display = 'block');
        imgXML.addEventListener('loadend', () => domOperations.finder('.image-loader').style.display = 'none');
        // if the reaponse is wrong shows the mistake
        imgXML.addEventListener('error', () => {
            domOperations.errorShower(domOperations.serverErrorMessage)
        } );

        imgXML.addEventListener('load', function() {

            domOperations.ready = false;

            // cleans the canvas and deletes comments
            painting.canvasCleaner();

            if (imgXML.status === 200) {
                sessionStorage.prepare = true;
                const response = JSON.parse(imgXML.responseText);
            
                // loads the picture and shows menu items
                menu.showShareItem();
                menu.checkMenuSize();

                //memirizes id of picture and makes url for sharing
                sessionStorage.id = response.id;
                menu.shareUrl.value = `${window.location.origin}?${response.id}`;

                // opens web socket
                linkage.wsClose();
                linkage.wsOpen();
                
            }
            
            // if false shoews the message
            if (imgXML.status >= 500) {

                domOperations.errorShower(domOperations.serverErrorMessage)

            }
        });

        imgXML.send(imgFormData);       

    } else { //shows the error message
        domOperations.errorShower(domOperations.typeErrorMessage);
    }

},

imgLoadDrop(event) {
    event.preventDefault();                             // forbides browser open a picture
    
    if (!image.image) {
        const file = event.dataTransfer.files[0];       // obtains the file
        image.imgLoad(file);                            // shows the file
    } else {
        // if type of the file is wrong shoes the error message
        domOperations.errorShower(domOperations.behaviorErrorMessage);
    }
}

}
