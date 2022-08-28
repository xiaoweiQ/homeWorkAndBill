// 初始化表格
export const loadTable = (domName, data) => {
  function getSum(type, data) {
    switch (type) {
      case 0:
        return data.data.filter(item => item.type === '支出').map(item => Number(item.amount)).reduce((prev, current) => prev + current, 0)
      case 1:
        return data.data.filter(item => item.type === '收入').map(item => Number(item.amount)).reduce((prev, current) => prev + current, 0)
      default:
        return 0
    }
  }
  function renderSum(tableData) {
    // 移除dom
    let sumDom = document.querySelector('.sum')
    while (sumDom.hasChildNodes()) {
      sumDom.removeChild(sumDom.firstChild)
    }
    // 设置收入金额dom
    let income = document.createElement('div')
    income.style.color = 'green'
    income.innerText = '收入金额：' + getSum(1, tableData)
    // 设置支持金额dom
    let spending = document.createElement('spending')
    spending.style.color = 'red'
    spending.style.marginLeft = '20px'
    spending.innerText = '支出金额：' + getSum(0, tableData)
    sumDom.appendChild(income)
    sumDom.appendChild(spending)
  }
  // 移除table里面所有的元素
  let tableDom = document.querySelector(domName)
  while (tableDom.hasChildNodes()) {
    tableDom.removeChild(tableDom.firstChild)
  }
  // 生成新的table
  const appendTitles = titles => {
    let tr = document.createElement('tr')
    tableDom.appendChild(tr)
    titles.forEach(title => {
      let th = document.createElement('th')
      tr.appendChild(th)
      th.innerText = title
    })
  }
  const appendContents = contents => {
    contents.forEach(content => {
      let tr = document.createElement('tr')
      tableDom.appendChild(tr)
      for (const key in content) {
        let td = document.createElement('td')
        tr.appendChild(td)
        td.innerText = content[key]
      }
    })
  }
  let titles = data.titles
  let contents = data.data
  appendTitles(titles)
  appendContents(contents)
  renderSum(data)
}
