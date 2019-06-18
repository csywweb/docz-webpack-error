const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');

function isDir(dir) {
    return fs.lstatSync(dir).isDirectory();
}

function compile(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
        const absolutePath = path.join(dir, file);
        if (isDir(absolutePath)) {
            return compile(absolutePath);
        }
        if (/\.scss$/.test(file)) {
            const data = fs.readFileSync(absolutePath, 'utf-8');
            sass.render({ data }, (err, result) => {
                if (err) {
                    return console.error(err);
                }
                const outputPath = absolutePath.replace('packages', 'lib').replace('.scss', '.css').replace('/index.css', '/style/index.css');
                fs.outputFileSync(outputPath, result.css);
            });
        }
    });
}

const dir = path.join(__dirname, '../packages');
compile(dir);
