const fs = require('fs-extra');
const path = require('path');
const copyDir = require('copy-dir');
const replaceInFile = require('replace-in-file');
const util = require('./util');

const name = process.argv[2];
const nameArr = name.split('_');
let dashName = ''; // 中横线名称
let upperName = ''; // 大写驼峰名称

const packageTplPath = path.resolve(__dirname, './templates/package');
const packagePath = path.resolve(__dirname, `../src/components/${name}`);

nameArr.map((s, i) => {
    dashName += (i == 0 ? s : `-${s}`);
    upperName += `${s.substring(0, 1).toUpperCase()}${s.substring(1, 999)}`;
});


function replaceContent() {
    const options = {
        files: [
            path.join(packagePath, '__story__.js'),
            path.join(packagePath, 'index.js'),
            path.join(packagePath, 'index.scss'),
            path.join(packagePath, 'README.md'),
        ],
        from: [/{{name}}/g, /{{dashName}}/g, /{{upperName}}/g],
        to: [name, dashName, upperName],
    };
    replaceInFile(options);
}

function copyTplDir() {
    copyDir(packageTplPath, packagePath, (err) => {
        if (err) {
            throw new Error(err);
        } else {
            replaceContent();
        }
    });
}

function creagePackage() {
    if (!name) {
        throw new Error('未传入package名称，例如：npm run package -- package_name');
    }
    const hasPackage = fs.existsSync(packagePath);
    if (hasPackage) {
        throw new Error(`组件已存在，请检查 ${packagePath}`);
    }
    if (!util.checkoutNameByUnderline(name)) {
        throw new Error(`不符合下划线命名规则，${packagePath}，请以小写字母开头,非下划线结尾,下划线与数字命名package，例如 package_name`);
    }

    copyTplDir();
}

creagePackage();
