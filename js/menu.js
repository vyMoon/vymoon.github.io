const menu = {

// menu items
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

// inputs for changing colors of painting
colorInputs: domOperations.finderAll('.menu__color', this.drawTools ), 

////////////////////////menu works////////////////////////////////////////////////////////

// hide aoo items of the menu
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

// shows main elements
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
// shows comments elements
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
// shows element for uploading a picture
startCondition() {
    menu.elementsHiden();
    menu.new.style.display = 'inline-block';
    if (localStorage.menuX !== undefined && localStorage.menuY !== undefined) {
        menu.menu.style.top = localStorage.menuY + 'px';
        menu.menu.style.left = localStorage.menuX + 'px';
        menu.checkMenuSize();
    }
},


// handles menu clicks
menuWorker(event) {
    // if the error is shown it hides the error
    if (domOperations.error) {
        domOperations.error = false;
        domOperations.finder('.error').style.display = 'none';
    }

    if (event.target.classList.contains('burger') || event.target.parentElement.classList.contains('burger')) {
        //hides items and shows main items
        //stops painting and starts comenting
        menu.showMainItem();
        comments.newCommentsDeleter();
        painting.stopPaint();
        comments.start();
    }

    if (event.target.classList.contains('comments') || event.target.parentElement.classList.contains('comments')) {
        // shows comment items
        menu.elementsHiden();
        menu.showCommentsItem();
    }

    if (event.target.classList.contains('draw') || event.target.parentElement.classList.contains('draw')) {
        // shoes painting items
        // starts painting
        menu.elementsHiden();
        menu.showDrawItem();
        comments.stop();
        painting.paint();
    }

    if (event.target.classList.contains('share') || event.target.parentElement.classList.contains('share')) {
        // shows share item
        menu.showShareItem();
    }

    // checks the size of the menu and if the menu go out from the screen move the menu
    menu.checkMenuSize();

    if (event.target.classList.contains('new') || event.target.parentElement.classList.contains('new')) {
        // if the click on the upload item clock a virtual input.
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
    // if click on the moveing menu element
    // starts to move the menu
    // memorize the click point to stop menu jumping
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
        // the max x coord to keep menu on the screen
        const xMax = document.documentElement.clientWidth - Math.ceil(menu.moved.getBoundingClientRect().width);
        // choses the min coord
        const x = Math.min(menuX, xMax);
        // moves the menu and checks its size
        menu.moved.style.left = (x > 0) ? x + 'px' : 0 + 'px';

        const menuY = event.pageY - menu.shiftY; 
        const yMax = document.documentElement.clientHeight - menu.moved.offsetHeight;
        const y = Math.min(menuY, yMax);
       
        menu.moved.style.top = (y > 0) ? y + 'px' : 0 + 'px';
    }
},

// stops move the menu
stopMenuMove() {
    if (menu.moved) {
        menu.moved = undefined;
    }
    // save the menu position
    const menuBound = menu.menu.getBoundingClientRect();
    localStorage.menuX = menuBound.x;
    localStorage.menuY = menuBound.y;
},

// checks the menu size
checkMenuSize() {
    // counts the menu size
    const menuWidth = Array.from(menu.menu.children).reduce( (memo, el) => {
        memo += el.getBoundingClientRect().width;
        return memo;
    }, 0);
    const menuBound = menu.menu.getBoundingClientRect();
    //counts the menu borders size
    const bordersWidth = parseInt(getComputedStyle(menu.menu).borderLeftWidth) + parseInt(getComputedStyle(menu.menu).borderRightWidth);
    //checks if the menu has gone out of the screen and stores it on the screen
    if ( Math.ceil(menu.menu.getBoundingClientRect().x + menuWidth + bordersWidth) > document.documentElement.offsetWidth) {
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
