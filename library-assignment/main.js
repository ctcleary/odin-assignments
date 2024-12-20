class Book {
    constructor(title, author, pages, isRead) {
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }

    info() {
        const hasBeenRead = this.isRead ? 'has been read' : 'not read yet';
        return this.title + ' by ' + this.author + ', ' + this.pages + ' pages, ' + hasBeenRead;
    }
}

class Library {
    constructor(wrapperEl, libraryOutputEl) {
        this.books = [];
        this.wrapper = wrapperEl;
        this.libraryOutput = libraryOutputEl;
    }

    addBookToLibrary(book) {
        this.books.push(book);
    }

    displayLibrary() {
        this.libraryOutput.innerHTML = '';
    
        for (let i = 0; i < this.books.length; i++) {
            const book = this.books[i];
    
            const bookTR = document.createElement('tr');
    
            const titleTD = document.createElement('td');
            const authorTD = document.createElement('td');
            const pagesTD = document.createElement('td');
            const isReadTD = document.createElement('td');
            const removeTD = document.createElement('td');
    
            titleTD.innerText = book.title;
            authorTD.innerText = book.author;
            pagesTD.innerText = book.pages;
    
            // is Read and Toggle button
            const isReadP = document.createElement('p');
            isReadP.innerText = book.isRead ? 'Yes' : 'No';
            isReadTD.appendChild(isReadP);
    
            const toggleReadBtn = document.createElement('button');
            toggleReadBtn.classList.add('toggle-read-btn');
            toggleReadBtn['data-attribute-book-index'] = this.books.indexOf(book);
            toggleReadBtn.innerText = 'Toggle Read';
            toggleReadBtn.onclick = () => {
                const bookIndex = toggleReadBtn['data-attribute-book-index'];
                const el = this.books[bookIndex];
                el.isRead = !el.isRead;
                this.displayLibrary();
            }
    
            isReadTD.classList.add('is-read');
            isReadTD.appendChild(toggleReadBtn);
    
            // Remove book
            const removeBookBtn = document.createElement('button');
            removeBookBtn['data-attribute-book-index'] = this.books.indexOf(book);
            removeBookBtn.innerText = "Remove";
            removeBookBtn.onclick = () => {
                const bookIndex = toggleReadBtn['data-attribute-book-index'];
                const el = this.books[bookIndex];
                this.books.splice(this.books.indexOf(el), 1);
                this.displayLibrary();
            }
    
            removeTD.classList.add('remove-book');
            removeTD.appendChild(removeBookBtn);
    
            bookTR.appendChild(titleTD);
            bookTR.appendChild(authorTD);
            bookTR.appendChild(pagesTD);
            bookTR.appendChild(isReadTD);
            bookTR.appendChild(removeTD);
    
            this.libraryOutput.appendChild(bookTR)
        }
    }
}


const wrapper = document.getElementById('wrapper');
const libraryOutput = document.getElementById('library-output');

const myLibrary = new Library(wrapper, libraryOutput);

const theHobbit = new Book("The Hobbit", "J.R.R. Tolkein", 295, false);
const theSprawl = new Book("The Sprawl", "Hamish Cameron", 250, true);
const indexCardRPG = new Book("Index Card RPG", "Runehammer Games", 209, true);


myLibrary.addBookToLibrary(theHobbit);
myLibrary.addBookToLibrary(theSprawl);
myLibrary.addBookToLibrary(indexCardRPG);

myLibrary.displayLibrary();

const newBookForm = document.getElementById('newBookForm');
const newBookDialog = document.getElementById('newBookDialog');

newBookDialog.onclose = () => {
    const newBook = new Book(
        newBookForm.title.value,
        newBookForm.author.value,
        newBookForm.pages.value,
        newBookForm.isRead.checked
    )

    myLibrary.addBookToLibrary(newBook);

    newBookForm.title.value = '';
    newBookForm.author.value = '';
    newBookForm.pages.value = '';
    newBookForm.isRead.checked = false;
    myLibrary.displayLibrary();
}

const newBookButton = document.getElementById('newBookButton');
newBookButton.onclick = () => {
    newBookDialog.showModal()
}