import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    guest:null,
    token:null
}

export const guestSlice = createSlice({
    name: 'guest',
    initialState,
    reducers: {
    loginGuest: (state,action) => {
        state.guest = action.payload.guest;
        state.token = action.payload.token;
    },
    logoutGuest:(state)=>{
        state.guest = null
        state.token = null;
    },
    changeGuestName:(state,action)=>
    {
        state.guest.name = action.payload.name
    },
    changeGuestImage:(state,action)=>
    {
        state.guest.image = action.payload.image
    }
},
})

// Action creators are generated for each case reducer function
export const { loginGuest ,logoutGuest , changeGuestName , changeGuestImage} = guestSlice.actions
export default guestSlice.reducer