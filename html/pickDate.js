export const loadPickDate = (domName, cb) => {
  let calendar = `
    <div class="calendar">
      <div class="date-timer_header">
        <div class="input-wrap" style="margin: 0 2px">
          <input class="date-timer_date" placeholder="please select date" />
        </div>
        <div class="input-wrap" style="margin: 0 2px">
          <input class="date-timer_timer" placeholder="please select timer" />
        </div>
        <div class="date-timer_timer-wrap"></div>
      </div>
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
      <div class="footer">
        <button type="button" class="calendar-footer_cancel">cancel</button>
        <button type="button" class="calendar-footer_confirm primary-button">ok</button>
      </div>
    </div>
  `
  calendar = calendar.replace(/\n/g, '')
  let fatherDom = document.querySelector(domName)
  fatherDom.innerHTML = calendar

  // 获取日期输入框和时间输入框
  const dateInput = document.querySelector('.date-timer_date')
  const timerInput = document.querySelector('.date-timer_timer')

  // 初始化日期与时间变量
  let currentDate = new Date()
  let currentDateFormat = currentDate.toLocaleString().split(' ')[0].split('/')
  currentDateFormat = currentDateFormat.map(item => filterDate(item)).join('-')

  let currentTimeFormat = '12:00:00'

  // 设置回掉方法
  const getDate = date => {
    currentDateFormat = date.join('-')
    dateInput.value = currentDateFormat
  }

  const getTimer = timer => {
    currentTimeFormat = timer.join(':')
    timerInput.value = currentTimeFormat
  }

  initDate(currentDate.getFullYear(), currentDate.getMonth() + 1, getDate)
  bindYearAndMonthEvent(getDate)

  // 点击时间选择框时触发
  timerInput.onclick = () => {
    const timerPick = document.querySelector('.timer-pick')
    if (!timerPick) {
      initTimerPicker('.date-timer_timer-wrap', timer => {
        getTimer(timer)
      })
      // 赋值到年月日输入框
      dateInput.value = currentDateFormat
    } else {
      timerPick.setAttribute('style', 'display: block')
    }
  }

  const calendarFooterCancel = document.querySelector('.calendar-footer_cancel')
  const calendarFooterConfirm = document.querySelector('.calendar-footer_confirm')
  calendarFooterCancel.onclick = () => {
    cb(null)
  }
  calendarFooterConfirm.onclick = () => {
    cb(`${currentDateFormat} ${currentTimeFormat}`)
  }
}

// 不足10的补一个零
const filterDate = date => {
  if (Number(date) < 10) {
    return '0' + date
  }
  return date
}

function initDate(y, m, getDate) {
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
    const span = document.createElement('span')
    // 绑定点击事件
    span.onclick = () => {
      // 先让所有的active标签变成原始状态
      let alreadyActive = document.querySelectorAll('.day-active')
      alreadyActive.forEach(item => {
        item.setAttribute('class', '')
      })
      if (!day.disable) {
        span.setAttribute('class', 'day-active')
        let result = [
          currentYearValue,
          filterDate(currentMonthValue),
          filterDate(day.value)
        ]
        getDate(result)
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

function bindYearAndMonthEvent(getDate) {
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
    initDate(currentYear, currentMonth, getDate)
  }
  nextYear.onclick = () => {
    currentYear++
    initDate(currentYear, currentMonth, getDate)
  }
  nextMonth.onclick = () => {
    if (currentMonth === 12) {
      currentYear++
      currentMonth = 1
    } else {
      currentMonth++
    }
    initDate(currentYear, currentMonth, getDate)
  }
}

function initTimerPicker(domName, getTimer) {
  let timerPicker = `
    <div class="timer-pick">
      <div class="timer-pick_content"></div>
      <div class="timer-pick_footer">
        <button type="button" class="timer-pick_cancel">取消</button>
        <button type="button" class="timer-pick_confirm primary-button">确定</button>
      </div>
    </div>
  `
  let timer = ['12', '00', '00']
  timerPicker = timerPicker.replace(/\n/g, '')
  let fatherDom = document.querySelector(domName)
  fatherDom.innerHTML = timerPicker
  initTimerPickDate(getTimer)

  function initTimerPickDate(getTimer) {
    let timerWrap = document.querySelector('.timer-pick_content')
    let hourWrap = document.createElement('ul')
    let minuteWrap = document.createElement('ul')
    let secondWrap = document.createElement('ul')
    for (let i = 0; i < 24; i++) {
      let hour = document.createElement('li')
      hour.innerText = i < 10 ? '0' + i : i
      hourWrap.appendChild(hour)
      hour.onclick = () => {
        timer[0] = hour.innerText
        getTimer(timer)
      }
    }
    for (let i = 0; i < 60; i++) {
      let minute = document.createElement('li')
      minute.innerText = i < 10 ? '0' + i : i
      minuteWrap.appendChild(minute)
      minute.onclick = () => {
        timer[1] = minute.innerText
        getTimer(timer)
      }
    }
    for (let i = 0; i < 60; i++) {
      let second = document.createElement('li')
      second.innerText = i < 10 ? '0' + i : i
      secondWrap.appendChild(second)
      second.onclick = () => {
        timer[1] = second.innerText
        getTimer(timer)
      }
    }
    timerWrap.append(hourWrap)
    timerWrap.append(minuteWrap)
    timerWrap.append(secondWrap)
  }

  const cancel = document.querySelector('.timer-pick_cancel')
  const confirm = document.querySelector('.timer-pick_confirm')
  const timerPick = document.querySelector('.timer-pick')

  cancel.onclick = () => {
    timerPick.setAttribute('style', 'display: none')
    timer = ['12', '00', '00']
    getTimer(timer)
  }

  confirm.onclick = () => {
    timerPick.setAttribute('style', 'display: none')
    getTimer(timer)
  }
}
