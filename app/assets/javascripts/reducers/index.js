import { combineReducers } from 'redux'
import magma from './magma_reducer'
import messages from './message_reducer'
import plots from './plots_reducer'
import timur from './timur_reducer'
import search from './search_reducer'
import manifestsUI from './manifest_ui_reducer'
import manifests from './manifests_reducer'
import consignments from './consignments_reducer'
import exchanges from './exchanges_reducer'

export default combineReducers({
  timur,
  search,
  magma,
  messages,
  plots,
  manifestsUI,
  manifests,
  consignments,
  exchanges
})