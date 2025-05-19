import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  student:null,
  token:null
}

export const studentSlice = createSlice({
  name: 'student',
  initialState,
  reducers: {
    loginStudent: (state,action) => {
        state.student = action.payload.student;
        state.token = action.payload.token;
    },
    studentLogout:(state)=>{
        state.student = null
        state.token = null;
    },
    changeStudentName:(state,action)=>
    {
      state.student.name = action.payload.name
    },
    changeStudentImage:(state,action)=>
    {
      state.student.image = action.payload.image
    }
},
})

// Action creators are generated for each case reducer function
export const { loginStudent ,studentLogout,changeStudentName,changeStudentImage} = studentSlice.actions

export default studentSlice.reducer