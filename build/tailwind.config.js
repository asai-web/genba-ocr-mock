/** index.html（編集用ソース）で使う Tailwind クラスだけを抽出して静的CSS化する */
module.exports = {
  content: ["../index.html"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#fff7ed",100:"#ffedd5",200:"#fed7aa",300:"#fdba74",400:"#fb923c",500:"#f97316",600:"#ea580c",700:"#c2410c",800:"#9a3412",900:"#7c2d12" },
        ink:   { 50:"#f6f7f9",100:"#eceef1",200:"#dfe3e8",300:"#c6ccd4",400:"#98a1ad",500:"#68727e",600:"#4a535e",700:"#343b44",800:"#20252b",900:"#12161a" }
      }
    }
  }
};
