<template>
  <div ref="selectRef" class="select-box">
    <div class="select-current" @click="openClose">
      <span class="current-name">{{selected[displayField]}}</span>
    </div> 
    <div ref="containRef" class="option-list" v-if="isShow">
      <div @click="optionTap(item)" :class="item[valueField] == value[valueField]?'option option-active':'option'"
        v-for="(item,index) in options"  
        :key="index"
        :ref="'itemRef-'+item[valueField]">{{item[displayField]}}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MySelect',
  props: {
    options: {
      type: Array,
      value: []
    },
    displayField: {
      type: String,
      value: 'name'
    },
    valueField: {
      type: String,
      value: 'id'
    },
    value: {
      type: Object
    }
  },
  data(){
    return {
      isShow: false,
      selected:this.value
    }
  },
  methods:{
    openClose() {
      this.isShow= !this.isShow
    },
    optionTap(item) {
      this.selected = item;
      this.close();
    },
    close() {
      this.isShow=false
    },
    hiddenBox(event){
      if(this.isShow == true){
        let div = this.$refs.selectRef;
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
    selected(newValue) {
      this.$emit('input', newValue);
      this.$emit('select', newValue);
    },
    value(newValue) {
      this.selected = newValue;
    },
    isShow(value){
      if(value == true){
        document.addEventListener('click', this.hiddenBox);
        setTimeout(() => {
          let contain = this.$refs.containRef; 
          let itemRef = 'itemRef-'+this.selected[this.valueField];
          let element = this.$refs[itemRef];
          if(element){
            let top = element[0].offsetTop;
            top = top - 105;
            contain.scrollTop = top ;
          }
        }, 0);
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
  padding-top: 0px;
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

.option-list {
  position: absolute;
  left: 0;
  top: 38px;
  max-height: 250px;
  overflow: scroll;
  width: 100%;
  padding: 12rpx 0rpx 10rpx 10rpx;
  border-radius: 3px;
  box-sizing: border-box;
  z-index: 99;
  background-color: #fff;
  border: 1px solid #cad5de;
  overflow: auto;
}

.option {
  display: block;
  width: 100%;
  line-height: 35px;
  padding-left: 5px;
  border-bottom: 1px solid #dfe7ee;
}

.option:hover {
  background-color: #edf7fd!important
}

.option-active {
  background-color: #edf7fd!important
}

.option:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
</style>