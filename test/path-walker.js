const fs = require('fs');
const path = require('path');

exports.walk = dir => {
    if (fs.statSync(dir).isDirectory()) {
        return fs.readdirSync(dir).flatMap(f => exports.walk(path.join(dir, f)));
    }
    return [dir];
};
