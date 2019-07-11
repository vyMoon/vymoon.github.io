'use strict';

const linkage = {

apiURL: 'https://neto-api.herokuapp.com',

ws: undefined,

wsOpen() {
    // console.log('ws is open');
    linkage.ws = new WebSocket(`wss://neto-api.herokuapp.com/pic/${sessionStorage.id}`);
    linkage.ws.addEventListener('message', linkage.wsMessage);
},

wsClose() {
    if (linkage.ws) {
        // console.log('ws is closed');
        linkage.ws.removeEventListener('message', linkage.wsMessage)
        linkage.ws.close(1000, 'bye');
        // linkage.ws = undefined;
    }
},

wsMessage(event) {
    const response = JSON.parse(event.data)

    if(response.event === 'pic' && domOperations.ready !== true) {
        // if type event == pic loads picture
        console.log('event = pic');
        image.imgWorker(response.pic.id, response.pic.url, response.pic.mask, response.pic.comments);

    }

    if (response.event === 'comment') {
        // при событии сообщение добавляет сооющение в нужную форму
        // console.log('ws comment')
        comments.commentAdder(response.comment.top, response.comment.left, response.comment.message, response.comment.timestamp);

    }

    if (response.event === 'mask') {
        // при событии маска обновляем маску

        if (!domOperations.ready) {
            // на сервере что то идет не так и когда приходит маска первый раз
            // нужно перезагрузить страницу или переподключить сокет
            domOperations.ready = true;
            // linkage.ws.close();
            linkage.wsOpen();
            
        }
        //styles mask element and loads mask
        const imgBound = image.image.getBoundingClientRect();
        domOperations.elementStyler(domOperations.finder('.mask'), imgBound);
        domOperations.finder('.mask').src = response.url;

    }

}


}