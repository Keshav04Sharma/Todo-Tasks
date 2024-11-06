const encrypter = require('bcrypt');

const encrypt = (password)=>{
    return encrypter.hashSync(password, 10);
}

const compare = (password, hash)=>{
    console.log(password, hash)
    return encrypter.compareSync(password, hash);
}

exports.encrypt = encrypt;
exports.compare = compare;