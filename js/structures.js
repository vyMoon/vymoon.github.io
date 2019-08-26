'use strict';
// console.log('str')
const structures = {
input: {
    type: 'div',
    classes: ['inputContainer'],
    children: [
        {
            type: 'input',
            classes: ['input'],
            styles: {
                display: 'none'
            },
            atr: {
                type: 'file',
                multiple: false,
                acceppt: 'image/jpg'
            }
        }
    ]
},

commentsContainer: {
    type: 'div',
    classes: ['commentsContainer'],
    atr: {
        position: 'relative'
    }
},

comment: {
    type: 'div',
    classes: ['comment'],
    children: [
        {
            type: 'p',
            classes: ['comment__time']
        },
        {
            type: 'p',
            classes: ['comment__message']
        }
    ]
},

commentsForm: {
    type: 'form',
    classes: ['comments__form'],
    children: [
        {
            type: 'span',
            classes: ['comments__marker']
        },
        {
            type: 'input',
            classes: ['comments__marker-checkbox'],
            atr: {
                type: 'checkbox',
                checked: true
            }
        },
        {
            type: 'div',
            classes: ['comments__body'],
            children: [
                {
                    type: 'div',
                    classes: ['comment'],
                    styles: {
                        display: 'none'
                    },
                    children: [
                        {
                            type: 'div',
                            classes: ['loader'],
                            children: [
                                {
                                    type: 'span'
                                },
                                {
                                    type: 'span'
                                },
                                {
                                    type: 'span'
                                },
                                {
                                    type: 'span'
                                },
                                {
                                    type: 'span'
                                }
                            ]
                        }
                    ]
                },
                {
                    type: 'textarea',
                    classes: ['comments__input'],
                    atr: {
                        // type: 'text',
                        placeholder: 'Write your aswer'
                    }
                },
                {
                    type: 'input',
                    classes: ['comments__close'],
                    atr: {
                        type: 'button',
                        value: 'Close'
                    }
                },
                {
                    type: 'input',
                    classes: ['comments__submit'],
                    atr: {
                        type: 'submit',
                        value: 'Submit'
                    }
                }
            ]
        }
    ]
}

}
