const books = [];

// Register a new book
function registerBook() {
  const barcode = document.getElementById('barcode').value;
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;

  const book = {
    barcode,
    title,
    author,
    status: 'Available',
    checkoutDate: null,
    holder: null,
    notes: null
  };

  books.push(book);
  displayBooks();
  clearInputs();
}

// Display books in table
function displayBooks() {
  const bookTable = document.getElementById('book-table');
  bookTable.innerHTML = books.map(book => `
    <tr>
      <td>${book.barcode}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.status}</td>
      <td>
        <button onclick="checkoutBook('${book.barcode}')">Checkout</button>
      </td>
    </tr>
  `).join('');
}

// Checkout book
function checkoutBook(barcode) {
  const book = books.find(b => b.barcode === barcode);
  const holderName = prompt("Enter patron's name:");
  if (book && holderName) {
    book.status = 'Checked Out';
    book.checkoutDate = new Date();
    book.holder = holderName;
    displayBooks();
  }
}

// Return book
function returnBook() {
  const barcode = document.getElementById('return-barcode').value;
  const book = books.find(b => b.barcode === barcode);
  const today = new Date();
  
  if (book) {
    const dueDate = new Date(book.checkoutDate);
    dueDate.setDate(dueDate.getDate() + 30);

    if (book.status === 'Checked Out') {
      if (today > dueDate) {
        playSound('bonk');  // Late return
      } else {
        playSound('ding');  // On-time return
      }
      book.status = 'Available';
      book.checkoutDate = null;
      book.holder = null;
    } else if (book.status === 'Hold') {
      playSound('twinkle');  // Hold alert
      alert(`Hold for ${book.holder}`);
    }
  } else {
    playSound('chime');  // Book not found or banned
    alert("Book not found in the system or marked banned.");
  }
  displayBooks();
}

// Play sound based on return status
function playSound(type) {
  const sounds = {
    ding: new Audio('ding.mp3'),
    bonk: new Audio('bonk.mp3'),
    twinkle: new Audio('twinkle.mp3'),
    chime: new Audio('chime.mp3')
  };
  sounds[type].play();
}

// Clear input fields
function clearInputs() {
  document.getElementById('barcode').value = '';
  document.getElementById('title').value = '';
  document.getElementById('author').value = '';
}

// Search books
function searchBooks() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const filteredBooks = books.filter(book => 
    book.title.toLowerCase().includes(searchTerm) ||
    book.author.toLowerCase().includes(searchTerm) ||
    book.status.toLowerCase().includes(searchTerm)
  );
  document.getElementById('book-table').innerHTML = filteredBooks.map(book => `
    <tr>
      <td>${book.barcode}</td>
      <td>${book.title}</td>
      <td>${book.author}</td>
      <td>${book.status}</td>
      <td>
        <button onclick="checkoutBook('${book.barcode}')">Checkout</button>
      </td>
    </tr>
  `).join('');
}
