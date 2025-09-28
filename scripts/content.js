let courseInfoList = [];
class courseInfo{
  constructor(fullName, callName, state, id){
    this.fullName = fullName;
    this.callName = callName;
    this.state = state;
    this.id = id
  }
}

function loadCourseInfo(allDivs, targetList){
  allDivs.forEach((div, index) =>{
    div.id = index;
    const headerText = div.querySelector('.media-heading').textContent;
    if (headerText){
      const courseName = headerText;
      const course = new courseInfo(courseName, courseName, false, index);
      for (const element of targetList){
        if (courseName === element[0]){
          course.callName = element[1];
          course.state = true;
          break;
        }
      }
      courseInfoList.push(course);
    }}
)}

function ReflectToWell() {
  const saveList = [];
  for (const element of courseInfoList){
    const div = document.getElementById(element.id);
    const header = div.querySelector('.media-heading');
    header.innerHTML = header.textContent.replaceAll(element.fullName, element.callName);
    div.parentElement.style.display = (element.state === false) ? "none" : "";
    element.state && saveList.push([element.fullName, element.callName]);
  }
  chrome.storage.sync.set({ myCourseList: saveList }, () => {
    console.log('設定が保存されました。');
    return false; 
  });
}

function createAddElement(mode, element, parent, childClass, childTextContent){
  const child = document.createElement(element); 
  child.className = childClass;
  (childTextContent !== null) && (child.textContent = childTextContent);
  (mode === 'prepend') ? (parent.prepend(child)) : (parent.appendChild(child));
  return child;
}

function clickChangeDisplay(clicked, changeElement, display){
  clicked.addEventListener('click', () => {
    changeElement.style.display = display;
  })
}

function menu() {
  const content = document.querySelector('.content-header')
  const mainElement = document.querySelector('body');

  const btn = createAddElement('prepend', 'button', content, 'btn', '表示メニュー');      
  const menuBoard = createAddElement('prepend', 'div', mainElement, 'menuboard', null);

  fetch(chrome.runtime.getURL('scripts/setting.html'))
    .then(response => response.text())
    .then(data => {
      menuBoard.innerHTML = data;
      const menuContent = document.querySelector('#menu-content');

      for (const info of courseInfoList) {
        const element = createAddElement('append', 'div', menuContent, 'settingItem', null);
        const textItem = createAddElement('append', 'div', element, 'text-item', null);
        createAddElement('append', 'div', textItem, 'Item-title', info.fullName);
        createAddElement('append', 'div', textItem, 'Item-callName sub-Item', '名前変更');
        const courseState = createAddElement('append', 'div', element, 'Item-courseState sub-Item', null);
        if (info.state === true) {
          courseState.textContent = ' 表示 ';
          courseState.style.backgroundColor = 'black'
          courseState.style.color = 'white';
        } else {
          courseState.textContent = '非表示';
        }
        courseState.addEventListener('click', () =>{
          changeState(courseState, info);
        })
      }
      const menuClose = document.querySelector("#menu-close");
      clickChangeDisplay(btn, menuBoard, 'flex')
      clickChangeDisplay(menuClose, menuBoard, 'none')
  })
}

function changeState(element, info){
  element.textContent = (info.state === false) ? ' 表示 ' : '非表示';
  element.style.backgroundColor = (info.state === false) ? 'black' : 'white';
  element.style.color = (info.state === false) ? 'white' : 'black';
  info.state = (info.state === false) ? true: false;
  ReflectToWell();
}

const mainElement = document.querySelector('main');
  if (mainElement) {
    observer.observe(mainElement, {
      childList: true, 
      subtree: true
    });
  }
  
chrome.storage.sync.get({ myCourseList: [] }, (result) => {
  const NoDeleteList = result.myCourseList;
  const AllWells = document.querySelectorAll('.well');
  loadCourseInfo(AllWells, NoDeleteList);
  ReflectToWell();
  menu();
});
