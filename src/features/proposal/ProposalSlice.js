import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    selectedProposal: null,
    clientProposals: [],
    loading: false,
    error: null
}

const proposalSlice = createSlice({
    name: "proposal",
    initialState,
    reducers: {
        setClientProposals: (state, action) => {
            state.clientProposals = action.payload;
        },
        setSelectedProposal: (state, action) => {
            state.selectedProposal = action.payload;
        },
        clearProposals: (state) => {
            state.clientProposals = [];
            state.selectedProposal = null;
        }
    }
});

// Seletores
export const selectClientProposals = (state) => state.proposal.clientProposals;
export const selectSelectedProposal = (state) => state.proposal.selectedProposal;

export const proposalSliceReducer = proposalSlice.reducer
export const { setClientProposals, setSelectedProposal, clearProposals } = proposalSlice.actions