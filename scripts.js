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
    <button onclick="closePopup()">Close</button>
  `;

  openPopup(bookDetails);
}

// Clear the input fields for adding a new book
function clearAddBookFields() {
  document.getElementById('barcode').value = '';
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
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

// Search for books
function searchBooks() {
  const query = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query));
  displayBooks(filteredBooks);
}

// Initialize the page
showTab('home');
