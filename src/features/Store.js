import { configureStore } from '@reduxjs/toolkit'
import { proposalSliceReducer } from './proposal/ProposalSlice'

const store = configureStore({
    reducer: {
        proposal: proposalSliceReducer,
    }
})

export default store;