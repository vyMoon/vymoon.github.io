const comments = {

commenting: false,

start() { // stops commenting
    if (!comments.commenting) {
        domOperations.finder('.commentsContainer').addEventListener('click', comments.worker, true);
        comments.commenting = true;
    }
},

stop() { // sterts commenting
    if (comments.commenting) { 
        domOperations.finder('.commentsContainer').removeEventListener('click', comments.worker, true);
        comments.commenting = false;
    }
},

commentAdder(top, left, message, timestamp) { // adds comment in page

    // finds the comment form for the comment
    const currenComment = comments.commentsFinder().find( el => {
        if (parseInt(el.style.top) === top && parseInt(el.style.left) === left) {
            return true;
        }
    })

    // if  the comment form was found
    if (currenComment) {
        
        currenComment.dataset.id = 'active';                       // marks the form as active
        const dateStr = domOperations.dateMaker(timestamp);        // makes the data string

        // adds the comment in the comments form before comments preloader
        // so this comment will be displayed as the last comment
        domOperations.finder('.comments__body', currenComment) 
            .insertBefore( 
                domOperations.commentMaker(dateStr, message), domOperations.loaderFinder( domOperations.finder('.comments__body', currenComment)
            ));
        domOperations.finder('.comments__marker-checkbox', currenComment).checked = true;

        // the comment form which got the comment should be only one one opened form
        // it closes anothers forms
        comments.commentsFinder().forEach( el => {
            if (el !== currenComment) {
                domOperations.finder('.comments__marker-checkbox', el).checked = false;
            } 
        })
    } else { 
        // if the form wasn't found it creates the form
        // and run the function again to add first comment
        comments.formAppender(top, left);
        comments.commentAdder(top, left, message, timestamp);
    }
},

commentMaker(date, message) {
    // creates comment element and fills it
    const currentComment = domOperations.structureMaker(comment);
    domOperations.finder('.comment__time', currentComment).innerText = date;
    domOperations.finder('.comments__message', currentComment).innerText = message;

    return currentComment;

},

// shows all comments
commentsShower() {
    comments.commentsFinder().forEach( el => {
        el.style.display = 'block';
    })
},

// hides all comments
commentsHider() {
    comments.commentsFinder().forEach( el => {
        el.style.display = 'none';
    })
},

commentsFinder() { // returns array of all comments from the comments container

    return domOperations.finderAll('.comments__form', domOperations.finder('.commentsContainer'));

},

formAppender(y, x) {

    // creates form for the comments styles it and put it to the commnt container
    const comment = domOperations.structureMaker(structures.commentsForm);
    comment.style.display = 'block';
    comment.style.position = 'absolute';
    comment.style.zIndex = 1;
    comment.style.top = y + 'px';
    comment.style.left = x + 'px';
    comment.dataset.id = 'new';
    
    const commentCheckBox = domOperations.finder('.comments__marker-checkbox', comment);
    //add event listener for comment marker
    commentCheckBox.addEventListener('change', comments.onlyOneOpenCommentBody)

    domOperations.finder('.commentsContainer').appendChild(comment);
    
},

newCommentChecker(parametr = true) {
    // deletes new comments from page and closes comments
    comments.commentsFinder().forEach( el => {
        if (el.dataset.id === 'new') {
            el.parentElement.removeChild(el);
        } 
        if (el.dataset.id === 'active' && parametr) {
            domOperations.finder('.comments__marker-checkbox', el).checked = false;
        } 
    })

},

onlyOneOpenCommentBody() {
    // closes bodies of all comments besides that which you use right now
    
    comments.commentsFinder().forEach( el => {
        if (event.target !== domOperations.finder('.comments__marker-checkbox', el)) {
            if (el.dataset.id === 'new') {
                el.parentElement.removeChild(el);
            } else {
                domOperations.finder('.comments__marker-checkbox', el).checked = false;
                el.style.zIndex = 0;
            }
        } else {
            el.style.zIndex = 1;
            
            if (el.dataset.id === 'new') {
                // if the comments form has no comments we can't close it by clck on marker
                domOperations.finder('.comments__marker-checkbox', el).checked = true;
            }
        }
    })
},

newCommentsDeleter() { // deletes new comment form if it has no comments. It has dataset-id = new
    comments.commentsFinder().forEach( el => {
        if( el.dataset.id === 'new') {
            el.parentElement.removeChild(el);
        }
    })
},

worker(event) { // proces clicks on the comments container
    event.stopPropagation();
    // if click on comment container adds comment form
    if (event.currentTarget === event.target) {
        // closes all comments
        comments.newCommentChecker();
        // adds the comment form
        comments.formAppender(event.offsetY, event.offsetX);

    }
    
    if (event.target.classList.contains('comments__close')) {
       // click on the close button of the comments form deletrs this form if it has no comments
       // if it has a comment the clock close this form
        if (event.target.parentElement.parentElement.dataset.id === 'new') {
            event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);
        } else {
            domOperations.finder('.comments__marker-checkbox', event.target.parentElement.parentElement).checked = false;
        }

    }

    if (event.target.classList.contains('comments__submit')) {
        // the click on the submit button is sends the comment if anything is typed
        event.preventDefault();
        // gets the comment text
        const commentText = domOperations.finder('.comments__input', event.target.parentElement).value.trim();
        
        if (commentText !== '') {

            const y = parseInt(event.target.parentElement.parentElement.style.top);
            const x = parseInt(event.target.parentElement.parentElement.style.left);
            //makes the get request
            const body = `message=${commentText}&left=${x}&top=${y}`;

            const messageXHR = new XMLHttpRequest();
            const url = `${linkage.apiURL}/pic/${sessionStorage.id}/comments`;
            
            const loader = domOperations.loaderFinder(event.target.parentElement);
            
            messageXHR.open('POST', url);
            messageXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            // shows and hides the comment preloader
            messageXHR.addEventListener('loadstart', () => {
                domOperations.finder('.comments__input', event.target.parentElement).value = '';
                loader.style.display = 'block';
            });
            messageXHR.addEventListener('loadend', () => loader.style.display = 'none');

            messageXHR.send(body);
        }
    }

}

}
