import axios from 'axios'
import router from '../router'
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


let api = axios.create({
  baseURL: '//localhost:3000/api/',
  timeout: 2000,
  withCredentials: true
})
let auth = axios.create({
  baseURL: '//localhost:3000/',
  timeout: 2000,
  withCredentials: true
})

// REGISTER ALL DATA HERE
let state = {
  campaigns: [],
  activeCampaign: {},
  encounters: [],
  players: [],
  monsters: [],
  spells: [],
  weapons: [],
  equipment: [],
  conditions: [],
  error: {},
  user: {}
}

let handleError = (state, err) => {
  state.error = err
}

export default new Vuex.Store({
  // ALL DATA LIVES IN THE STATE
  state,

  mutations: {
    setCampaigns(state, campaigns) {
      state.campaigns = campaigns
    },
    setActiveCampaign(state, activeCampaign) {
      Vue.set(state.activeCampaign, activeCampaign._id, activeCampaign)
    },
    setEncounters(state, encounters) {
      state.encounters = encounter._id
    },

    setPlayers(state, players) {
      state.players = player._id
    },

    setMonsters(state, monsters){ 
      state.monsters = monsters
      
    },

    setSpells(state, spells){
      state.spells = spells
     
    },

    setWeapons(state, weapons){
      state.weapons = weapons
    },

    setEquipment(state, equipment){
      state.equipment = equipment
    },

    setConditions(state, conditions){
      state.conditions = conditions
    },

    setUser(state, user){
      state.user = user
    }
  },

  // ACTIONS ARE RESPONSIBLE FOR MANAGING ALL ASYNC REQUESTS
  actions: {
    getCampaigns({ commit, dispatch }) {
      api('/usercampaigns')
        .then(res => {
          commit('setCampaigns', res.data.data)
        })
        .catch(handleError)
    },
    getCampaign({ commit, dispatch }, id) {
      api('/usercampaigns/' + id)
        .then(res => {
          commit('setActiveCampaign', res.data.data)
        })
        .catch(handleError)
    },
    createCampaign({ commit, dispatch }, campaign) {
      api.post('/usercampaigns/', campaign)
        .then(res => {
          dispatch('getCampaigns')
        })
        .catch(handleError)
    },
    removeCampaign({ commit, dispatch }, campaign) {
      api.delete('/usercampaigns/' + campaign._id)
        .then(res => {
          dispatch('getCampaigns')
        })
        .catch(handleError)
    },
    getEncounters({ commit, dispatch }, id) {
      api('/usercampaigns/' + id + '/encounters/')
        .then(res => {
          commit('setEncounters', res.data.data)
        })
        .catch(handleError)
    },
    createEncounter({ commit, dispatch }, encounter) {
      api.post('/encounters', encounter)
        .then(res => {
          dispatch('getEncounters', encounter.campaignId)
        })
        .catch(handleError)
    },
    removeEncounter({ commit, dispatch }, encounter) {
      api.delete('/encounters/' + encounter._id)
        .then(res => {
          dispatch('getEncounters', encounter.campaignId)
        })
        .catch(handleError)
    },
    getPlayers({ commit, dispatch }, id) {
      api('/usercampaigns/' + id + '/players/')
        .then(res => {
          commit('setPlayers', res.data.data)
        })
        .catch(handleError)
    },
    createPlayer({ commit, dispatch }, player) {
      api.post('/players/', player)
        .then(res => {
          dispatch('getPlayers', player.campaignId)
        })
        .catch(handleError)
    },
    removePlayer({ commit, dispatch }, player) {
      api.delete('/players/' + player._id)
        .then(res => {
          dispatch('getPlayers', player.campaignId)
        })
        .catch(handleError)
    },
    
    login({ commit, dispatch }, user) {
      auth.post('login', user)
        .then(res => {
          console.log(res)
          if (res.data.error) {
            return handleError(res.data.error)
          }
          commit('user', res.data.data)
          router.push('/campaigns')
        })
        .catch(handleError)
    },
    register({ commit, dispatch }, user) {
      auth.post('register', user)
        .then(res => {
          console.log(res)
          if (res.data.error) {
            return handleError(res.data.error)
          }
          //LETS REDIRECT THE PAGE
          state.user = res.data//commit
          router.push('/campaigns')
        })
        .catch(handleError)
    },
    getAuth() {
      auth('authenticate')
        .then(res => {
          if (!res.data.data) {
            return router.push('/login')
          }
          state.user = res.data.data
          router.push('/campaigns')
        }).catch(err => {
          router.push('/login')
        })
    },
    clearError() {
      state.error = {}
    }
  }
})