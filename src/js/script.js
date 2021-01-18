{
    'use strict';

    const select = {
        templateOf: {
            book: '#template-book'
        },
        booksList: '.books-list',

    }

    const templates = {
        book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
    }

    function render(booksData) {
        //find booksList container
        const booksListWrapper = document.querySelector(select.booksList);

        for (const book of booksData) {
            //Generate HTML text with handlebars
            const generatedHTML = templates.book(book);
            //Create DOM using utils.createDOMFromHTML()
            const element = utils.createDOMFromHTML(generatedHTML);
            //Add element to booksList
            booksListWrapper.appendChild(element);
        }
    }

    render(dataSource.books);




}