<template>
<div ref="calendarRef" class="select-box">
  <div class="select-current" @click="openClose">
    <div class="current-name">{{selectValue}}</div>
  </div>

<div v-if="isShow" class="calendar">
	<div class="title flex">
		<div class="flex">
			<div @click="lastMonth" class="tool-month-box">
        <div class="last-month"></div>
      </div>
      <div class="year-month">{{selectDay.year}}.{{selectDay.month>9?selectDay.month:"0"+selectDay.month}}</div>
      <div @click="nextMonth" class="tool-month-box">
        <div class="next-month" ></div>
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
			<div :class="'bg ' + ((item.year != selectDay.year || item.month != selectDay.month) ? 'other-month' : (item.day === selectDay.day) ? 'select':'')" @click="selectChange(item)">
				{{item.day}} 
			</div>
			<div class="spot" v-if="item.spot"></div>
		</div>
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
      value: []
    },
    value: {
      type: String,
      value: ''
    }
  },
  data(){
    return {
        dateList: [], //日历主体渲染数组
        selectDay: {}, //选中时间
        open: true,
        isShow: false,
        selectValue: this.value
    }
  },
  methods: {
    openClose() {
      this.isShow= !this.isShow
      this.initValue();
    },

    // 此方法供父组件调用
    close() {
      this.isShow = false;
    },
    /**
     * 时间戳转化为年 月 日 时 分 秒
     * time: 需要被格式化的时间，可以被new Date()解析即可
     * format：格式化之后返回的格式，年月日时分秒分别为Y, M, D, h, m, s，这个参数不填的话则显示多久前
     */
    formatTime(time, format) {
      function formatNumber(n) {
        n = n.toString()
        return n[1] ? n : '0' + n
      }
 
      function getDate(time, format) {
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
      }
 
      function getDateDiff(time) {
        let r = ''
        const ft = new Date(time)
        const nt = new Date()
        const nd = new Date(nt)
        nd.setHours(23)
        nd.setMinutes(59)
        nd.setSeconds(59)
        nd.setMilliseconds(999)
        const d = parseInt((nd - ft) / 86400000)
        switch (true) {

          case d === 0:
            const t = parseInt(nt / 1000) - parseInt(ft / 1000)
            switch (true) {
              case t < 60:
                r = '刚刚'
                break
              case t < 3600:
                r = parseInt(t / 60) + '分钟前'
                break
              default:
                r = parseInt(t / 3600) + '小时前'
            }
            break
          case d === 1:
            r = '昨天'
            break
          case d === 2:
            r = '前天'
            break
          case d > 2 && d < 30:
            r = d + '天前'
            break
          default:
            r = getDate(time, 'Y-M-D')
        }
        return r
      }
      if (!format) {
        return getDateDiff(time)
      } else {
        return getDate(time, format)
      }
    },
    //picker设置月份
    editMonth(e) {
      const arr = e.detail.value.split("-")
      const year = parseInt(arr[0])
      const month = parseInt(arr[1])
      this.setMonth(year, month)
    },
    //上月切换按钮点击
    lastMonth() {
      const lastMonth = new Date(this.selectDay.year, this.selectDay.month - 2)
      const year = lastMonth.getFullYear()
      const month = lastMonth.getMonth() + 1
      this.setMonth(year, month)
    },
    //下月切换按钮点击
    nextMonth() {
      const nextMonth = new Date(this.selectDay.year, this.selectDay.month)
      const year = nextMonth.getFullYear()
      const month = nextMonth.getMonth() + 1
      this.setMonth(year, month)
    },
    //设置月份
    setMonth(setYear, setMonth, setDay) {
      if (this.selectDay.year !== setYear || this.selectDay.month !== setMonth) {
        const day = Math.min(new Date(setYear, setMonth, 0).getDate(), this.selectDay.day)
        const time = new Date(setYear, setMonth - 1, setDay ? setDay : day)
        this.selectDay = {
            year: setYear,
            month: setMonth,
            day: setDay ? setDay : day,
            dateString: this.formatTime(time, "Y-M-D")
        };
        this.selectValue = this.formatTime(time, "Y-M-D")
        if (!setDay) {
          this.open = true
        }
        this.dateInit(setYear, setMonth)
        this.setSpot()
        this.$emit('input', this.selectValue);
      }
    },
    //展开收起
    openChange() {
      this.open = !this.open;
      this.dateInit()
      this.setSpot()
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
     //  this.dateList= this.data.dateList
    },
    //日历主体的渲染方法
    dateInit(setYear = this.selectDay.year, setMonth = this.selectDay.month) {
      let dateList = []; //需要遍历的日历数组数据
      let now = new Date(setYear, setMonth - 1)//当前月份的1号
      let startWeek = now.getDay(); //目标月1号对应的星期
      let dayNum = new Date(setYear, setMonth, 0).getDate() //当前月有多少天
      let forNum = Math.ceil((startWeek + dayNum) / 7) * 7 //当前月跨越的周数
      if (this.open) {
        //展开状态，需要渲染完整的月份
        for (let i = 0; i < forNum; i++) {
          const now2 = new Date(now)
          now2.setDate(i - startWeek + 1)
          let obj = {};
          obj = {
            day: now2.getDate(),
            month: now2.getMonth() + 1,
            year: now2.getFullYear(),
            dateString: this.formatTime(now2, "Y-M-D")
          };
          dateList[i] = obj;
        }
      } else {
        //非展开状态，只需要渲染当前周
        for (let i = 0; i < 7; i++) {
          const now2 = new Date(now)
          //当前周的7天
          now2.setDate(Math.ceil((this.selectDay.day + startWeek) / 7) * 7 - 6 - startWeek + i)
          let obj = {};
          obj = {
            day: now2.getDate(),
            month: now2.getMonth() + 1,
            year: now2.getFullYear(),
            dateString: this.formatTime(now2, "Y-M-D")
          };
          dateList[i] = obj;
        }
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
      } else  {
        this.selectDay= selectDay;
        this.selectValue = selectDay.dateString;
        this.$emit('input', this.selectValue);
        this.close();
      }
    },
    myTouchStart(e) {
      //开启滑动事件
      this.slipFlag = true;
      this.startPoint = e.touches[0];
    },
  
    myTouchMove(e) {
      // ----------------监听手势左右滑事件----------------
      if (((this.startPoint.clientX - e.touches[e.touches.length - 1].clientX) > 80) && this.slipFlag) {
        this.slipFlag = false
        this.nextMonth();
      } else if (((this.startPoint.clientX - e.touches[e.touches.length - 1].clientX) < -80) && this.slipFlag) {
        this.slipFlag = false
        this.lastMonth();
      }
    },
    initValue(){
      if(!(this.selectDay.year)){
        let now = this.selectValue ? new Date(this.selectValue) : new Date()
        let selectDay = {
          year: now.getFullYear(),
          month: now.getMonth() + 1,
          day: now.getDate(),
          dateString: this.formatTime(now, "Y-M-D")
        }
        this.setMonth(selectDay.year, selectDay.month, selectDay.day);
      }
    },
    hiddenBox(event){
      if(this.isShow == true){
        let div = this.$refs.calendarRef;
        if (event.target !== div && !div.contains(event.target)) {
          this.isShow = false;
        }
      }
    }
  },
  beforeDestroy(){
    document.removeEventListener('click',this.hiddenBox);
  },
  watch: {
    value(newValue) {
      this.selectValue = newValue;
    },
    isShow(value){
      if(value == true){
        document.addEventListener('click', this.hiddenBox);
      }else{
        document.removeEventListener('click',this.hiddenBox);
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
  border-radius: 8rpx;
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
  width: 85%;
  height: 100%;
  word-wrap: normal;
  overflow: hidden;
}

.calendar {
  position: absolute;
  right: 0;
  top: 38px;
  max-height: 450px;
  overflow: scroll;
  width: 290px;
  padding: 6px 6px 5px 6px;
  border-radius: 3px;
  box-sizing: border-box;
  z-index: 99;
  border: 1px solid #cad5de;
  background-color: #fff;
}

 .tool-month-box{
  width: 20px; 
  height: 15px; 
  text-align: center;
  display: flex;
  justify-content: center;
  margin: 0 15px;
 }
 .next-month {
  width:0;
  height:0;
  border-top:7px solid transparent;
  border-left:7px solid #333;
  border-bottom:7px solid transparent;
}
.last-month {
  width:0;
  height:0;
  border-right:7px solid #333;
  border-bottom:7px solid transparent;
  border-top:7px solid transparent;
}

.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
 
.direction-column {
  flex-direction: column;
}
 
.flex1 {
  flex: 1;
}
 
.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
 
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
 
.flex-end {
  display: flex;
  justify-content: flex-end;
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
 
.align-start {
  align-items: flex-start;
}
 
.align-end {
  align-items: flex-end;
}
 
.align-stretch {
  align-items: stretch;
}
 
.calendar {
  background-color: #fff;
}
 
.calendar .title {
  font-size: 20px;
  color: #555;
  padding: 10px;
  padding-left: 55px;
  line-height: 30px;
}
 
.calendar .title .year-month {
  margin-right: 0px;
}
 
.calendar .title .icon {
  padding: 0 8px;
  font-size: 16px;
  color: #999;
}
 
.calendar .title .open {
  background-color: #f6f6f6;
  color: #999;
  font-size: 12px;
  line-height: 18px;
  border-radius: 9px;
  padding: 0 7px;
}
 
.calendar .calendar-week {
  line-height: 20px;
  padding: 0 12px;
  font-size: 14px;
  color: #999;
}
 
.calendar .calendar-week .view {
  width: 50px;
  text-align: center;
}
 
.calendar .calendar-main {
  padding: 14px 11px;
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
  height: 23px;
  line-height: 23px;
  font-size: 14px;
  color: #333;
}
 
.calendar .calendar-main .day .select {
  width: 23px;
  border-radius: 50%;
  text-align: center;
  color: #fff;
  background: linear-gradient(-60deg, #0f74c7, #1279be);
  box-shadow: 0px 5px 16px 0px #C6F3ED;
  margin: 0 auto;
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
</style>