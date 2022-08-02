import React, { createContext, useContext, useState } from 'react';

// @ts-ignore
const ActiveAnchorContext = createContext();
// @ts-ignore
const ActiveAnchorSetterContext = createContext();

// Separate the state as 2 contexts here to avoid
// re-renders of the content triggered by the state update.
export const useActiveAnchor = () => useContext(ActiveAnchorContext);
export const useActiveAnchorSet = () => useContext(ActiveAnchorSetterContext);
export const ActiveAnchor = ({ children }) => {
    const state = useState({});

    return (
        <ActiveAnchorContext.Provider value={state.at(0)}>
            <ActiveAnchorSetterContext.Provider value={state.at(1)}>
                {children}
            </ActiveAnchorSetterContext.Provider>
        </ActiveAnchorContext.Provider>
    );
};
