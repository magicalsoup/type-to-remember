import { Dispatch, createContext, useContext, useReducer } from "react";

export enum MultiTextContextActionTypes {
    UPDATE_TYPE_STATISTICS,
    NEXT_TEXT,
    INITIALIZE,
    START,
    END,
}

export interface TypeStatistic {
  correctWordsTyped: number;
  attemptedWordsTyped: number;
}

interface MultiTextContextType {
  textIndex: number;
  numberOfTexts:number;
  typeStatistics: TypeStatistic[];
  startTyping: boolean;
  finishTyping: boolean;
  elapsedTimeInMS: number | null;
}

interface MultiTextContextAction {
  type: MultiTextContextActionTypes;
  typeStatistic?: TypeStatistic;
  numberOfTexts?: number;
  currentTextIndex?: number;
  elapsedTimeInMS?: number; // in milliseconds
}

const initialState: MultiTextContextType = {
    textIndex: 0,
    typeStatistics: [],
    numberOfTexts: 0,
    startTyping: false,
    finishTyping: false,
    elapsedTimeInMS: null,
}

const MultiTextContext = createContext<MultiTextContextType>(initialState);
const MultiTextDispatchContext = createContext<
  Dispatch<MultiTextContextAction>
>({} as Dispatch<MultiTextContextAction>);

export function MultiTextProvider({ children }: { children: React.ReactNode }) {
  const [multiTextState, dispatch] = useReducer(
    MultiTextReducer,
    initialState
  );
  return (
    <MultiTextContext.Provider value={multiTextState}>
      <MultiTextDispatchContext.Provider value={dispatch}>
        {children}
      </MultiTextDispatchContext.Provider>
    </MultiTextContext.Provider>
  );
}

export function useMultiTextState() {
  const multiTextContext = useContext(MultiTextContext);
  if (!multiTextContext) {
    throw new Error(
      "useMultiTextState has to be used within <MultiTextContext.Provider>"
    );
  }
  return multiTextContext;
}

export function useMultiTextDispatch() {
  const multiTextDispatch = useContext(MultiTextDispatchContext);
  if (!multiTextDispatch) {
    throw new Error(
      "useMultiTextDispatch has to be used within <MultiTextDispatchContext.Provider>"
    );
  }
  return multiTextDispatch;
}


function MultiTextReducer(
  multiTextState: MultiTextContextType,
  action: MultiTextContextAction
) {
  const currentTextIndex = action.currentTextIndex;
  switch (action.type) {
    case MultiTextContextActionTypes.UPDATE_TYPE_STATISTICS: {
        console.log("[type statistic]", action.typeStatistic);
        if (action.typeStatistic === undefined) {
            return multiTextState;
        }
        const textIndex = multiTextState.textIndex;
        console.log("[type statistic]", currentTextIndex, action.typeStatistic);
        let newTypeStatistics = multiTextState.typeStatistics;
        newTypeStatistics[textIndex] = action.typeStatistic;
        return {
            ...multiTextState,
            textIndex: textIndex,
            typeStatistics: newTypeStatistics,
        };
    }
    case MultiTextContextActionTypes.NEXT_TEXT: { 
      if (currentTextIndex === undefined) {
        return multiTextState;
      }
      return {
        ...multiTextState,
        textIndex: currentTextIndex + 1,
        finishTyping: currentTextIndex + 1 >= multiTextState.numberOfTexts,
      };
    }
    case MultiTextContextActionTypes.INITIALIZE: {
      if (action.numberOfTexts === undefined) {
        return multiTextState;
      }
      let typeStats: TypeStatistic[] = [];
      for (let i = 0; i < action.numberOfTexts; i++) {
        typeStats.push({
          correctWordsTyped: 0,
          attemptedWordsTyped: 0,
        });
      }
      return {
        textIndex: 0,
        typeStatistics: typeStats,
        numberOfTexts: action.numberOfTexts,
        startTyping: false,
        finishTyping: false,
        elapsedTimeInMS: null,
      };
    }
    case MultiTextContextActionTypes.START: {
      return {
        ...multiTextState,
        startTyping: true,
        finishTyping: false,
        elapsedTimeInMS: null,
      };
    }
    case MultiTextContextActionTypes.END: {
        if (action.elapsedTimeInMS === undefined) {
            return multiTextState;
        }
        return {
            ...multiTextState, 
            startTyping: true,
            finishTyping: true,
            elapsedTimeInMS: action.elapsedTimeInMS, 
        }
    }
    default: {
      throw new Error("Unknown action " + action.type);
    }
  }
}
