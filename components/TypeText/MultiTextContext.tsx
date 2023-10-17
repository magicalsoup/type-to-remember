import { Dispatch, createContext, useContext, useReducer } from "react";

interface MultiTextContextType {
    textIndex: number;
}

interface MultiTextContextAction {
    type: string;
    prevTextIndex: number;
}

const MultiTextContext = createContext<MultiTextContextType >({textIndex:0});
const MultiTextDispatchContext = createContext<Dispatch<MultiTextContextAction>>({} as Dispatch<MultiTextContextAction>);

export function MultiTextProvider({children} : {children: React.ReactNode}) {
    const [multiTextState, dispatch] = useReducer(
        MultiTextReducer,
        {
            textIndex: 0,
        }
    )
    return <MultiTextContext.Provider value={multiTextState}>
        <MultiTextDispatchContext.Provider value={dispatch}>
            {children}
        </MultiTextDispatchContext.Provider>
    </MultiTextContext.Provider>
}

export function useMultiTextState() {
    const multiTextContext = useContext(MultiTextContext);
    if (!multiTextContext) {
        throw new Error (
            "useMultiTextState has to be used within <MultiTextContext.Provider>"
        )
    }
    return multiTextContext;
}

export function useMultiTextDispatch() {
    const multiTextDispatch = useContext(MultiTextDispatchContext);
    if (!multiTextDispatch) {
        throw new Error (
            "useMultiTextDispatch has to be used within <MultiTextDispatchContext.Provider>"
        )
    }
    return multiTextDispatch;
}


function MultiTextReducer(multiTextState: MultiTextContextType, action: MultiTextContextAction) {
    const prevTextIndex = action.prevTextIndex;
    switch(action.type) {
        case "done": {
            return {
                textIndex: prevTextIndex + 1
            }
        }
        default: {
            throw new Error("Unknown action " + action.type);
        }
    }
}

