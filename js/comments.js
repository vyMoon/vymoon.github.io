'use strict';

// console.log('comments')

const comments = {

start() {
    domOperations.finder('.commentsContainer').addEventListener('click', comments.worker, true);
},

stop() {
    domOperations.finder('.commentsContainer').removeEventListener('click', comments.worker, true);
},

commentAdder(top, left, message, timestamp) { // adds comment in page

    // ищем форму, в которую нужно давить комментария
    const currenComment = comments.commentsFinder().find( el => {
        if (parseInt(el.style.top) === top && parseInt(el.style.left) === left) {
            return true;
        }
    })

    // если нашли
    if (currenComment) {
        
        currenComment.dataset.id = 'active';                       // помечаем форму как активную
        const dateStr = domOperations.dateMaker(timestamp);        // получаем струку с датой нужного формата

        // в тело комеентария вставляем комментарий перед лоадером, тоесть как последний на данный момент
        domOperations.finder('.comments__body', currenComment) 
            .insertBefore( 
                domOperations.commentMaker(dateStr, message), domOperations.loaderFinder( domOperations.finder('.comments__body', currenComment)
            ));
        domOperations.finder('.comments__marker-checkbox', currenComment).checked = true;

        // и оставляем открытый только свежий комментарий
        comments.commentsFinder().forEach( el => {
            if (el !== currenComment) {
                domOperations.finder('.comments__marker-checkbox', el).checked = false;
            } 
        })
    } else { 
        // иначе создаем форму комментария в нужном месте
        // и запускам еще раз для добавления первого комментария
        // нужно в том случае, если функция используется при загрузке по ссылке или при обновлении страницы
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

// показывает все комментарии
commentsShower() {
    comments.commentsFinder().forEach( el => {
        el.style.display = 'block';
    })
},

// скрывает все комментарии
commentsHider() {
    comments.commentsFinder().forEach( el => {
        el.style.display = 'none';
    })
},

commentsFinder() { // returns array of all comments from comments container

    return domOperations.finderAll('.comments__form', domOperations.finder('.commentsContainer'));

},

formAppender(y, x) {

    // creates form for the comments styles it and put it to page
    const comment = domOperations.structureMaker(structures.commentsForm);
    comment.style.display = 'block';
    comment.style.position = 'absolute';
    comment.style.zIndex = 1;
    comment.style.top = y + 'px';
    comment.style.left = x + 'px';
    comment.dataset.id = 'new';
    
    const commentCheckBox = domOperations.finder('.comments__marker-checkbox', comment);
    console.log(commentCheckBox);
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
    // closes body of all comments besides that which you use right now
    // console.log('only one opent comment nody');
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
                // если тело комментария только что создано, то его нельзя закрыть
                // кликом на маркер
                domOperations.finder('.comments__marker-checkbox', el).checked = true;
            }
        }
    })
},

newCommentsDeleter() { // deletes new commnts form from page
    comments.commentsFinder().forEach( el => {
        if( el.dataset.id === 'new') {
            el.parentElement.removeChild(el);
        }
    })
},

worker(event) { // handles clicks on the commnts container
    event.stopPropagation();
    // // добавляет форму комментария, если клик на контейнере
    if (event.currentTarget === event.target) {
        // закрывает комментарии
        comments.newCommentChecker();
        // добавляет форму
        comments.formAppender(event.offsetY, event.offsetX);

    }
    
    if (event.target.classList.contains('comments__close')) {
       // если клик на кнопке закрыть форму комментария, если комментарий не активный, то удаляет его
       // если активный то сворачивает форму
        if (event.target.parentElement.parentElement.dataset.id === 'new') {
            event.target.parentElement.parentElement.parentElement.removeChild(event.target.parentElement.parentElement);
        } else {
            domOperations.finder('.comments__marker-checkbox', event.target.parentElement.parentElement).checked = false;
        }

    }

    if (event.target.classList.contains('comments__submit')) {
        // при клике на  кнопке отправить, если введен комментарий - отправляет его
        event.preventDefault();
        
        const commentText = domOperations.finder('.comments__input', event.target.parentElement).value.trim();
        
        if (commentText !== '') {

            const y = parseInt(event.target.parentElement.parentElement.style.top);
            const x = parseInt(event.target.parentElement.parentElement.style.left);
            const body = `message=${commentText}&left=${x}&top=${y}`;

            const messageXHR = new XMLHttpRequest();
            const url = `${linkage.apiURL}/pic/${sessionStorage.id}/comments`;
            
            const loader = domOperations.loaderFinder(event.target.parentElement);
            
            messageXHR.open('POST', url);
            messageXHR.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

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
