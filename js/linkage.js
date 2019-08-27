const linkage = {

apiURL: 'https://neto-api.herokuapp.com',

ws: undefined,

wsOpen() { // opens the ws
    linkage.ws = new WebSocket(`wss://neto-api.herokuapp.com/pic/${sessionStorage.id}`);
    linkage.ws.addEventListener('message', linkage.wsMessage);
},

wsClose() { // closes the ws
    if (linkage.ws) {
        linkage.ws.removeEventListener('message', linkage.wsMessage)
        linkage.ws.close(1000, 'bye');
    }
},

wsMessage(event) {
    const response = JSON.parse(event.data)

    if(response.event === 'pic' && domOperations.ready !== true) { // if type event == pic loads picture
        
        image.imgWorker(response.pic.id, response.pic.url, response.pic.mask, response.pic.comments);

    }

    if (response.event === 'comment') {  // if event type == camment adds comment in the apropriate form
       
        comments.commentAdder(response.comment.top, response.comment.left, response.comment.message, response.comment.timestamp);

    }

    if (response.event === 'mask') {  // if event == mask refreshes the mask

        if (!domOperations.ready) { // something goes wrong on the server so we should close ws socket and reopen it again 

            domOperations.ready = true;
            linkage.ws.close();
            linkage.wsOpen();
            
        }

        //styles mask element and loads mask
        const imgBound = image.image.getBoundingClientRect();
        domOperations.elementStyler(domOperations.finder('.mask'), imgBound);
        domOperations.finder('.mask').src = response.url;

    }

}
    
}
