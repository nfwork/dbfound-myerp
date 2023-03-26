Component({
  properties: {
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
      type: Object,
      value: {}
    }
  },
  data: {
    isShow: false
  },
  methods: {
    optionTap(e) {
      let dataset = e.target.dataset

      // 调用父组件方法，并传参
      const res = {};
      res[this.data.displayField] = dataset.name;
      res[this.data.valueField] = dataset.id;
      this.setData({
        value: res,
        isShow: false
      });
      this.triggerEvent("change", res)
    },
    openClose() {
      this.setData({
        isShow: !this.data.isShow
      })
    },

    // 此方法供父组件调用
    close() {
      this.setData({
        isShow: false
      })
    }
  },
  lifetimes: {
    attached() {
      
    }
  }
})