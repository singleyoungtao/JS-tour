let isScrollDone;
const childEl = document.getElementById("GrandChildContainer_2");

childEl.addEventListener("mousewheel", function (event) {
  let delta = event.wheelDelta; // mousewheel事件的滚动值，向上滚是120的整倍数，向下滚是-120的倍数
  let up = delta > 0
  // if (isScrollDone) {
  if (!!up && childEl.scrollTop===0) {
    event.preventDefault();
    console.log("----------------------", delta, up, childEl.scrollTop);
  } else if (!up && (childEl.scrollTop === childEl.scrollHeight - childEl.clientHeight)) {
    event.preventDefault();
    console.log("----------------------", delta, up, childEl.scrollTop);
  }

  // let isScrollDone = !!(childEl.scrollHeight === childEl.scrollTop + childEl.clientHeight)
  // if(isScrollDone) {   // 由于此处没有判断上下滑，所以下次滑的一瞬间判断isScrollDone时，仍旧为true，无法滑动
  //   event.preventDefault();
  //   console.log("----------------------");
  // }
})
