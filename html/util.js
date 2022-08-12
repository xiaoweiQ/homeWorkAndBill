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

// 合并表格数据
export const dispose = (data1, data2) => {
  let resultData = deepClone(data1)
  let titleMap = {
    time: '账单时间',
    type: '账单类型',
    category: '账单分类',
    amount: '账单金额'
  }
  for (let i = 0; i < resultData.titles.length; i++) {
    resultData.titles[i] = titleMap[resultData.titles[i]]
  }
  resultData.data.forEach(item => {
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
    item.time = new Date(+item.time + 8 * 3600 * 1000).toISOString()
  })
  return resultData
}

export const deepClone = data => {
  if (typeof data === 'object') {
    if (Array.isArray(data)) {
      let arr = []
      data.forEach(item => {
        arr.push(deepClone(item))
      })
      return arr
    } else {
      let obj = {}
      for (const key in data) {
        obj[key] = deepClone(data[key])
      }
      return obj
    }
  } else {
    return data
  }
}

export const generateTimerList = () => {
  let dates = []
  for (let i = 0; i < 10; i++) {
    let year = 2020 + i
    let yearInfo = { children: [], value: year }
    for (let month = 1; month <= 12; month++) {
      let monthInfo = { children: [], value: month }
      yearInfo.children.push(monthInfo)
      let days = new Date(year, month, 0).getDate()
      for (let day = 1; day <= days; day++) {
        monthInfo.children.push({ value: day })
      }
    }
    dates.push(yearInfo)
  }
  return dates
}

// 递归寻找dom
export const findParentNode = (node, searchNode) => {
  if (searchNode === node) return true
  if (node.parentElement) {
    return findParentNode(node.parentElement, searchNode)
  } else {
    return false
  }
}