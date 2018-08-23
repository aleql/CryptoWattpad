// Crear nodo ipfs
const IPFS = require('ipfs')
var node = new IPFS()

function uploadBookIPFS('bookName') {
  node.on('ready', async () => {
    const version = await node.version()
    const filesAdded = await node.files.add({
      path: 'bookName.pdf',
      content: Buffer.from('Hello World 101')
    })
    
    console.log('Added file:', filesAdded[0].path, filesAdded[0].hash)
  })
}


// Guardar en el web storage
(function() {
  // Use an input to show the current value and let
  // the user set a new one
  var input = document.getElementById("theValue");

  // Reading the value, which was store as "theValue"
  if (localStorage && 'theValue' in localStorage) {
    input.value = localStorage.theValue;
  }

  document.getElementById("setValue").onclick = function () {
    // Writing the value
    localStorage && (localStorage.theValue = input.value);
  };
})();