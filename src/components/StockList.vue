<template>
<div>

<div v-if="$store.state.dt.length" class="show">
  <ul>
    <li v-for="v in $store.state.dt" :key="v.name" :id="v.name">
      <div class="stock">
        <div>
          <h4>{{ v.name }}</h4>
          <button @click="delStock(v.name)" class="del">X</button>
        </div>
        <p>{{ v.id }}</p>
      </div>
    </li>
  </ul>
</div>
<div v-else-if="$store.state.st.length" class="show">
  <ul>
    <li v-for="v in $store.state.st" :key="v.code">
      <div class="stock">
        <div>
          <h4>{{ v.code }}</h4>
          <button @click="delStock(v.code)" class="del">X</button>
        </div>
      </div>
    </li>
  </ul>
</div>

</div>
</template>
<script>
export default {
  name: 'StockList',
  props: ['chart'],
  methods: {
    delStock (code) {
      this.$root.$emit('delStock', code)
    }
  }
}
</script>
<style lang="scss">
.show {
  width: 100%;
  height: 100%;
  ul {
    display: grid;
    width: 100%;
    height: 100%;
    grid-template-columns: 1fr 1fr;
    grid-gap: 6px;
    margin: 0;
    padding: 5px 0;
    li {
      position: relative;
      padding: 10px 15px;
      border-radius: 3px;
      background-color: var(--dark);
      color: var(--light);
      .stock {
        * {
          text-align: left;
        }
        .del {
          position: absolute;
          top: 0;
          right: 0;
          display: inline-block;
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          border-style: none;
          border-radius: 3px;
          background-color: var(--danger);
          &:hover {
            cursor: pointer;
            opacity: 0.8;
          }
        }
      }
    }
  }
}
</style>
