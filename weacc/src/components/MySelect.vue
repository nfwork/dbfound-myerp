<template>
  <div ref="selectRef" class="select-box">
    <div class="select-current" @click="openClose">
      <span class="current-name">{{selectedName}}</span>
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
      return this.selected ? this.selected[this.displayField] : '';
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