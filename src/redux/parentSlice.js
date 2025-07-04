import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    parent:null,
    token:null
}

export const parentSlice = createSlice({
    name: 'parent',
    initialState,
    reducers: {
    loginParent: (state,action) => {
        state.parent = action.payload.parent;
        state.token  = action.payload.token;
    },
    logoutParent:(state)=>{
        state.parent = null
        state.token = null;
    },
    changeParentName:(state,action)=>
    {
        state.parent.name = action.payload.name
    },
    changeParentImage:(state,action)=>
    {
        state.parent.image = action.payload.image
    }
},
})

// Action creators are generated for each case reducer function
export const { loginParent ,logoutParent , changeParentName , changeParentImage} = parentSlice.actions

export default parentSlice.reducer