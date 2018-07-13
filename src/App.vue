<template>
<div id="A">

<div class="wrapper">

<Chart/>
<StockList/>

</div>

</div>
</template>

<script>
import Chart from './components/Chart.vue'
import StockList from './components/StockList.vue'
export default {
  name: 'App',
  components: {
    Chart,
    StockList
  }
}
</script>

<style lang="scss">
@import '/assets/css/main.scss';
div {
  text-align: center;
  .wrapper {
    padding: 5% 15%;
  }
}
</style>
