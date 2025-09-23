const TARGET= [['コンピュータ・サイエンス概論 IV', 'CS概論4'],
               ["情報連携のための数学A (~1F1021) / 数学Ⅰ (1F1022~)", "数学1"],
               ["情報連携のための数学2 (1F1022~) / 数学B (~1F1021) ", "数学2"],
               ["コンピュータ・アーキテクチャ", "アーキテクチャ"],
               ["コンピュータ・ソフトウェア演習Ⅱ", "ソフ演2"],
               ["データベース・ビッグデータ解析","データベース"],
               ["コンピュータ・サイエンス演習IV / 情報連携基礎演習IV","CS演習4"],
               ["コンピュータ・システム演習II / 情報連携エンジニアリング演習IB", "システム演習2"]
            ];

let removedFlag = true;

function markingWell(){
  const allDivs = document.querySelectorAll('.well');
    allDivs.forEach((div, index) =>{
      div.id = index;
    })
}

function deleteWell() {
    const allDivs = document.querySelectorAll('.well');
    for (const div of allDivs) {
      for (const element of TARGET){
        const header = div.querySelector('.media-heading')
        if(!header){
          break
        }
        if (header.textContent　=== element[0]) {
            header.innerHTML = header.textContent.replaceAll(element[0], element[1])
            removedFlag = false;
            break;
        }
      }
      if (removedFlag === true){
        div.parentElement.style.display = "none";
      } else {
        removedFlag = true;
      }
    }
    return false; 
}

const observer = new MutationObserver((mutations) => {
    if (deleteWell()) {
    observer.disconnect();
    }
});

const mainElement = document.querySelector('main');
if (mainElement) {
  observer.observe(mainElement, {
    childList: true, 
    subtree: true    
  });
}

markingWell()
deleteWell();

menu();

function menu(){
  const btn = document.createElement('button');
  btn.id ='btn'
  btn.textContent = '表示メニュー'
  const content = document.querySelector('.content-header')
  content.prepend(btn)

  const menuBoard = document.createElement('div');
  menuBoard.id = 'menuboard';
  const mainElement = document.querySelector('body');
  mainElement.prepend(menuBoard);
  menuBoard.textContent = TARGET

  btn.addEventListener('click', (e) =>{
    menuBoard.style.display = 'flex';
  })
}
