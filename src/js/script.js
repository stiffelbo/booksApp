{
    'use strict';

    class BooksList {
        constructor(booksData) {
            const thisBooksList = this;
            thisBooksList.booksData = booksData;

            thisBooksList.getElements();
            thisBooksList.render(booksData);
            thisBooksList.initActions();
        }

        getElements() {
            const thisBooksList = this;

            thisBooksList.dom = {};
            thisBooksList.select = {
                templateOf: {
                    book: '#template-book'
                },
                booksList: '.books-list',
                bookCovers: '.book__image',
                dataId: 'data-id',
                filters: '.filters',
            }

            thisBooksList.dom.booksListWrapper = document.querySelector(thisBooksList.select.booksList);
            thisBooksList.dom.filtersForm = document.querySelector(thisBooksList.select.filters);
        }

        render(booksData) {
            const thisBooksList = this;

            thisBooksList.templates = {
                book: Handlebars.compile(document.querySelector(thisBooksList.select.templateOf.book).innerHTML),
            }

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
                const generatedHTML = thisBooksList.templates.book(book);
                //Create DOM using utils.createDOMFromHTML()
                const element = utils.createDOMFromHTML(generatedHTML);
                //Add element to booksList
                thisBooksList.dom.booksListWrapper.appendChild(element);
            }

        }

        filterBooks(filters) {
            const thisBooksList = this;

            //get all books covers dom elements
            const allBooksCovers = thisBooksList.dom.booksListWrapper.querySelectorAll(thisBooksList.select.bookCovers);
            //remove class hidden from all covers
            for (const cover of allBooksCovers) {
                cover.classList.remove('hidden');
            }
            //check all dataSource.books
            for (const book of thisBooksList.booksData) {
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
                    const bookCoverToHide = thisBooksList.dom.booksListWrapper.querySelector('.book__image[data-id = "' + book.id + '"]');
                    bookCoverToHide.classList.add('hidden');
                }
            }
        }

        initActions() {
            const thisBooksList = this;
            const filters = [];
            thisBooksList.favoriteBooks = [];
            thisBooksList.dom.booksListWrapper.addEventListener('dblclick', function(event) {
                event.preventDefault();

                if (event.target && event.target.nodeName == "IMG") {
                    const element = event.target.parentNode.parentNode; // jest jakas metoda by wskazać element rodzić ale danego typu?
                    //zamiast na sztywno pisać parentNode myślałem o pętli, która bedzie szukac aż znajdzie node o nazwie "A"
                    //Ale może jest cos jeszce prostszego??

                    //Check if data-id in favorites
                    const bookId = element.getAttribute(thisBooksList.select.dataId);
                    if (thisBooksList.favoriteBooks.indexOf(bookId) == -1) {
                        thisBooksList.favoriteBooks.push(bookId);
                        element.classList.add('favorite');
                    } else {
                        thisBooksList.favoriteBooks.splice(thisBooksList.favoriteBooks.indexOf(bookId), 1);
                        element.classList.remove('favorite');
                    }
                }
            });

            thisBooksList.dom.filtersForm.addEventListener('click', function(event) {

                if (event.target.tagName == "INPUT" && event.target.type == 'checkbox' && event.target.name == 'filter') {
                    if (event.target.checked) {
                        filters.push(event.target.value);
                        thisBooksList.filterBooks(filters);
                    } else {
                        filters.splice(filters.indexOf(event.target.value), 1);
                        thisBooksList.filterBooks(filters);
                    }
                }
            });

        }
    }

    const booksListApp = new BooksList(dataSource.books);


}