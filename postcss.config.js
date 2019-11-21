// postcss.config.js
const path = require("path");

module.exports = {
    plugins: [
        require("cssnano")(),
        require("postcss-preset-env")()
    ]
};
