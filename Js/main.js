var cryptoWattpad;
var userAccount;

function startApp() {
  var cryptoWattpadAddress = "YOUR_CONTRACT_ADDRESS";
  cryptoWattpad = new web3js.eth.Contract(cryptoWattpadABI, cryptoWattpadAddress);

  userAccount = web3.eth.accounts[0];

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
   return cryptoWattpad.methods.bookToOwner(id).call
}

function displayAllBooks() {
  // Vaciar divs de books
  $("#books").empty();

  // Iterar sobre todos los ids
  var ids =  cryptoWattpad.methods.books().call();
  for (id of ids) {
    getBookDetails(id)
      .then(function(book) {
        // Using ES6's "template literals" to inject variables into the HTML.
        // Append each one to our #book div
        if (book_cnt % 2 == 1) {
          $("#books-left").append(
            `<li class="collection-item avatar" id="book-"`+id+`></li>`+
            `<i class="material-icons circle">import_contacts</i>` + 
            `<span class="title"> Título: ${book.title} </span>` +
            `<p style="white-space: pre-wrap;">Autor:  ${book.author} </p>`+
            `<p style="white-space: pre-wrap;">Descripción: ${book.description} </p>`+
            `<p style="white-space: pre-wrap;">Categorías: ${book.categories} </p>`+
            `<p style="white-space: pre-wrap;">Precio: $${book.price} </p>`+
            `<a href="#modal"`+id+` class="secondary-content waves-effect waves-light btn modal-trigger" onclick=buyBook(` + id + `)><i class="material-icons left">attach_money</i>Comprar</a>`+
            ` </li>`+
            `<form class="col s12 m4 l6 offset-m2 l4 offset-l3" onsubmit="">`+
            `<div id="modal"`+id+` class="modal">`+
            `<div class="modal-content">`+
            `<h4>Compra exitosa!</h4>` +
            `<p>IPFS hash: ${book.IPFS_hash}</p>`+
            `<div class="row">`+
            `<div class="file-field input-field">`+
            `<div class="btn"><span>Desencriptar Libro</span><input type="file"></div>`+
            `<div class="file-path-wrapper">`+
            `<input id="file-upload" class="file-path validate" placeholder="Sube tu libro encriptado aquí" onchange="">`+
            `</div></div></div>`+
            `<div class="modal-footer">`+
            `<a href="#!" class="modal-close waves-effect teal btn" type="submit" name="action">Descargar</a>`+
            `</div></div></form>`);
        } else {
          $("#books-right").append(
            `<li class="collection-item avatar" id="book-"`+id+`></li>`+
            `<i class="material-icons circle">import_contacts</i>` + 
            `<span class="title"> Título: ${book.title} </span>` +
            `<p style="white-space: pre-wrap;">Autor:  ${book.author} </p>`+
            `<p style="white-space: pre-wrap;">Descripción: ${book.description} </p>`+
            `<p style="white-space: pre-wrap;">Categorías: ${book.categories} </p>`+
            `<p style="white-space: pre-wrap;">Precio: $${book.price} </p>`+
            `<a href="#modal"`+id+` class="secondary-content waves-effect waves-light btn modal-trigger" onclick=buyBook(` + id + `)><i class="material-icons left">attach_money</i>Comprar</a>`+
            ` </li>`+
            `<form class="col s12 m4 l6 offset-m2 l4 offset-l3" onsubmit="">`+
            `<div id="modal"`+id+` class="modal">`+
            `<div class="modal-content">`+
            `<h4>Compra exitosa!</h4>` +
            `<p>IPFS hash: ${book.IPFS_hash}</p>`+
            `<div class="row">`+
            `<div class="file-field input-field">`+
            `<div class="btn"><span>Desencriptar Libro</span><input type="file"></div>`+
            `<div class="file-path-wrapper">`+
            `<input id="file-upload" class="file-path validate" placeholder="Sube tu libro encriptado aquí" onchange="">`+
            `</div></div></div>`+
            `<div class="modal-footer">`+
            `<a href="#!" class="modal-close waves-effect teal btn" type="submit" name="action">Descargar</a>`+
            `</div></div></form>`);
        }
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
        // Asingar variables de retorno a inputs escondidos
        $('#pkey').attr('value', returnValue._privateKey);
        $('#iv').attr('value', returnValue._iv);

        // Abrir modal correspondiente:
        $("#modal" + bookId).modal('open'); 
        //$("#modal" + bookId).attr("onclick","OpenModal(" + bookId + ")");
    })
    .on("error", function(error) {
      $("#txStatus").text(error);
    });
}
