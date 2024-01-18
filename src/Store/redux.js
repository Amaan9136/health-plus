import { configureStore, createSlice } from "@reduxjs/toolkit";

// Initial state for chatBotSlice
const chatBotInitialState = { showBot: false };
const chatBotSlice = createSlice({
  name: 'chatBotSlice',
  initialState: chatBotInitialState,
  reducers: {
    handleShowBot(state) {
      state.showBot = !state.showBot;
    },
  },
});

// Initial state for modelSlice
const modelInitialState = { showViewModel: false };
const modelSlice = createSlice({
  name: 'modelSlice',
  initialState: modelInitialState,
  reducers: {
    handleViewModel(state) {
      state.showViewModel = !state.showViewModel;
    },
  },
});

// Configure the Redux store
const store = configureStore({
  reducer: {
    chatBotSlice: chatBotSlice.reducer,
    modelSlice: modelSlice.reducer,
  },
});

// Export actions
export const { handleShowBot } = chatBotSlice.actions;
export const { handleViewModel } = modelSlice.actions;

export default store;
