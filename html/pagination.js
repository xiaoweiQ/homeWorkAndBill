export const loadPagination = (
  parentDomName,
  pageSize,
  total,
  changeSize,
  changeNum
) => {
  let html = `
    <div class="pagination">
      <span class="pagination-total">Total ${total}</span>
      <button class="pagination_prev-page"><</button>
      <ul class="page-num"></ul>
      <button class="pagination_next-page">></button>
      <select class="page-size"></select>
    </div>
  `
  let parent = document.querySelector(parentDomName)
  parent.innerHTML = html

  // 初始化分页页数
  const allPageNum = Math.ceil(total / pageSize)
  let currentPage = 1
  const initPageNum = pageNum => {
    if (pageNum < 1) pageNum = 1
    let pageNumDom = document.querySelector('.page-num')
    while (pageNumDom.hasChildNodes()) {
      pageNumDom.removeChild(pageNumDom.firstChild)
    }

    for (let i = 1; i <= pageNum; i++) {
      const num = i
      const li = document.createElement('li')
      li.innerText = num
      li.onclick = () => {
        // 先让所有的active标签变成原始状态
        let alreadyActive = document.querySelectorAll('.active-li')
        alreadyActive.forEach(item => {
          item.setAttribute('class', '')
        })
        li.setAttribute('class', 'active-li')
        currentPage = num
        changeNum(currentPage)
      }
      pageNumDom.appendChild(li)
    }
    pageNumDom.children[currentPage - 1].setAttribute('class', 'active-li')
  }

  const pageSizeList = [10, 30, 50, 100]
  const initPageSize = pageSizeList => {
    const pageSizeDom = document.querySelector('.page-size')
    for (let i = 0; i < pageSizeList.length; i++) {
      const num = pageSizeList[i]
      const option = document.createElement('option')
      option.innerText = num
      pageSizeDom.appendChild(option)
    }
    pageSizeDom.onchange = () => {
      const select = pageSizeDom.options[pageSizeDom.selectedIndex]
      const pageNum = total / select.value
      currentPage = 1
      initPageNum(pageNum)
      changeSize(select.value)
    }
  }
  initPageNum(allPageNum)
  initPageSize(pageSizeList)

  // 点击上一页或者下一页
  const prev = document.querySelector('.pagination_prev-page')
  const next = document.querySelector('.pagination_next-page')
  const handleClickBtn = type => {
    if (type === 0) {
      if (currentPage === 1) return
      currentPage--
      initPageNum(allPageNum)
      changeNum(currentPage)
    }
    if (type === 1) {
      if (currentPage === allPageNum) return
      currentPage++
      initPageNum(allPageNum)
      changeNum(currentPage)
    }
  }
  prev.onclick = () => handleClickBtn(0)
  next.onclick = () => handleClickBtn(1)
}
