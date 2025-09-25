const TARGET= [['コンピュータ・サイエンス概論 IV', 'CS概論4'],
               ["情報連携のための数学A (~1F1021) / 数学Ⅰ (1F1022~)", "数学1"],
               ["情報連携のための数学2 (1F1022~) / 数学B (~1F1021) ", "数学2"],
               ["コンピュータ・アーキテクチャ", "アーキテクチャ"],
               ["コンピュータ・ソフトウェア演習Ⅱ", "ソフ演2"],
               ["データベース・ビッグデータ解析","データベース"],
               ["コンピュータ・サイエンス演習IV / 情報連携基礎演習IV","CS演習4"],
               ["コンピュータ・システム演習II / 情報連携エンジニアリング演習IB", "システム演習2"]
            ];

const courseInfoList = []

class courseInfo{
  constructor(fullName, callName, state, id){
    this.fullName = fullName;
    this.callName = callName;
    this.state = state;
    this.id = id
  }
}

function getWellAll(){
  return document.querySelectorAll('.well');
}

function loadCourseInfo(allDivs){
  allDivs.forEach((div, index) =>{
    div.id = index;
    const header = div.querySelector('.media-heading');
    if (header.textContent){
      const courseName = header.textContent;
      const p = new courseInfo(courseName, courseName, false, index);
      for (const element of TARGET){
        if (courseName === element[0]){
          p.callName = element[1];
          p.state = true;
          break;
        }
      }
      courseInfoList.push(p);
    }
    }
)}

function deleteWell() {
  for (const element of courseInfoList){
    const div = document.getElementById(element.id);
    const header = div.querySelector('.media-heading');
    if (element.fullName　!== element.callName) {
          header.innerHTML = header.textContent.replaceAll(element.fullName, element.callName);
      }
    div.parentElement.style.display = (element.state === false) ? "none" : "";
    }
  return false; 
}

function menu() {
    const btn = document.createElement('button');
    btn.id = 'btn'
    btn.textContent = '表示メニュー'
    const content = document.querySelector('.content-header')
    content.prepend(btn)

    const menuBoard = document.createElement('div');
    menuBoard.id = 'menuboard';
    const mainElement = document.querySelector('body');
    mainElement.prepend(menuBoard);

    fetch(chrome.runtime.getURL('scripts/setting.html'))
        .then(response => response.text())
        .then(data => {
            menuBoard.innerHTML = data;
            const menuContent = document.querySelector('#menu-content');

            for (const info of courseInfoList) {
                const element = document.createElement('div');
                element.className = 'settingItem';

                const textItem = document.createElement('div');
                textItem.className = 'text-item'; 

                const courseName = document.createElement('div');
                courseName.textContent = info.fullName;
                courseName.className = 'Item-title';
                textItem.appendChild(courseName);

                const callName = document.createElement('div');
                callName.textContent = '名前変更';
                callName.className = 'Item-callName sub-Item';
                textItem.appendChild(callName);

                const courseState = document.createElement('div');

                
                if (info.state === true) {
                    courseState.textContent = ' 表示 ';
                    courseState.style.backgroundColor = 'black'
                    courseState.style.color = 'white'
                } else {
                    courseState.textContent = '非表示';
                }

                courseState.addEventListener('click', (e) =>{
                  changeState(courseState, info);
                })


                courseState.className = 'Item-courseState sub-Item';

                
                element.appendChild(textItem);
                element.appendChild(courseState); 
                
                menuContent.appendChild(element);
            }

            btn.addEventListener('click', (e) => {
                menuBoard.style.display = 'flex';
            })

            const menuClose = document.querySelector("#menu-close");
            menuClose.addEventListener("click", ()=>{
              menuBoard.style.display = "none";
            })
        })
  
}

function changeState(element, info){
  if (info.state === false) {
        element.textContent = ' 表示 ';
        element.style.backgroundColor = 'black'
        element.style.color = 'white';
        info.state = true;
    } else {
        element.textContent = '非表示';
        element.style.backgroundColor = 'white'
        element.style.color = 'black';
        info.state = false;
    }
    deleteWell();
}
  

const mainElement = document.querySelector('main');
if (mainElement) {
  observer.observe(mainElement, {
    childList: true, 
    subtree: true
  });
}

const AllWells = getWellAll();
loadCourseInfo(AllWells);
deleteWell();
menu();
