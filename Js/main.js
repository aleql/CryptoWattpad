var cryptoWattpad;

function startApp() {
  var cryptoWattpadAddress = "YOUR_CONTRACT_ADDRESS";
  cryptoWattpad = new web3js.eth.Contract(cryptoWattpadABI, cryptoWattpadAddress);

  // Actualizar ventana
  getAllBooks()
      .then(displayBooks);
}

window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
  } else {
    // Handle the case where the user doesn't have Metamask installed
    // Probably show them a message prompting them to install Metamask
  }

  // Now you can start your app & access web3 freely:
  startApp()

})

// Book functions getters
function getBookDetails(id) {
  return cryptoWattpad.methods.books(id).call()
}

function bookToOwner(owner) {
   return cryptoWattpad.methods.zombieToOwner(id).call
}

function displayAllBooks() {
  // Vaciar divs de books
  $("#books").empty();

  // Iterar sobre todos los ids
  var ids =  cryptoWattpad.methods.books().call();
  for (id of ids) {
    getBookDetails(id)
      .then(function(details) {
        // Using ES6's "template literals" to inject variables into the HTML.
        // Append each one to our #book div
        $("#books").append(`<div class="book"` + id + `>` +
          `<ul>` + 
            `<li>Title: ${book.title}</li>` +
            `<li>Author: ${book.author}</li>` +
            `<li>Descrition: ${book.description}</li>` +
            `<li>Categories: ${book.categories}</li>` +
            `<li>Price: ${book.price}</li>` +
          `</ul>` +
        `</div>`);
      });
  }
}

function createNewBook(title, author, description, categories, price) {
    // This is going to take a while, so update the UI to let the user know
    // the transaction has been sent
    $("#txStatus").text("Creating new book on the blockchain. This may take a while...");
    // Send the tx to our contract: ||| TODO: FALTA IPFS HASH POR AQUI |||
    return cryptoWattpad.methods.createNewBook(title, author, description, categories, price)
    .send({ from: userAccount })
    .on("receipt", function(receipt) {
    $("#txStatus").text("Successfully created " + name + "!");
    // Transaction was accepted into the blockchain, let's redraw the UI
    displayAllBooks();
    })
    .on("error", function(error) {
    // Do something to alert the user their transaction has failed
    $("#txStatus").text(error);
    });
}

function buyBook(bookId) {
    $("#txStatus").text("Proceding to book purchase...");
    return cryptoWattpad.methods.downloadBook(bookId)
    .send({ from: userAccount, value: web3js.utils.toWei("0.001", "ether") }) // MANDAR PRECIO QUE APARECE DEL LIBRO
    .on("receipt", function(receipt) {
      $("#txStatus").text("BOOK SUCCESFUL BOUGHT");
      })
    .then(function (returnValue) {
        // DESencriptar libro :O
    })
    .on("error", function(error) {
      $("#txStatus").text(error);
    });
}