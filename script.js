const navbar = document.querySelector('#nav');
const date = document.querySelector('#date');

const navBtn = document.querySelector('#nav-btn');
const sidebar = document.querySelector('#sidebar');
const closeBtn = document.querySelector('#close-btn');

// add fixed class to navbar
window.addEventListener('scroll', function () {
  if (window.scrollY > 80) {
    navbar.classList.add('navbar-fixed');
  } else {
    navbar.classList.remove('navbar-fixed');
  }
});

navBtn.addEventListener('click', function () {
  sidebar.classList.add('show-sidebar');
});

closeBtn.addEventListener('click', function () {
  sidebar.classList.remove('show-sidebar');
});

// set year
date.innerHTML = new Date().getFullYear();


//more跳轉
function scrollToTarget() {
    document.getElementById('about-section').scrollIntoView({
      behavior: 'smooth' 
    });
  }

//背景音樂
function startApp() {
  // 隱藏全屏元素
  document.getElementById('fullscreen').style.display = 'none';

  // 播放音樂
  document.getElementById('backgroundMusic').play();
}


//song
var lrc = `[00:01.06]眼淚記得你
[00:10.95]演唱：孫盛希
[00:19.00]能不能走出這照片
[00:23.00]對我說久等了抱歉
[00:27.00]空蕩的房間 卻塞不下思念
[00:34.00]對空氣訴說了一切
[00:38.00]拼湊著兩個人的地點
[00:41.00]我記得你每張笑臉
[00:48.00]和你看日出日落 一起做的夢
[00:53.00]誰忘了說 要記得我
[01:04.00]I close my eyes 你就會出現
[01:10.00]I need your love 留在我世界
[01:18.00]一切是不是錯覺
[01:24.00]醒來你還在我身邊
[01:33.00]又這樣回到了原點
[01:39.00]明明就在眼前 卻是不同世界
[01:48.00]懷疑記憶 不夠清晰
[01:54.00]雙手究竟有沒有緊握過
[02:01.00]沒你的日出日落
[02:04.50]是我 我忘了說 要記得我
[02:17.00]I close my eyes 你就會出現
[02:25.00]I need your love 留在我世界
[02:32.00]一切都只是錯覺
[02:38.00]醒來你不在我身邊
[02:47.00]繼續走 不停留 屬於我們的時間
[03:02.00]還要幾次的擦肩錯過 多少的懊悔還等著
[03:16.00]I close my eyes 感覺你不遠
[03:23.00]I need you now 奢侈的許願
[03:31.00]眼淚記得你一切
[03:37.00]瞬間 停在 永遠
[04:00.00]`;

function parseLrc(lrc) {
  var lines = lrc.split('\n')
  var lrcData = []
  for (var i = 0; i < lines.length; i++) {
    var item = lines[i]
    var line = item.split(']')
    var obj = {
      time: parseTime(line[0].substring(1)),
      words: line[1],
    }
    lrcData[i] = obj
  }
  return lrcData
}
var lrcData = parseLrc(lrc)
var doms = {
  container: document.querySelector('.container'),
  audio: document.getElementById('five'),
  ul: document.querySelector('.container ul'),
}
/**
 * 将时间转为秒
 * @param {时间} time
 * @returns
 */
function parseTime(time) {
  var times = time.split(':')
  var parts = +times[0] * 60 + +times[1]
  return parts.toFixed(2)
}

/**
 * 计算出，在当前播放器播放到第几秒的情况下
 * lrcData数组中，应该高亮显示的歌词下标
 * 如果没有任何一句歌词需要显示，则得到-1
 */
function findIndex() {
  var curTime = doms.audio.currentTime
  for (let i = 0; i < lrcData.length; i++) {
    if (curTime < lrcData[i].time) {
      return i - 1
    }
  }
  // 找不到说明到最后一句了
  return lrcData.length - 1
}

// 操作界面
function createEle() {
  var frag = document.createDocumentFragment()
  for (let i = 0; i < lrcData.length; i++) {
    var li = document.createElement('li')
    li.textContent = lrcData[i].words
    frag.appendChild(li)
  }
  doms.ul.appendChild(frag)
}
createEle()

// 获取容器的高度
var containHeight = doms.container.clientHeight
// 获取li高度
var liHeight = doms.ul.children[0].clientHeight
// 最大偏移量
var maxOffset = doms.ul.clientHeight - containHeight
// 设置向上偏移量
function setOffset() {
  var height = findIndex() * liHeight - containHeight / 2
  if (height < 0) {
    height = 0
  }
  if (height > maxOffset) {
    height = maxOffset
  }
  doms.ul.style.transform = `translateY(-${height}px)`
  setStyle(findIndex())
}
// 样式处理
function setStyle(index) {
  var li = doms.ul.querySelector('.active')
  if (li) {
    li.classList.remove('active')
  }
  li = doms.ul.children[index]
  if (li) {
    li.classList.add('active')
  }
}
doms.audio.addEventListener('timeupdate', function () {
  setOffset()
})
