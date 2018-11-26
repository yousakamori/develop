import path from 'path';
import globule from 'globule';
import {rules} from './webpack/rules';
import {getHtmlPlugins} from './webpack/plugins';

// ソース・出力先の設定
const opts = {
  src: path.join(__dirname, 'src'),
  dest: path.join(__dirname, 'dist')
};

const files = {}

// _で始まるファイルと、_で始まるディレクトリ以下のファイルを無視する
globule.find({ src: [`**/*`, `!**/_*`], cwd: opts.src,  prefixBase: true})
       .filter(filepath=>filepath.indexOf('/_') === -1)
       .forEach(filepath => {
  //console.log(filepath);
})

const htmlPlugins = getHtmlPlugins(opts); 


let common = {
  module: { rules },
  plugins: [...htmlPlugins]
};

module.exports = common;