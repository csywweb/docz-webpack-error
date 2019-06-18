const fs = require('fs-extra');
const path = require('path');
const util = require('./util');

const packagesPath = path.resolve(__dirname, '../src/components');

function compile(dir) {
    const files = fs.readdirSync(dir);
    files.forEach((packageName) => {
        const absolutePath = path.join(dir, packageName);
        if (util.isDir(absolutePath)) {
            if (!util.checkoutNameByUnderline(packageName)) {
                throw new Error(`不符合下划线命名规则，${absolutePath}，请以小写字母开头,非下划线结尾,下划线与数字命名package，例如 package_name`);
            }
        }
    });
}

compile(packagesPath);
