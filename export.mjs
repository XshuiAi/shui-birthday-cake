import {escapeJSON} from './model.mjs';
import {threeLicense,projectNotice} from './license.mjs';
export function makeGiftHTML(state,assets,js,css){
 return '<!doctype html><html lang="zh-CN"><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>一份生日礼物</title><!-- Three.js: https://threejs.org/\n'+projectNotice.replaceAll('--','—')+'\n'+threeLicense+' --><style>'+css+'</style><div id="app"></div><script>window.__CAKE_GIFT__='+escapeJSON({state,assets})+';<'+'/script><script type="module">'+js.replace(/<\/script/gi,'<\\/script')+'<'+'/script></html>';
}
