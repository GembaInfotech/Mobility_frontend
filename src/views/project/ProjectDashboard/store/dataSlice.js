import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { apiGetProjectDashboardData } from 'services/ProjectService'
import { projectDashboardData } from "mock/data/projectData";
export const getProjectDashboardData = createAsyncThunk('projectDashboard/data/getProjectDashboardData',async () => {
    // const response = await apiGetProjectDashboardData()
    return  projectDashboardData
})


export const initialFilterData = {
    status: '',
}

const dataSlice = createSlice({
    name: 'projectDashboard/data',
    initialState: {
        loading: true,
        dashboardData: {},
    },
    reducers: {
    },
    extraReducers: {
        [getProjectDashboardData.fulfilled]: (state, action) => {
            state.dashboardData = action.payload
            state.loading = false
        },
        [getProjectDashboardData.pending]: (state) => {
            state.loading = true
        }
    }
})

export default dataSlice.reducer
