// Initialize the books array (can be replaced with real data)
let books = [
  { barcode: "12345", title: "Book One", author: "Author One", status: "available", dueDate: "", checkedOutBy: "", hold: "", note: "" },
  { barcode: "67890", title: "Book Two", author: "Author Two", status: "available", dueDate: "", checkedOutBy: "", hold: "", note: "" }
];

// Function to show a specific tab
function showTab(tabName) {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => tab.style.display = 'none'); // Hide all tabs
  const activeTab = document.getElementById(tabName);
  if (activeTab) {
    activeTab.style.display = 'block'; // Show the selected tab
  }
}

// Function to add a new book
function addBook() {
  const barcode = document.getElementById('barcode').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const newBook = { barcode, title, author, status: "available", dueDate: "", checkedOutBy: "", hold: "", note: "" };
  books.push(newBook);
  displayBooks(books);
  clearAddBookFields();
}

// Display all books
function displayBooks(bookList) {
  const bookContainer = document.getElementById('book-list');
  bookContainer.innerHTML = ''; // Clear the book list
  bookList.forEach(book => {
    const bookElement = document.createElement('div');
    bookElement.classList.add('book');
    bookElement.innerHTML = `
      <span>${book.title}</span>
      <span>${book.author}</span>
      <span class="status ${book.status}">${book.status}</span>
      <button onclick="viewBookDetails('${book.barcode}')">View</button>
    `;
    bookContainer.appendChild(bookElement);
  });
}

// View book details
function viewBookDetails(barcode) {
  const book = books.find(b => b.barcode === barcode);
  const bookDetails = `
    <h3>${book.title}</h3>
    <p>Author: ${book.author}</p>
    <p>Status: ${book.status}</p>
    <p>Checked Out By: ${book.checkedOutBy || 'N/A'}</p>
    <p>Due Date: ${book.dueDate || 'N/A'}</p>
    <p>Hold: ${book.hold || 'No holds'}</p>
    <p>Note: ${book.note || 'No notes'}</p>
    <button onclick="closePopup()">Close</button>
  `;
  openPopup(bookDetails);
}

// Open a popup
function openPopup(content) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.innerHTML = content;
  document.body.appendChild(popup);
}

// Close the popup
function closePopup() {
  const popup = document.querySelector('.popup');
  if (popup) {
    popup.remove();
  }
}

// Clear the input fields for adding a new book
function clearAddBookFields() {
  document.getElementById('barcode').value = '';
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
}

// Search for books
function searchBooks() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
  displayBooks(filteredBooks);
}

// Handle checking out books
function checkoutBook(barcode, userName) {
  const book = books.find(b => b.barcode === barcode);
  if (book && book.status === "available") {
    const today = new Date();
    book.status = "checked out";
    book.checkedOutBy = userName;
    book.dueDate = new Date(today.setDate(today.getDate() + 30)).toLocaleDateString();
    displayBooks(books);
  } else {
    alert("Book is already checked out or not available.");
  }
}

// Mark a book as lost
function markLost(barcode) {
  const book = books.find(b => b.barcode === barcode);
  if (book) {
    book.status = "lost";
    displayBooks(books);
  }
}

// Handle returns
function returnBook(barcode) {
  const book = books.find(b => b.barcode === barcode);
  if (book) {
    const today = new Date();
    const dueDate = new Date(book.dueDate);
    if (today > dueDate) {
      book.status = "late";
      alert("Book is late!");
    } else {
      book.status = "available";
      alert("Book returned on time.");
    }
    book.checkedOutBy = "";
    book.dueDate = "";
    displayBooks(books);
  }
}

// Add a hold to a book
function addHold(barcode, userName) {
  const book = books.find(b => b.barcode === barcode);
  if (book && book.status !== "checked out") {
    book.hold = userName;
    displayBooks(books);
  } else {
    alert("Cannot place hold on a checked-out book.");
  }
}

// Add a note to a book
function addNote(barcode, note) {
  const book = books.find(b => b.barcode === barcode);
  if (book) {
    book.note = note;
    displayBooks(books);
  }
}

// Initialize the page
showTab('home');
