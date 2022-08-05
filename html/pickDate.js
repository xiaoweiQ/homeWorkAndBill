export const loadPickDate = (domName, cb) => {
  let calendar = `
    <div class="calendar">
      <div class="header">
        <div class="arrow-left">
          <div class="arrow-left_year arrow-year"><<</div>
          <div class="arrow-left_month arrow-month"><</div>
        </div>
        <div class="current-date">
          <span class="current-date_year"></span>
          <span class="current-date_month" style="margin-left: 10px"></span>
        </div>
        <div class="arrow-right">
          <div class="arrow-right_month arrow-month">></div>
          <div class="arrow-right_year arrow-year">>></div>
        </div>
      </div>
      <div class="main">
        <div class="week">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>
        <div class="day"></div>
      </div>
    </div>
  `
  calendar = calendar.replace(/\n/g, '')
  let fatherDom = document.querySelector(domName)
  fatherDom.innerHTML = calendar
  let currentDate = new Date()
  initDate(currentDate.getFullYear(), currentDate.getMonth() + 1, cb)
  bindEvent(cb)
}

function initDate(y, m, cb) {
  // 设置当前年月对应的天数列表
  const getCurrentYearAndMonthDayList = (year, month) => {
    const getMonthDays = (tempYear, tempMonth) => {
      let myDate = new Date(tempYear, tempMonth, 0)
      return myDate.getDate()
    }
    if (month > 12 || month < 0) return []
    // 求上个月的天数
    let prevDate = {
      year,
      month
    }
    if (month === 1) {
      prevDate.month = 12
      prevDate.year = year - 1
    } else {
      prevDate.month = month - 1
    }
    let prevDateDays = getMonthDays(prevDate.year, prevDate.month)

    // 求这个月的天数
    let myDate = new Date(year, month - 1, 1)
    // 求本月第一天是星期几
    let firstDayWeek = myDate.getDay()
    // 获取天数
    let days = getMonthDays(year, month)
    let dayList = []
    for (let i = prevDateDays - firstDayWeek + 1; i <= prevDateDays; i++) {
      dayList.push({ disable: true, value: i })
    }
    for (let i = 1; i <= days; i++) {
      dayList.push({ disable: false, value: i })
    }
    // 日历每页有35个值
    // 先存起来, 否则for循环的时候后一直计算, 导致for循环次数错误
    let dayListLength = dayList.length
    for (let i = 1; i <= 35 - dayListLength; i++) {
      dayList.push({ disable: true, value: i })
    }
    return dayList
  }
  const filterDate = (date) => {
    if (Number(date) < 10) {
      return '0' + date
    }
    return date
  }
  let currentYearDiv = document.querySelector('.current-date_year')
  let currentMonthDiv = document.querySelector('.current-date_month')
  let currentYearValue = y
  let currentMonthValue = m
  currentYearDiv.innerText = currentYearValue
  currentMonthDiv.innerText = filterDate(currentMonthValue)

  let currentDays = getCurrentYearAndMonthDayList(
    currentYearValue,
    currentMonthValue
  )
  let dayEle = document.querySelector('.day')
  let dayLine = null
  // 先清除数据
  let parent = dayEle.parentElement
  parent.removeChild(dayEle)
  dayEle = document.createElement('div')
  dayEle.setAttribute('class', 'day')
  parent.appendChild(dayEle)
  currentDays.forEach((day, index) => {
    if (index % 7 === 0) {
      dayLine = document.createElement('div')
      dayLine.setAttribute('class', 'day-line')
      dayEle.appendChild(dayLine)
    }
    let span = document.createElement('span')
    // 绑定点击事件
    span.onclick = () => {
      // 先让所有的active标签变成原始状态
      let alreadyActive = document.querySelectorAll('.day-active')
      alreadyActive.forEach(item => {
        item.setAttribute('class', '')
      })
      if (!day.disable) {
        span.setAttribute('class', 'day-active')
        let result = {
          type: 'click',
          value: [currentYearValue, filterDate(currentMonthValue), filterDate(day.value)]
        }
        cb(result)
      }
    }
    if (day.disable) {
      span.setAttribute('class', 'day-forbidden')
    }
    span.innerText = day.value
    if (dayLine) {
      dayLine.appendChild(span)
    }
  })
}

function bindEvent(cb) {
  // 四个按钮
  let prevYear = document.querySelector('.arrow-left_year')
  let prevMonth = document.querySelector('.arrow-left_month')
  let nextYear = document.querySelector('.arrow-right_year')
  let nextMonth = document.querySelector('.arrow-right_month')
  // 当前年月
  let currentYear = +document.querySelector('.current-date_year').innerText
  let currentMonth = +document.querySelector('.current-date_month').innerText
  prevYear.onclick = () => {
    currentYear--
    initDate(currentYear, currentMonth)
  }
  prevMonth.onclick = () => {
    if (currentMonth === 1) {
      currentYear--
      currentMonth = 12
    } else {
      currentMonth--
    }
    initDate(currentYear, currentMonth, cb)
  }
  nextYear.onclick = () => {
    currentYear++
    initDate(currentYear, currentMonth, cb)
  }
  nextMonth.onclick = () => {
    if (currentMonth === 12) {
      currentYear++
      currentMonth = 1
    } else {
      currentMonth++
    }
    initDate(currentYear, currentMonth, cb)
  }
}
