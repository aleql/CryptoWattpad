
function downloadFile(file, file_name){
    // console.log(encodeURI(file));
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + file;
    hiddenElement.target = '_blank';
    hiddenElement.download = file_name + '_encrypted.txt';
    hiddenElement.click();
}

function downloadFileHidden(){
    // console.log(encodeURI(file));
    var file = document.getElementById("plaintext").value
    var file_name = document.getElementById("fileName").value;
    var hiddenElement = document.createElement('a');
    hiddenElement.href = 'data:attachment/text,' + encodeURI(file);
    hiddenElement.target = '_blank';
    hiddenElement.download = file_name + '_encrypted.txt';
    hiddenElement.click();
}
// Funciones para transformar arreglo de bytes en str y viceversa

// Transfrona un array buffer a uint16, y eso se pasa a un str
function ab2str(buf) { 
    var uint16 = new Uint16Array(buf);
    var str = "";
    for (var i = 0; i < uint16.length; i++) {
        str += uint16[i] + ",";
    }
    return str
}

// transforma un str a uint16 y eso a ab
  function str2ab(str) {
    var strList = str.split(",");
    var uint16 = new Uint16Array(strList.length);
    for(var i = 0; i< strList.length; i++){
        uint16[i] = Number(strList[i]);
    }
    var buf = new ArrayBuffer(uint16.length*2 - 2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0; i < uint16.length; i++) {
        bufView[i] = uint16[i];
    }
    return buf;
}



//Funciones para transformar arrelgo uint8 a string y viceversa
function uint82str(uint8) {
    var str = "";
    for (var i = 0; i < uint8.length; i++) {
        str += uint8[i] + ",";
    }
    return str
}

function str2uint8(str) {
    var strList = str.split(",");
    var uint8 = new Uint8Array(64);
    for(var i = 0; i< strList.length; i++){
        uint8[i] = Number(strList[i]);
    }
    return uint8
}

// Encriptar archivo
function encryptFile(evt) {
    // get file name
    var fileInput = document.getElementById('file-upload');
    var fileName = fileInput.value.split(/(\\|\/)/g).pop().split('.')[0];

    // Leer y encriptar archivo
    var file = evt.target.files[0],
        reader = new FileReader();

    reader.onload = async function(e) {
        // Encrypt file
        // Check if size is multiplo de 2
        var rawData = e.target.result;
        if (rawData.length%2 !=0){
            rawData += ".";
        }
        // Get data and iv
        var data = new TextEncoder().encode(rawData);
        var iv =  crypto.getRandomValues(new Uint8Array(64));

        // Export Iv as string
        var ivString = uint82str(iv);
        document.getElementById("iv").value = ivString;

        var pkey = await crypto.subtle.generateKey({ 'name': "AES-GCM", 'length': 256}, true, ['encrypt', 'decrypt']);
        var encryptedFile = await crypto.subtle.encrypt({
            name: "AES-GCM", iv, tagLength: 128}, pkey, data);
        // Export key
        var exportKey = await crypto.subtle.exportKey("jwk", pkey);
        var keyString = exportKey.k;
        //console.log(keyString)

        // Poner valor del key en hidden input
        document.getElementById("pkey").value = keyString;

        // Descargar archivo encriptado
        const plaintext = ab2str(encryptedFile);
        
        downloadFile(plaintext, fileName);
    }
    reader.readAsText(file);
}


function desencryptFile(evt) {

    // get file name
    var fileInput = document.getElementById('book_file_encrypted');
    var fileName = fileInput.value.split(/(\\|\/)/g).pop().split('.')[0].split('_')[0];

    // Leer y encriptar archivo
    var file = evt.target.files[0],
        reader = new FileReader();

    reader.onload = async function(e) {
        // Obtener archivo encriptado
        var encryptedFile = str2ab(e.target.result);

        // Obtener key y reconstruirla
        var keyString = document.getElementById("pkey").value; 

        // Reconstruct key and desencrypt
        var jwkKey = {alg: "A256GCM", ext: true, k: keyString, key_ops: ["encrypt", "decrypt"], kty: "oct"};
        var recKey = await crypto.subtle.importKey("jwk", jwkKey,{ 'name': "AES-GCM", 'length': 256}, true, ["encrypt", "decrypt"]);

        // Obtener iv
        var ivString = document.getElementById("iv").value; 
        var iv = str2uint8(ivString)

        //console.log(recKey);
        console.log(encryptedFile);
        desencryptedFile = await crypto.subtle.decrypt({
            name: "AES-GCM", iv, tagLength: 128, }, recKey, encryptedFile).catch(function(err){
                console.error(err.message);
        });;
        const plaintext = new TextDecoder().decode(desencryptedFile);

        // Guardar variables para descargar on click
        document.getElementById("plaintext").value = plaintext;
        document.getElementById("fileName").value = fileName;
        //downloadFile(plaintext, fileName, true);
    }
    reader.readAsText(file);
}





