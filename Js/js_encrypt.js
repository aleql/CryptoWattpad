
function downloadFile(file, file_name){
    // console.log(encodeURI(file));
    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + file;
    hiddenElement.target = '_blank';
    hiddenElement.download = file_name + '_encrypted.txt';
    hiddenElement.click();
}

// Funciones para transformar arreglo de bytes en str y viceversa
function ab2str(buf) {
    return String.fromCharCode.apply(null, new Uint16Array(buf));
  }

function str2ab(str) {
    var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
    var bufView = new Uint16Array(buf);
    for (var i=0, strLen=str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
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
    var fileInput = document.getElementById('book_file');
    var fileName = fileInput.value.split(/(\\|\/)/g).pop().split('.')[0];

    // Leer y encriptar archivo
    var file = evt.target.files[0],
        reader = new FileReader();

    reader.onload = async function(e) {
        // Encrypt file
        var data = new TextEncoder().encode(e.target.result);
        var iv =  crypto.getRandomValues(new Uint8Array(64));

        // Export Iv as string
        console.log(iv);
        var ivString = uint82str(iv);
        console.log(ivString);
        document.getElementById("iv").value = ivString;

        var pkey = await crypto.subtle.generateKey({ 'name': "AES-GCM", 'length': 256}, true, ['encrypt', 'decrypt']);
        var encryptedFile = await crypto.subtle.encrypt({
            name: "AES-GCM", iv, tagLength: 128}, pkey, data);
        //console.log(encryptedFile);
        //console.log(ab2str(encryptedFile));
        //console.log(str2ab(ab2str(encryptedFile)));

        // Export key
        var exportKey = await crypto.subtle.exportKey("jwk", pkey);
        var keyString = exportKey.k;
        console.log(keyString)

        // Poner valor del key en hidden input
        document.getElementById("pkey").value = keyString;

        console.log(encryptedFile);
        console.log(ab2str(encryptedFile));
        console.log(str2ab(ab2str(encryptedFile)));

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
        console.log(encryptedFile);
        //console.log(str2ab(encryptedFile));
        
        // Obtener key y reconstruirla
        var keyString = document.getElementById("pkey").value; 
        console.log(keyString);

        // Reconstruct key and desencrypt
        var jwkKey = {alg: "A256GCM", ext: true, k: keyString, key_ops: ["encrypt", "decrypt"], kty: "oct"};
        var recKey = await crypto.subtle.importKey("jwk", jwkKey,{ 'name': "AES-GCM", 'length': 256}, true, ["encrypt", "decrypt"]);

        // Obtener iv
        var ivString = document.getElementById("iv").value; 
        console.log(ivString);
        console.log(str2uint8(ivString));
        var iv = str2uint8(ivString)

        console.log(recKey);
        console.log(encryptedFile);
        desencryptedFile = await crypto.subtle.decrypt({
            name: "AES-GCM", iv, tagLength: 128, }, recKey, encryptedFile).catch(function(err){
                console.error(err.message);
        });;
        const plaintext = new TextDecoder().decode(desencryptedFile);

        downloadFile(plaintext, fileName);

    }
    reader.readAsText(file);
}






function processFile(evt) {
    var file = evt.target.files[0],
        reader = new FileReader();

    var desencryptedFile;

    reader.onload = async function(e) {
        // Encrypt file
        var data = new TextEncoder().encode(e.target.result);
        var iv =  crypto.getRandomValues(new Uint8Array(64));
        var pkey = await crypto.subtle.generateKey({ 'name': "AES-GCM", 'length': 256}, true, ['encrypt', 'decrypt']);
        var encryptedFile = await crypto.subtle.encrypt({
            name: "AES-GCM", iv, tagLength: 128}, pkey, data);


        // Export key
        var exportKey = await crypto.subtle.exportKey("jwk", pkey);
        var keyString = exportKey.k;
        console.log(exportKey);
        console.log(keyString)

        // Reconstruct key and desencrypt
        var jwkKey = {alg: "A256GCM", ext: true, k: keyString, key_ops: ["encrypt", "decrypt"], kty: "oct"};
        var recKey = await crypto.subtle.importKey("jwk", jwkKey,{ 'name': "AES-GCM", 'length': 256}, true, ["encrypt", "decrypt"]);
        
        console.log(recKey);
        // iv =  crypto.getRandomValues(new Uint8Array(64));
        console.log(encryptedFile);
        desencryptedFile = await crypto.subtle.decrypt({
            name: "AES-GCM", iv, tagLength: 128, }, recKey, encryptedFile).catch(function(err){
                console.error(err);
            });;
        const plaintext = new TextDecoder().decode(desencryptedFile);

        downloadFile(plaintext, "Boy");
    }

    reader.readAsText(file);   

    
}





function processFile2(evt) {
    var file = evt.target.files[0],
        reader = new FileReader();

    var desencryptedFile;

    reader.onload = async function(e) {
        // Encrypt file
        var data = new TextEncoder().encode(e.target.result);

        // Export iv
        var iv =  crypto.getRandomValues(new Uint8Array(64));
        var ivString = uint82str(iv);
        console.log(ivString);
        document.getElementById("iv").value = ivString;

        
        document.getElementById("iv").value = ivString;
        var pkey = await crypto.subtle.generateKey({ 'name': "AES-GCM", 'length': 256}, true, ['encrypt', 'decrypt']);
        var encryptedFile = await crypto.subtle.encrypt({
            name: "AES-GCM", iv, tagLength: 128}, pkey, data);


        // Export key
        var exportKey = await crypto.subtle.exportKey("jwk", pkey);
        var keyString = exportKey.k;
        console.log(keyString)

        // Poner valor del key en hidden input
        document.getElementById("pkey").value = keyString;


        /////////

        // Obtener key y reconstruirla
        var keyString = document.getElementById("pkey").value; 
        console.log(keyString);


         // Reconstruct key and desencrypt
        var jwkKey = {alg: "A256GCM", ext: true, k: keyString, key_ops: ["encrypt", "decrypt"], kty: "oct"};
        var recKey = await crypto.subtle.importKey("jwk", jwkKey,{ 'name': "AES-GCM", 'length': 256}, true, ["encrypt", "decrypt"]);

        // Obtener iv
        var ivString = document.getElementById("iv").value; 
        console.log(ivString);
        console.log(str2uint8(ivString));
        var iv = str2uint8(ivString)

        console.log(recKey);
        console.log(encryptedFile);

        // Desencriptar
        desencryptedFile = await crypto.subtle.decrypt({
            name: "AES-GCM", iv, tagLength: 128, }, recKey, encryptedFile).catch(function(err){
                console.error(err);
            });;
        const plaintext = new TextDecoder().decode(desencryptedFile);

        downloadFile(plaintext, "Boy");
    }

    reader.readAsText(file);   

    
}
