function Book(title, author, pages, isRead) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = isRead

    this.info = () => {
        const hasBeenRead = this.isRead ? 'has been read' : 'not read yet';
        return title + ' by ' + author + ', ' + pages + ' pages, ' + hasBeenRead;
    }
}

const myLibrary = [];

function addBookToLibrary(book) {
    myLibrary.push(book);
}

const wrapper = document.getElementById('wrapper');

function displayLibrary() {
    const libraryOutput = document.getElementById('library-output');
    libraryOutput.innerHTML = '';

    for (let i = 0; i < myLibrary.length; i++) {
        const book = myLibrary[i];

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
        toggleReadBtn['data-attribute-book-index'] = myLibrary.indexOf(book);
        toggleReadBtn.innerText = 'Toggle Read';
        toggleReadBtn.onclick = () => {
            const el = myLibrary[toggleReadBtn['data-attribute-book-index']];
            el.isRead = !el.isRead;
            displayLibrary();
        }

        isReadTD.classList.add('is-read');
        isReadTD.appendChild(toggleReadBtn);

        // Remove book
        const removeBookBtn = document.createElement('button');
        removeBookBtn['data-attribute-book-index'] = myLibrary.indexOf(book);
        removeBookBtn.innerText = "Remove";
        removeBookBtn.onclick = () => {
            const el = myLibrary[toggleReadBtn['data-attribute-book-index']];
            myLibrary.splice(myLibrary.indexOf(el), 1);
            displayLibrary();
        }

        removeTD.classList.add('remove-book');
        removeTD.appendChild(removeBookBtn);

        bookTR.appendChild(titleTD);
        bookTR.appendChild(authorTD);
        bookTR.appendChild(pagesTD);
        bookTR.appendChild(isReadTD);
        bookTR.appendChild(removeTD);

        libraryOutput.appendChild(bookTR)
    }
}


const theHobbit = new Book("The Hobbit", "J.R.R. Tolkein", 295, false);
const theSprawl = new Book("The Sprawl", "Hamish Cameron", 250, true);
const indexCardRPG = new Book("Index Card RPG", "Runehammer Games", 209, true);

addBookToLibrary(theHobbit);
addBookToLibrary(theSprawl);
addBookToLibrary(indexCardRPG);

const newBookForm = document.getElementById('newBookForm');

const newBookDialog = document.getElementById('newBookDialog');
// newBookDialog.showModal();

newBookDialog.onclose = () => {
    const newBook = new Book(
        newBookForm.title.value,
        newBookForm.author.value,
        newBookForm.pages.value,
        newBookForm.isRead.value === 'true' ? true : false
    )

    myLibrary.push(newBook);

    newBookForm.title.value = '';
    newBookForm.author.value = '';
    newBookForm.pages.value = '';
    newBookForm.isRead.value = false;
    displayLibrary();
}

const newBookButton = document.getElementById('newBookButton');

displayLibrary();
newBookButton.onclick = () => {
    newBookDialog.showModal()
}