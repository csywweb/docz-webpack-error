const fs = require('fs-extra');

function isDir(dir) {
    return fs.lstatSync(dir).isDirectory();
}

// 检测是否下划线命名方式
function checkoutNameByUnderline(name) {
    const reg = /^([a-z])+(_?([a-z]|\d)+)*$/;

    return reg.test(name);
}

module.exports = {
    isDir,
    checkoutNameByUnderline,
};
