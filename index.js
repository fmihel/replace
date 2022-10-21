const path = require('path');
const replace = require('./source/replace');

const args = process.argv.slice(2);
const configFileName = args[0] || path.join(__dirname, '../../replace.config.json');


console.log('replace ------------------- ');
replace(configFileName)
    .then(() => {
        console.log('replace: ok ---------------- ');
    }).catch((e) => {
        console.error(e);
        console.log('replace: error ------------- ');
    });
