export const txtToJson = txt => {
  let lines = txt.split('\n')
  let titles = lines[0].split(',')
  let resultInfo = {
    titles,
    data: []
  }
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i]
    let lineData = line.split(',')
    let tempInfo = {}
    titles.forEach((title, index) => {
      tempInfo[title] = lineData[index]
    })
    resultInfo.data.push(tempInfo)
  }
  return resultInfo
}

export const dispose = (data1, data2) => {
  let titleMap = {
    time: '账单时间',
    type: '账单类型',
    category: '账单分类',
    amount: '账单金额'
  }
  for (let i = 0; i < data1.titles.length; i++) {
    data1.titles[i] = titleMap[data1.titles[i]]
  }
  data1.data.forEach(item => {
    data2.data.forEach(itemChild => {
      // 格式化账单类型和分类
      if (item.category === itemChild.id) {
        item.category = itemChild.name
        switch (itemChild.type) {
          case '0':
            item.type = '支出'
            break
          case '1':
            item.type = '收入'
            break
          default:
            break
        }
      }
    })
    item.time = new Date(Number(item.time)).toISOString()
  })
}
