<template>
<div class="container">

<div id="chart"></div>

<div v-once class="panel">
  <div>
    <div class="ctrl">
      <input v-model.trim="code" type="text" placeholder="Stock Code" />
      <button type="button" @click="addStock()">ADD</button>
    </div>
  </div>
</div>

</div>
</template>

<script>
import HighCharts from 'highcharts/highstock'
import ChartOpts from '../config/ChartOpts'
import ChartTheme from '../config/ChartTheme'
export default {
  name: 'Chart',
  data () {
    return {
      ws: null,
      chart: null,
      code: '',
    }
  },

  methods: {
    establish () {
      try {
        this.ws = new WebSocket('wss://' + window.location.host)
      } catch (ex) {
        return alert(`Your browser dosen't support WebSocket`)
      }
      this.ws.onopen = () => {
        console.log('WebSocket established')
      }
      this.ws.onclose = () => {
        console.log('connection closed')
      }
      this.ws.onmessage = msg => {
        msg = JSON.parse(msg.data)
        if (!msg.code) {
          return console.log(0)
        } else if (msg.add) {
          return this.addStock(msg.code)
        } else {
          return this.delStock(msg.code)
        }
      }
    },
    initChart () {
      this.chart = new HighCharts.StockChart('chart', ChartOpts)
    },
    focus () {
      $('.ctrl input').focus()
    },
    getStock () {
      this.$store.dispatch('set')
        .then(data => {
          for (let v of data) {
            this.$store.dispatch('get', v.code)
             .then(data => {
               data.data.reverse()
               HighCharts.each(data.data, d => {
                 d.length = 2
                 d[0] = Date.parse(d[0])
               })
               this.chart.addSeries(data)
             })
             .catch(ex => {
               console.log(ex)
             })
          }
        })
        .catch(ex => {
          console.log(ex)
        })
      this.focus()
    },
    addStock (code) {
      code = code || this.code
      if (!code) {
        return $('.ctrl input').addClass('error')
      }
      $('.ctrl input').removeClass('error')
      this.$store.dispatch('add', code)
        .then(data => {
          data.data.reverse()
          HighCharts.each(data.data, d => {
            d.length = 2
            d[0] = Date.parse(d[0])
          })
          this.chart.addSeries(data)
          this.ws.send(JSON.stringify({ add: true, code: code }))
        })
        .catch(ex => {
          if (!ex.data) {
            return
          } else {
            let data = ex
            data.data.reverse()
            HighCharts.each(data.data, d => {
              d.length = 2
              d[0] = Date.parse(d[0])
            })
            this.chart.series[this.chart.series.findIndex(v => v.name === data.name)]
              ? ''
              : this.chart.addSeries(data)
          }
        })
      this.focus()
    },
    delStock (code) {
      let v = this.chart.series[this.chart.series.findIndex(v => v.name === code)]
      if (v) {
        v.remove()
        this.$store.dispatch('del', code)
          .then(() => {
            this.ws.send(JSON.stringify({ add: false, code: code }))
          })
          .catch(ex => {
            console.log(ex)
          })
        this.focus()
      }
      $('#' + code).fadeOut(500)
    }
  },

  created () {
    HighCharts.setOptions(ChartTheme)
    this.establish()
    this.$root.$on('delStock', this.delStock)
  },

  mounted () {
    this.initChart()
    this.getStock()
    $('.ctrl input').on('keyup', e => {
      if (e.keyCode === 13) {
        this.addStock()
      }
    }).focus()
  },

  beforeDestroy () {
    this.$root.$off('delStock')
  }
}
</script>

<style lang="scss">
.ctrl {
  position: relative;
  display: inline-block;
  height: 45px;
  width: 100%;
  text-align: center;
  input {
    position: absolute;
    left: 0;
    display: inline-block;
    width: 100%;
    height: 100%;
    padding-left: 5px;
    padding-right: 46%;
    border: 1.5px solid var(--green);
    background-color: transparent;
    transition: all 0.14s linear;
    &:focus {
      outline: none;
    }
    &.error {
      border-color: var(--danger);
    }
  }
  button {
    position: absolute;
    right: 0;
    width: 45%;
    height: 100%;
    background-color: var(--green);
    border-width: 0;
    overflow: hidden;
    cursor: pointer;
    &:active {
      background-color: var(--teal);
    }
  }
}
</style>
