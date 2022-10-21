/* eslint-disable array-callback-return */
/* eslint-disable no-throw-literal */
const fs = require('fs');
const path = require('path');
//const { exit } = require('process');
/**  replace in files:
 *  ex: node replace [<config>] ( default config = replace.config.json)
 *  config json format:
 *  {
 *      "replace":[
 *          {
 *              "files":["file1","file2",...],
 *              "rules":[
 *                  {"search":"search string","replace":"new string"},
 *                  ...
 *              ]
 *          },
 *          ...
 *      ]
 *      "delete":[
 *          ".dist/*.json",..
 *      ]
 * }
 *
*/
/** список файлов в папке используя фильтр regexp */
const getFilesByFilter = (startPath, regexFilter, deep, callback) => {
    if (fs.existsSync(startPath)) {
        const files = fs.readdirSync(startPath);
        for (let i = 0; i < files.length; i++) {
            const filename = path.join(startPath, files[i]);
            const stat = fs.lstatSync(filename);
            if (deep && stat.isDirectory()) {
                getFilesByFilter(filename, regexFilter, true, callback); // recurse
            } else if (regexFilter.test(filename)) callback(filename);
        }
    }
};

/** преобразует фильтр * в регуляное выражение, для использования в getFiles */
const maskToRegEx = (str) => {
    let out = str;
    out = out.split('.').join('\\.');
    out = out.split('*').join('\\S*');
    return new RegExp(`${out}$`);
};

/** разделяет имяфайла на путь и имя */
const fileExt = (filename) => {
    const name = path.basename(filename);
    let dir = path.dirname(filename);
    if (dir === '.') dir = './';
    if (dir === '..') dir = '../';
    return { name, dir };
};

const getFiles = (name, deep = false) => {
    const file = fileExt(name);
    const files = [];
    getFilesByFilter(file.dir, maskToRegEx(file.name), deep, (filename) => {
        files.push(filename);
    });
    return files;
};


const replace = (inFile, rules = []) => {
    let data = fs.readFileSync(inFile, { encoding: 'utf8', flag: 'r' });
    rules.map((rule) => {
        console.log(`    search:"${rule.search}"`, `,replace:"${rule.replace}"`);
        data = data.split(rule.search).join(rule.replace);
    });
    fs.writeFileSync(inFile, data, { encoding: 'utf8' });
};

async function main(configFileName) {
    
    if (!fs.existsSync(configFileName)) {
        throw `config file [${configFileName}] is not exists`;
    }

    let count = 0;
    const configJSON = fs.readFileSync(configFileName);
    const config = JSON.parse(configJSON);


    if (config.replace && config.replace.length) {
        console.log('  change ------------------');    
        config.replace.map((it) => {
            it.files.map((name) => {
                const files = getFiles(name);
                files.map((file) => {
                    console.log(`    change: ${file}`);
                    replace(file, it.rules);
                    count++;
                });
            });
        });
        console.log('  change '+ count +' files');
        console.log('');
    };

    if (config.delete && config.delete.length) {
        console.log('  delete  ------------------');    
        
        count = 0;
        config.delete.map((name) => {
            const files = getFiles(name);
            files.map((filename) => {
                fs.unlinkSync(filename);
                console.log(`    ${filename}`);
            });
        });
        console.log('  delete '+ count +' files');
        console.log('');
    }
    return true;
}

module.exports = main;