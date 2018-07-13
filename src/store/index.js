import axios from 'axios'
export default {
  state: {
    st: [],
    dt: []
  },

  mutations: {
    SET_STOCK (state, data) {
      state.st = data || []
    },
    ADD_STOCK (state, data) {
      if (!state.st.some(v => v.code.toUpperCase() === data.name.toUpperCase())) {
        state.st.push({ code: data.name })
      }
      if (!state.dt.some(v => v.name.toUpperCase() === data.name.toUpperCase())) {
        state.dt.push(data)
      }
    },
    DEL_STOCK (state, code) {
      state.st = state.st.filter(v => v.code !== code)
      state.dt = state.dt.filter(v => v.name !== code)
    }
  },

  actions: {
    set ({ commit }) {
      return axios.get('/api/stock')
        .then(data => {
          data = data.data
          commit('SET_STOCK', data)
          return data
        })
        .catch(ex => {
          throw ex
        })
    },
    get ({ commit }, code) {
      return axios.get('/api/stock/' + code)
        .then(data => {
          data = data.data
          commit('ADD_STOCK', { id: data.name, name: data.code, data: data.data })
          return { id: data.name, name: data.code, data: data.data }
        })
        .catch(ex => {
          throw ex
        })
    },
    add ({ commit }, code) {
      return axios.put('/api/stock', { code })
        .then(data => {
          data = data.data
          commit('ADD_STOCK', { id: data.name, name: data.code, data: data.data })
          return { id: data.name, name: data.code, data: data.data }
        })
        .catch(ex => {
          if (ex.response &&
              ex.response.data &&
              ex.response.data.msg === 'Exist') {
            let data = ex.response.data
            commit('ADD_STOCK', { id: data.name, name: data.code, data: data.data })
            throw { id: data.name, name: data.code, data: data.data }
          } else {
            throw ex
          }
        })
    },
    del ({ commit }, code) {
      return axios.delete('/api/stock/' + code)
        .then(data => {
          commit('DEL_STOCK', code)
        })
        .catch(ex => {
          throw ex
        })
    }
  }
}
