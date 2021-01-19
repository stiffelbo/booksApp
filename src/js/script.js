{
    'use strict';

    const select = {
        templateOf: {
            book: '#template-book'
        },
        booksList: '.books-list',
        dataId: 'data-id',
        filters: '.filters',
    }

    const templates = {
            book: Handlebars.compile(document.querySelector(select.templateOf.book).innerHTML),
        }
        //store for favorite books
    const favoriteBooks = [];

    //find booksList container
    const booksListWrapper = document.querySelector(select.booksList);

    //find filters wrapper
    const filtersForm = document.querySelector(select.filters);
    //active filters
    const filters = [];

    function render(booksData) {

        for (const book of booksData) {
            //generater width: % from rating
            const width = "width: " + book.rating * 10 + "%;";
            //generate book.barStyle from rating parameter
            if (book.rating <= 6) {
                book.barStyle = "background: linear-gradient(to bottom,  #fefcea 0%, #f1da36 100%);";
            } else if (book.rating > 6 && book.rating <= 8) {
                book.barStyle = "background: linear-gradient(to bottom, #b4df5b 0%,#b4df5b 100%);";
            } else if (book.rating > 8 && book.rating <= 9) {
                book.barStyle = "background: linear-gradient(to bottom, #299a0b 0%, #299a0b 100%);";
            } else {
                book.barStyle = "background: linear-gradient(to bottom, #ff0084 0%,#ff0084 100%);";
            }
            //add width param
            book.barStyle += width;

            //Generate HTML text with handlebars
            const generatedHTML = templates.book(book);
            //Create DOM using utils.createDOMFromHTML()
            const element = utils.createDOMFromHTML(generatedHTML);
            //Add element to booksList
            booksListWrapper.appendChild(element);
        }
    }

    function filterBooks(filters) {
        //get all books covers dom elements
        const allBooksCovers = booksListWrapper.querySelectorAll('.book__image');
        //remove class hidden from all covers
        for (const cover of allBooksCovers) {
            cover.classList.remove('hidden');
        }
        //check all dataSource.books
        for (const book of dataSource.books) {
            let shouldBeHidden = false;
            //check each filter
            for (const filter of filters) {
                //check if book detail is not vaild for filter
                if (!book.details[filter]) {
                    //change flag value
                    shouldBeHidden = true;
                    //quit loop
                    break;
                }
            }
            //if flag is true for this book
            if (shouldBeHidden) {
                //get book cover element
                const bookCoverToHide = booksListWrapper.querySelector('.book__image[data-id = "' + book.id + '"]');
                bookCoverToHide.classList.add('hidden');
            }
        }
    }

    function initActions() {
        booksListWrapper.addEventListener('dblclick', function(event) {
            event.preventDefault();

            if (event.target && event.target.nodeName == "IMG") {
                const element = event.target.parentNode.parentNode; // jest jakas metoda by wskazać element rodzić ale danego typu?
                //zamiast na sztywno pisać parentNode myślałe o pętli, która bedzie szukac aż znajdzie node o nazwie "A"
                //Ale może jest cos jeszce prostszego??

                //Check if data-id in favorites
                const bookId = element.getAttribute(select.dataId);
                if (favoriteBooks.indexOf(bookId) == -1) {
                    favoriteBooks.push(bookId);
                    element.classList.add('favorite');
                } else {
                    favoriteBooks.splice(favoriteBooks.indexOf(bookId), 1);
                    element.classList.remove('favorite');
                }
            }
        });

        filtersForm.addEventListener('click', function(event) {

            if (event.target.tagName == "INPUT" && event.target.type == 'checkbox' && event.target.name == 'filter') {
                if (event.target.checked) {
                    filters.push(event.target.value);
                    filterBooks(filters);
                } else {
                    filters.splice(filters.indexOf(event.target.value), 1);
                    filterBooks(filters);
                }
            }
        });

    }
    render(dataSource.books);
    initActions();








}