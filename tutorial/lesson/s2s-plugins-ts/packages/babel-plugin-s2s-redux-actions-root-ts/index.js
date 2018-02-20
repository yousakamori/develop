"use strict";
// https://github.com/cndlhvn/babel-plugin-s2s-redux-actions/blob/master/src/index.js
// https://github.com/akameco/babel-plugin-s2s-action-root/blob/master/src/index.js
// https://github.com/kamijin-fanta/babel-plugins/blob/master/packages/babel-plugin-s2s-action-root-ts/src/index.js
Object.defineProperty(exports, "__esModule", { value: true });
var syntaxTypeScript = require("@babel/plugin-syntax-typescript");
var globby_1 = require("globby");
var s2s_utils_ts_1 = require("../s2s-utils-ts");
module.exports = function (babel) {
    var t = babel.types;
    var defaultExport = function (source) { return t.ExportAllDeclaration(t.stringLiteral(source)); };
    return {
        name: "s2s-redux-actions-root",
        inherits: syntaxTypeScript,
        visitor: {
            Program: {
                exit: function (path, state) {
                    var _a = state.opts, input = _a.input, output = _a.output;
                    if (!input) {
                        throw new Error('require input option');
                    }
                    if (!output) {
                        throw new Error('require output option');
                    }
                    var files = globby_1.default.sync(input);
                    var index = files.indexOf(output);
                    if (index > -1) {
                        files.splice(index, 1);
                    }
                    var imports = files.map(function (f) { return defaultExport(s2s_utils_ts_1.getImportPath(output, f)); });
                    path.node.body = imports.slice();
                }
            }
        }
    };
};
