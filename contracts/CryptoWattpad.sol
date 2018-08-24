
// solium-disable linebreak-style
pragma solidity ^0.4.19;

contract BookFactory {

    // Eventos
    event bookAdded(int message);
    event bookDownload(string IPFS_hash, string private_key);

    // Variables globales
    Book[] public books;
    string[] private private_keys;
    mapping (uint => address) public bookToOwner;

    struct Book {
       // string image;
        string title;
        string author;
        string description;
        string categories;
        string IPFS_hash;
        uint price;
    }

    
    function uploadBook(string _title, string _author, string _description, string _categories, string _IPFShash, uint _price, string _private_key) public {
        if (_price >= 0 && bytes(_author).length > 0 && bytes(_author).length > 0) {
            address _auth_address = msg.sender;
            uint id = books.push(Book(_title, _author, _description, _categories, _IPFShash, _price)) - 1;
            private_keys.push(_private_key);
            bookToOwner[id] = _auth_address;
            emit bookAdded(1);
        } else { // falla
            emit bookAdded(0);
        }
    }

    function downloadBook(uint256 _bookId) public payable returns (string, string){
        Book storage _dBook = books[_bookId];
        address _authAddress = bookToOwner[_bookId];
        uint price = _dBook.price;
        require(msg.value == price, "Se transfirio menos del monto requerido");
        
        // Repartir ganacias :D
        _authAddress.transfer(price);
        string storage _privateKey = private_keys[_bookId];
        //emit bookDownload(_dBook.IPFS_hash, _privateKey);
        return (_dBook.IPFS_hash, _privateKey);
    }
    
}
