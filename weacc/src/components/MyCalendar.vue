<template>
<div ref="calendarRef" class="select-box">
  <div class="select-current" @click="openClose">
    <div class="current-name">{{selectValue}}</div>
    <button
      v-if="hasSelected"
      type="button"
      class="clear-button"
      title="清空"
      aria-label="清空"
      @click.stop="clearSelect"
    ></button>
  </div>

<div v-if="isShow" ref="calendarPanel" class="calendar" :style="calendarStyle">
	<div class="title flex">
		<div class="flex title-nav">
			<div @click="lastYear" class="tool-month-box" title="上一年">
        <div class="last-year"></div>
      </div>
			<div @click="lastMonth" class="tool-month-box" title="上一月">
        <div class="last-month"></div>
      </div>
      <div class="year-month">{{selectDay.year}}.{{selectDay.month>9?selectDay.month:"0"+selectDay.month}}</div>
      <div @click="nextMonth" class="tool-month-box" title="下一月">
        <div class="next-month"></div>
      </div>
			<div @click="nextYear" class="tool-month-box" title="下一年">
        <div class="next-year"></div>
      </div>
		</div>
	</div>
 
	<!-- 日历头部 -->
	<div class="flex-around calendar-week">
		<div class="div">日</div>
		<div class="div">一</div>
		<div class="div">二</div>
		<div class="div">三</div>
		<div class="div">四</div>
		<div class="div">五</div>
		<div class="div">六</div>
	</div>
 
	<!-- 日历主体 -->
	<div class="flex-start flex-wrap calendar-main">
		<div v-for="(item,index) in dateList" :key="index" class="day">
			<div :class="getDayClass(item)" @click="selectChange(item)">
				{{item.day}} 
			</div>
			<div class="spot" v-if="item.spot"></div>
		</div>
	</div>
  <div class="calendar-footer">
    <button type="button" class="today-button" @click="selectToday">今天</button>
    <button type="button" class="cancel-button" @click="close">取消</button>
  </div>
</div>

</div>

</template>

<script>
/* eslint-disable */
export default {
  name: 'MyCalendar',
  props: {
    spot: {
      type: Array,
      default: () => []
    },
    value: {
      type: String,
      default: ''
    }
  },
  data(){
    return {
        dateList: [],
        selectDay: {},
        isShow: false,
        selectValue: this.value,
        todayString: '',
        calendarStyle: {}
    }
  },
  computed: {
    hasSelected(){
      return !!this.selectValue;
    }
  },
  methods: {
    openClose() {
      if (this.isShow) {
        this.close();
        return;
      }
      this.isShow= true
      this.initValue();
      this.$nextTick(this.updateCalendarPosition);
    },

    // 此方法供父组件调用
    close() {
      this.isShow = false;
    },
    getDayClass(item) {
      const isOtherMonth = item.year !== this.selectDay.year || item.month !== this.selectDay.month;
      const isSelected = item.dateString === this.selectValue;
      const isToday = item.dateString === this.todayString;
      return 'bg ' + (isOtherMonth ? 'other-month' : (isSelected ? 'select' : '')) + (isToday ? ' today' : '');
    },
    clearSelect() {
      this.selectValue = '';
      this.$emit('input', '');
      this.$emit('clear');
      this.close();
    },
    selectToday() {
      const today = new Date();
      const dateString = this.formatTime(today, "Y-M-D");
      this.selectDay = {
        year: today.getFullYear(),
        month: today.getMonth() + 1,
        day: today.getDate(),
        dateString: dateString
      };
      this.selectValue = dateString;
      this.$emit('input', dateString);
      this.close();
    },
    formatTime(time, format) {
      function formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
      const formateArr = ['Y', 'M', 'D', 'h', 'm', 's']
      const returnArr = []
      const date = new Date(time)
      returnArr.push(date.getFullYear())
      returnArr.push(formatNumber(date.getMonth() + 1))
      returnArr.push(formatNumber(date.getDate()))
      returnArr.push(formatNumber(date.getHours()))
      returnArr.push(formatNumber(date.getMinutes()))
      returnArr.push(formatNumber(date.getSeconds()))
      for (const i in returnArr) {
        format = format.replace(formateArr[i], returnArr[i])
      }
      return format
    },
    //上月切换按钮点击
    lastMonth() {
      const lastMonth = new Date(this.selectDay.year, this.selectDay.month - 2)
      const year = lastMonth.getFullYear()
      const month = lastMonth.getMonth() + 1
      this.setMonth(year, month, null, false)
    },
    //下月切换按钮点击
    nextMonth() {
      const nextMonth = new Date(this.selectDay.year, this.selectDay.month)
      const year = nextMonth.getFullYear()
      const month = nextMonth.getMonth() + 1
      this.setMonth(year, month, null, false)
    },
    //上一年切换按钮点击
    lastYear() {
      this.setMonth(this.selectDay.year - 1, this.selectDay.month, null, false)
    },
    //下一年切换按钮点击
    nextYear() {
      this.setMonth(this.selectDay.year + 1, this.selectDay.month, null, false)
    },
    //设置月份
    setMonth(setYear, setMonth, setDay, emitChange = true) {
      if (this.selectDay.year !== setYear || this.selectDay.month !== setMonth) {
        const day = Math.min(new Date(setYear, setMonth, 0).getDate(), this.selectDay.day)
        const time = new Date(setYear, setMonth - 1, setDay ? setDay : day)
        const dateString = this.formatTime(time, "Y-M-D")
        this.selectDay = {
            year: setYear,
            month: setMonth,
            day: setDay ? setDay : day,
            dateString: dateString
        };
        if (emitChange) {
          this.selectValue = dateString;
          this.$emit('input', this.selectValue);
        }
        this.dateInit(setYear, setMonth)
        this.setSpot()
      }
    },
    //设置日历底下是否展示小圆点
    setSpot() {
      if(!this.spot){
        return;
      }
      const timeArr = this.spot.map(item => {
        return this.formatTime(item, "Y-M-D")
      })
      this.dateList.forEach(item => {
        if (timeArr.indexOf(item.dateString) !== -1) {
          item.spot = true
        } else {
          item.spot = false
        }
      })
    },
    //日历主体的渲染方法
    dateInit(setYear = this.selectDay.year, setMonth = this.selectDay.month) {
      let dateList = [];
      let now = new Date(setYear, setMonth - 1)
      let startWeek = now.getDay();
      let dayNum = new Date(setYear, setMonth, 0).getDate()
      let forNum = Math.ceil((startWeek + dayNum) / 7) * 7
      for (let i = 0; i < forNum; i++) {
        const now2 = new Date(now)
        now2.setDate(i - startWeek + 1)
        dateList[i] = {
          day: now2.getDate(),
          month: now2.getMonth() + 1,
          year: now2.getFullYear(),
          dateString: this.formatTime(now2, "Y-M-D")
        };
      }
      this.dateList= dateList;
    },
    //一天被点击时
    selectChange(item) {
      const year = item.year
      const month = item.month
      const day = item.day
      const dateString = item.dateString
      const selectDay = {
        year: year,
        month: month,
        day: day,
        dateString: dateString
      }
      if (this.selectDay.year !== year || this.selectDay.month !== month) {
        this.setMonth(year, month, day)
        this.close();
      } else  {
        this.selectDay= selectDay;
        this.selectValue = selectDay.dateString;
        this.$emit('input', this.selectValue);
        this.close();
      }
    },
    initValue(){
      this.todayString = this.formatTime(new Date(), "Y-M-D");
      let now = this.selectValue ? new Date(this.selectValue) : new Date()
      let selectDay = {
        year: now.getFullYear(),
        month: now.getMonth() + 1,
        day: now.getDate(),
        dateString: this.formatTime(now, "Y-M-D")
      }
      this.selectDay = selectDay;
      this.dateInit(selectDay.year, selectDay.month);
      this.setSpot();
    },
    hiddenBox(event){
      if(this.isShow == true){
        let div = this.$refs.calendarRef;
        if (event.target !== div && !div.contains(event.target)) {
          this.isShow = false;
        }
      }
    },
    updateCalendarPosition(){
      let panel = this.$refs.calendarPanel;
      let container = this.$refs.calendarRef;
      if(!panel || !container){
        return;
      }
      let margin = 10;
      let windowWidth = document.documentElement.clientWidth || window.innerWidth;
      let panelWidth = Math.min(panel.offsetWidth || 276, windowWidth - margin * 2);
      let containerRect = container.getBoundingClientRect();
      let panelLeft = containerRect.right - panelWidth;
      let maxLeft = windowWidth - panelWidth - margin;
      if(panelLeft < margin){
        panelLeft = margin;
      }else if(panelLeft > maxLeft){
        panelLeft = maxLeft;
      }
      this.calendarStyle = {
        left: (panelLeft - containerRect.left) + 'px',
        right: 'auto',
        width: panelWidth + 'px'
      };
    }
  },
  beforeDestroy(){
    document.removeEventListener('click',this.hiddenBox);
    window.removeEventListener('resize', this.updateCalendarPosition);
  },
  watch: {
    value(newValue) {
      this.selectValue = newValue;
      if (this.isShow) {
        this.initValue();
        this.$nextTick(this.updateCalendarPosition);
      }
    },
    isShow(value){
      if(value == true){
        document.addEventListener('click', this.hiddenBox);
        window.addEventListener('resize', this.updateCalendarPosition);
      }else{
        document.removeEventListener('click',this.hiddenBox);
        window.removeEventListener('resize', this.updateCalendarPosition);
      }
    }
  }
}
</script>

<style scoped>

.select-box {
  position: relative;
  width: 100%;
  font-size: 14px;
}

.select-current {
  height: 34px;
  position: relative;
  width: 100%;
  padding: 0 5px;
  line-height: 34px;
  border-radius: 3px;
  box-sizing: border-box;
  font-size: 14px;
  color: #555;
  background-color: #fff;
  border: 1px solid #cbd0d8;
  cursor: pointer;
}

.select-current::after {
  position: absolute;
  display: block;
  right: 8px;
  top: 15px;
  content: '';
  width: 0;
  height: 0;
  border: 5px solid transparent;
  border-top: 5px solid #999;
}

.current-name {
  display: block;
  width: 100%;
  height: 100%;
  white-space: nowrap;
  word-wrap: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.clear-button {
  position: absolute;
  right: 23px;
  top: 9px;
  width: 16px;
  min-width: 16px;
  height: 16px;
  margin: 0;
  padding: 0;
  border-radius: 50%;
  border: 1px solid #c5ccd6;
  box-sizing: border-box;
  background-color: #f7f8fa;
  cursor: pointer;
  z-index: 1;
}

.clear-button::before,
.clear-button::after {
  position: absolute;
  left: 50%;
  top: 50%;
  content: '';
  width: 7px;
  height: 1px;
  background-color: #8f98a3;
  border-radius: 1px;
}

.clear-button::before {
  transform: translate(-50%, -50%) rotate(45deg);
}

.clear-button::after {
  transform: translate(-50%, -50%) rotate(-45deg);
}

.clear-button:hover {
  border-color: #9aa3ad;
  background-color: #eef1f5;
}

.clear-button:hover::before,
.clear-button:hover::after {
  background-color: #666;
}

.calendar {
  position: absolute;
  right: 0;
  top: 38px;
  max-height: 450px;
  overflow: auto;
  width: 276px;
  max-width: calc(100vw - 20px);
  padding: 4px;
  border-radius: 3px;
  box-sizing: border-box;
  z-index: 99;
  border: 1px solid #cad5de;
  background-color: #fff;
  box-shadow: 0 4px 12px rgba(15, 78, 160, 0.12);
}

 .tool-month-box{
  width: 20px; 
  height: 18px; 
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 4px;
  border-radius: 3px;
  cursor: pointer;
  flex-shrink: 0;
 }

 .tool-month-box:hover {
  background-color: #edf7fd;
 }
 .next-month {
  width:0;
  height:0;
  border-top:6px solid transparent;
  border-left:6px solid #333;
  border-bottom:6px solid transparent;
}
.last-month {
  width:0;
  height:0;
  border-right:6px solid #333;
  border-bottom:6px solid transparent;
  border-top:6px solid transparent;
}
.last-year,
.next-year {
  position: relative;
  width: 10px;
  height: 12px;
}
.last-year::before,
.last-year::after,
.next-year::before,
.next-year::after {
  position: absolute;
  top: 0;
  content: '';
  width: 0;
  height: 0;
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
}
.last-year::before,
.last-year::after {
  border-right: 6px solid #333;
}
.next-year::before,
.next-year::after {
  border-left: 6px solid #333;
}
.last-year::before {
  left: 0;
}
.last-year::after {
  left: 4px;
}
.next-year::before {
  left: 0;
}
.next-year::after {
  left: 4px;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
 
.flex-around {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
 
.flex-wrap {
  flex-wrap: wrap;
}
 
.calendar .title {
  font-size: 18px;
  color: #555;
  padding: 6px 4px 5px;
  line-height: 26px;
  justify-content: center;
}

.calendar .title .title-nav {
  width: 100%;
  justify-content: center;
}
 
.calendar .title .year-month {
  margin: 0 6px;
  min-width: 90px;
  text-align: center;
}
 
.calendar .calendar-week {
  justify-content: flex-start;
  line-height: 20px;
  padding: 0 7px;
  font-size: 14px;
  color: #999;
}

.calendar .calendar-week .div {
  width: 36px;
  text-align: center;
}
 
.calendar .calendar-main {
  padding: 10px 7px 4px;
  transition: height 0.3s;
  align-content: flex-start;
}
 
.calendar .calendar-main .day {
  position: relative;
  width: 36px;
  color: #666;
  text-align: center;
  height: 30px;
}
 
.calendar .calendar-main .day .bg {
  width: 23px;
  height: 23px;
  line-height: 23px;
  margin: 0 auto;
  border-radius: 50%;
  box-sizing: border-box;
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

.calendar .calendar-main .day .bg:not(.select):hover {
  background-color: #edf7fd;
}
 
.calendar .calendar-main .day .select {
  text-align: center;
  color: #fff;
  background: linear-gradient(-60deg, #0f74c7, #1279be);
  box-shadow: 0px 5px 16px 0px #C6F3ED;
}

.calendar .calendar-main .day .today:not(.select) {
  border: 1px solid #0f74c7;
  color: #0f74c7;
}
 
.calendar .calendar-main .day .other-month {
  color: #dfe7ee;
}
 
.calendar .calendar-main .day .spot {
  width: 4px;
  height: 4px;
  background-color: #1DCDB8;
  border-radius: 50%;
  margin: 3px auto 0;
}

.calendar-footer {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 2px;
  padding: 5px 7px 2px;
  border-top: 1px solid #edf1f5;
}

.calendar-footer button {
  min-width: 44px;
  height: 24px;
  margin: 0;
  padding: 0 10px;
  border: 1px solid #cad5de;
  border-radius: 3px;
  box-sizing: border-box;
  background-color: #fff;
  color: #555;
  cursor: pointer;
  font-size: 13px;
}

.calendar-footer .today-button {
  border-color: #0f74c7;
  color: #0f74c7;
}

.calendar-footer button:hover {
  background-color: #edf7fd;
}
</style>