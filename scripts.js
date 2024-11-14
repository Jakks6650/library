// Dummy data for testing
const books = [];

// Store current book stats
const stats = {
  totalBooks: 0,
  checkedOut: 0,
  onHold: 0,
  lost: 0
};

// Switch tabs
function showTab(tabId) {
  document.querySelectorAll('.tab-content').forEach(tab => {
    tab.style.display = 'none';
  });
  document.getElementById(tabId).style.display = 'block';
}

// Register a new book
function registerBook() {
  const barcode = document.getElementById('barcode').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  if (!barcode || !title || !author) {
    alert("Please fill in all fields");
    return;
  }

  const book = {
    barcode,
    title,
    author,
    status: 'Available',
    checkoutDate: null,
    holder: null,
    dueDate: null,
    notes: [],
    hold: false
  };

  books.push(book);
  updateStats();
  displayBooks();
  clearAddBookFields();
}

// Update stats on the home page
function updateStats() {
  stats.totalBooks = books.length;
  stats.checkedOut = books.filter(book => book.status === 'Checked Out').length;
  stats.onHold = books.filter(book => book.hold).length;
  stats.lost = books.filter(book => book.status === 'Lost').length;

  document.getElementById('total-books').textContent = stats.totalBooks;
  document.getElementById('checked-out-count').textContent = stats.checkedOut;
  document.getElementById('hold-count').textContent = stats.onHold;
  document.getElementById('lost-count').textContent = stats.lost;
}

// Display books in the library tab
function displayBooks() {
  const bookTable = document.getElementById('book-table');
  bookTable.innerHTML = books.map(book => `
    <tr onclick="viewBookDetails('${book.barcode}')">
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td><span class="status-${book.status.replace(' ', '-').toLowerCase()}">${book.status}</span></td>
    </tr>
  `).join('');
}

// Open the detailed view of a book when clicked
function viewBookDetails(barcode) {
  const book = books.find(b => b.barcode === barcode);
  if (!book) return;

  const bookDetails = `
    <h3>${book.title}</h3>
    <p><strong>Author:</strong> ${book.author}</p>
    <p><strong>Status:</strong> <span class="status-${book.status.replace(' ', '-').toLowerCase()}">${book.status}</span></p>
    <p><strong>Holder:</strong> ${book.holder ? book.holder : 'N/A'}</p>
    <p><strong>Due Date:</strong> ${book.dueDate ? book.dueDate : 'N/A'}</p>
    <p><strong>Notes:</strong> ${book.notes.length ? book.notes.join(', ') : 'None'}</p>
    <p><strong>Hold:</strong> ${book.hold ? 'Yes' : 'No'}</p>
    <button onclick="toggleHold('${barcode}')">Toggle Hold</button>
    <button onclick="addNote('${barcode}')">Add Note</button>
    <button onclick="forceLate('${barcode}')">Force Late</button>
    <button onclick="extendDueDate('${barcode}')">Extend Due Date</button>
  `;
  
  const detailsPopup = document.createElement('div');
  detailsPopup.classList.add('popup');
  detailsPopup.innerHTML = bookDetails;
  document.body.appendChild(detailsPopup);
}

// Toggle the hold status for a book
function toggleHold(barcode) {
  const book = books.find(b => b.barcode === barcode);
  if (book) {
    book.hold = !book.hold;
    book.status = book.hold ? 'On Hold' : 'Available';
    updateStats();
    displayBooks();
    closePopup();
  }
}

// Add a note to the book
function addNote(barcode) {
  const note = prompt("Enter a note for the book:");
  if (note) {
    const book = books.find(b => b.barcode === barcode);
    if (book) {
      book.notes.push(note);
      updateStats();
      displayBooks();
      closePopup();
    }
  }
}

// Force the book as late
function forceLate(barcode) {
  const book = books.find(b => b.barcode === barcode);
  if (book) {
    book.status = 'Late';
    book.dueDate = new Date().toLocaleDateString();
    updateStats();
    displayBooks();
    closePopup();
  }
}

// Extend the due date for a book
function extendDueDate(barcode) {
  const extensionDays = parseInt(prompt("Enter the number of days to extend the due date:"));
  if (isNaN(extensionDays) || extensionDays <= 0) {
    alert("Please enter a valid number.");
    return;
  }

  const book = books.find(b => b.barcode === barcode);
  if (book) {
    const currentDueDate = new Date(book.dueDate);
    currentDueDate.setDate(currentDueDate.getDate() + extensionDays);
    book.dueDate = currentDueDate.toLocaleDateString();
    updateStats();
    displayBooks();
    closePopup();
  }
}

// Close the popup
function closePopup() {
  document.querySelectorAll('.popup').forEach(popup => {
    popup.remove();
  });
}

// Search through the books
function searchBooks() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(query) || 
    book.author.toLowerCase().includes(query)
  );
  displayFilteredBooks(filteredBooks);
}

// Display the filtered books based on the search
function displayFilteredBooks(filteredBooks) {
  const bookTable = document.getElementById('book-table');
  bookTable.innerHTML = filteredBooks.map(book => `
    <tr onclick="viewBookDetails('${book.barcode}')">
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td><span class="status-${book.status.replace(' ', '-').toLowerCase()}">${book.status}</span></td>
    </tr>
  `).join('');
}

// Register the return of a book
function returnBook() {
  const barcode = document.getElementById('return-barcode').value;
  const book = books.find(b => b.barcode === barcode);

  if (!book) {
    alert("Book not found.");
    return;
  }

  // Simulate sound feedback
  if (book.status === 'Checked Out') {
    book.status = 'Available';
    book.dueDate = null;
    book.holder = null;
    alert('Book returned successfully.');
  } else if (book.status === 'Late') {
    book.status = 'Lost';
    alert('This book is lost.');
  } else if (book.hold) {
    alert(`This book has a hold by ${book.holder}.`);
  } else {
    alert('This book is not currently checked out.');
  }

  updateStats();
  displayBooks();
}

// Clear the add book fields
function clearAddBookFields() {
  document.getElementById('barcode').value = '';
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
}

// Default to the home tab
showTab('home');
