const fs = require('fs-extra');
const path = require('path');
const sass = require('node-sass');
const util = require('./util');

const packagesPath = path.resolve(__dirname, '../src/components');
const outputPath = path.resolve(__dirname, '../lib/components');

/**
 * 未样式引入创建 js 文件
 * @param {*} packageName
 */
function createJsFileForImport(packageName, hasStyleFile) {
    const jsPath = path.resolve(outputPath, `${packageName}/style/index.js`);
    const jsFileContent = hasStyleFile ? 'require(\'./index.css\');' : '';
    fs.writeFileSync(jsPath, jsFileContent);
}

/**
 * 创建样式相关文件夹
 * @param {*} dir
 */
function createStyleDir(packageName) {
    const absolutePath = path.join(packagesPath, packageName);
    const scssFilePath = path.join(absolutePath, 'index.scss');
    const cssFilePath = path.join(absolutePath, 'index.css');
    const styleDir = path.resolve(outputPath, `${packageName}/style`);
    const cssFileOutputPath = path.resolve(outputPath, `${packageName}/style/index.css`);
    let hasScssFile = false;
    let hasCssFile = false;
    const hasStyleDir = fs.existsSync(styleDir);

    if (!hasStyleDir) {
        fs.mkdirSync(styleDir);
    }

    hasScssFile = fs.existsSync(scssFilePath);
    if (!hasScssFile) {
        hasCssFile = fs.existsSync(cssFilePath);
    }

    if (hasScssFile) {
        const result = sass.renderSync({
            file: scssFilePath,
        });
        fs.outputFileSync(cssFileOutputPath, result.css);
    } else if (hasCssFile) {
        fs.copyFileSync(cssFilePath, cssFileOutputPath);
    }

    createJsFileForImport(packageName, (hasScssFile || hasCssFile));
}

function compile(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((packageName) => {
        const absolutePath = path.join(dir, packageName);
        if (util.isDir(absolutePath)) {
            createStyleDir(packageName);
        }
    });
}

compile(packagesPath);
