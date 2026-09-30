export const PALETTE=['#fff1df','#f2adc5','#bad59c','#a9d6ef','#cfb5eb','#ffe49b'];
export const CATEGORIES=[['recipe','蛋糕'],['cream','奶油'],['fruit','水果'],['sprinkle','碎料'],['candle','蜡烛'],['letter','字母'],['pretty','贴纸'],['paper','照片与信'],['scene','生日布置']];
export const FRUITS=['草莓','蓝莓','香蕉','火龙果','芒果','猕猴桃'];
export const FRUIT_IDS=['strawberry','blueberry','banana','dragonfruit','mango','kiwi'];
export const SPRINKLES=['彩色糖针','巧克力碎','饼干碎','椰片','坚果碎','糖珠'];
export const PRETTY=['粉色蝴蝶结','蓝色蝴蝶结','长飘带蝴蝶结','格纹蝴蝶结','蕾丝蝴蝶结','卷曲丝带','粉色纽扣','蓝色纽扣','爱心纽扣','小花纽扣','星星纽扣','方形纽扣','小雏菊','樱花','勿忘我','小玫瑰','紫色小花','双叶'];
export const FACES=['(｡･ω･｡)','(≧▽≦)','(｡♥‿♥｡)','♡','✧','☆','♪','☾','☁','生日快乐','HAPPY BIRTHDAY'];
export const assetKey=(sheet,index)=>`${sheet}-${Math.floor(index/6)}-${index%6}`;
export const assetURL=(key)=>`./assets/c-style/${key}.png`;
