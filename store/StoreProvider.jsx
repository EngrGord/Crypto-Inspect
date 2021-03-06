import React, { createContext, useEffect, useReducer } from "react";
import { useAccount } from "wagmi";

const initialState = { address: "", searchedAddress: "" };

const state = [initialState];

export const StoreContext = createContext([...state]);

// global reducer state that can override the properties with payload
const Reducer = (state, action) => {
  return { ...state, ...action.payload };
};

const StoreProvider = ({ children }) => {
  const [state, dispatch] = useReducer(Reducer, initialState);
  const { data, isSuccess, isError } = useAccount();

  /**----------------------
   * NOTE: from dispatch send data as payload to override the state
   * eg: dispatch({ payload: { address: "0xasfasfs" } }
   * to access the state use   const [state, dispatch] = useStore(); in component
   * ---------------------*/
  useEffect(() => {
    if (isSuccess && data !== null) {
      dispatch({ payload: { address: data.address } });
    }
  }, [isSuccess, data?.address]);

  return <StoreContext.Provider value={[state, dispatch]}>{children}</StoreContext.Provider>;
};

export default StoreProvider;