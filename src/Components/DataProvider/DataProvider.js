import React, { createContext, useReducer } from "react";

// Create Context
export const DataContext = createContext();

// DataProvider Component
export const DataProvider = ({ children, reducer, initialState }) => {
  return (
    <DataContext.Provider value={useReducer(reducer, initialState)}>
      {children}
    </DataContext.Provider>
  );
};
