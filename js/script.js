const app = domOperations.finder('.app');

document.addEventListener('DOMContentLoaded', domOperations.start);

// moving menu
document.addEventListener('mousedown', menu.isItMenu);
document.addEventListener('mousemove', menu.menuMover);
document.addEventListener('mouseup', menu.stopMenuMove);

// denys browser open files
app.addEventListener( 'dragover', event => event.preventDefault() );
// drop files
app.addEventListener('drop', image.imgLoadDrop);

// check menu size when window resize
window.addEventListener('resize', () => {
    menu.checkMenuSize();
})

//handles menu clicks
menu.menu.addEventListener('click', menu.menuWorker)

// listens clicks on inputs changing color of painting
menu.colorInputs.forEach( el => el.addEventListener( 'change', painting.actualColorChanger ) );

// handles click on inputs hiding and showing comments
menu.commentsToggleInputs.forEach( el => {
    if ( el.value === 'on') {
        el.addEventListener('change', comments.commentsShower)
    }
    if (el.value === 'off') {
        el.addEventListener('change', comments.commentsHider)
    }
});

// cancels capturing links in the share items
menu.shareUrl.addEventListener('mousedown', event => event.preventDefault());

// copyes link for sharing
menu.shareCopyButton.addEventListener('click', () => {
    menu.shareUrl.select();
    document.execCommand('copy');
});
