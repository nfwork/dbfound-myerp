<template>
  <div ref="selectRef" class="select-box">
    <div class="select-current" @click="openClose">
      <span class="current-name">{{selectedName}}</span>
      <button
        v-if="clearable && hasSelected"
        type="button"
        class="clear-button"
        title="清空"
        aria-label="清空"
        @click.stop="clearSelect"
      ></button>
    </div> 
    <div ref="containRef" class="option-list" v-if="isShow">
      <div @click="optionTap(item)" :class="isOptionSelected(item)?'option option-active':'option'"
        v-for="(item,index) in options"  
        :key="getOptionValue(item) || index"
        :ref="'itemRef-'+getOptionValue(item)">{{item[displayField]}}
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
      default: () => []
    },
    displayField: {
      type: String,
      default: 'name'
    },
    valueField: {
      type: String,
      default: 'id'
    },
    value: {
      type: Object,
      default: () => ({})
    },
    clearable: {
      type: Boolean,
      default: true
    }
  },
  data(){
    return {
      isShow: false,
      selected:this.value || {}
    }
  },
  computed:{
    selectedName(){
      const name = this.selected ? this.selected[this.displayField] : '';
      return name === undefined || name === null ? '' : name;
    },
    hasSelected(){
      return this.selectedName !== '';
    }
  },
  methods:{
    openClose() {
      this.isShow= !this.isShow
    },
    optionTap(item) {
      this.selected = item;
      this.$emit('input', item);
      this.$emit('select', item);
      this.close();
    },
    clearSelect() {
      const emptyValue = {};
      this.selected = emptyValue;
      this.$emit('input', emptyValue);
      this.$emit('select', emptyValue);
      this.$emit('clear');
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
    },
    getOptionValue(item){
      return item ? item[this.valueField] : null;
    },
    isOptionSelected(item){
      return this.getOptionValue(item) == this.getOptionValue(this.selected);
    },
    scrollToSelected(){
      let contain = this.$refs.containRef;
      let selectedValue = this.getOptionValue(this.selected);
      if(!contain || selectedValue === null || selectedValue === undefined){
        return;
      }
      let element = this.$refs['itemRef-'+selectedValue];
      if(Array.isArray(element)){
        element = element[0];
      }
      if(element){
        contain.scrollTop = Math.max(element.offsetTop - 105, 0);
      }
    }
  },
  beforeDestroy(){
    document.removeEventListener('click',this.hiddenBox);
  },
  watch: {
    value(newValue) {
      this.selected = newValue || {};
      if(this.isShow){
        this.$nextTick(this.scrollToSelected);
      }
    },
    isShow(value){
      if(value == true){
        document.addEventListener('click', this.hiddenBox);
        this.$nextTick(this.scrollToSelected);
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
  width: calc(100% - 45px);
  height: 100%;
  word-wrap: normal;
  overflow: hidden;
}

.clear-button {
  position: absolute;
  right: 25px;
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