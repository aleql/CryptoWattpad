function downloadFile(file){
    console.log(file);
    // console.log(encodeURI(file));
    var hiddenElement = document.createElement('a');

    hiddenElement.href = 'data:attachment/text,' + encodeURI(file);
    hiddenElement.target = '_blank';
    hiddenElement.download = 'test.pdf';
    hiddenElement.click();
}

function processFile(evt) {
    var file = evt.target.files[0],
        reader = new FileReader();

    var desencryptedFile;

    reader.onload = async function(e) {
        //console.log(e.target.result)
        var data = new TextEncoder().encode(e.target.result);
        // var iv = crypto.getRandomValues(new Uint8Array(32));
        var iv =  crypto.getRandomValues(new Uint8Array(64));
        var pkey = await crypto.subtle.generateKey({ 'name': "AES-GCM", 'length': 256}, true, ['encrypt', 'decrypt']);
        var encryptedFile = await crypto.subtle.encrypt({
            name: "AES-GCM", iv, tagLength: 128}, pkey, data);
        desencryptedFile = await crypto.subtle.decrypt({
            name: "AES-GCM", iv, tagLength: 128, }, pkey, encryptedFile).catch(function(err){
                console.error(err);
            });;
        const plaintext = new TextDecoder().decode(desencryptedFile);
        console.log(plaintext);
        downloadFile(plaintext);
        // desencryptedFile = crypto.subtle.decrypt({ 'name': 'AES-CBC', iv }, pkey, encryptedFile);
    }

    reader.readAsText(file);   

    
}