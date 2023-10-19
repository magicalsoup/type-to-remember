import { Dispatch, createContext, useContext, useReducer } from "react";
import {
  MultiTextContextType,
  MultiTextContextAction,
  MultiTextContextActionTypes,
  TypeStatistic,
} from "./TypeTextSchema";

const initialState: MultiTextContextType = {
  textIndex: 0,
  typeStatistics: [],
  numberOfTexts: 0,
  startTyping: false,
  finishTyping: false,
  elapsedTimeInMS: null,
};

const MultiTextContext = createContext<MultiTextContextType>(initialState);
const MultiTextDispatchContext = createContext<
  Dispatch<MultiTextContextAction>
>({} as Dispatch<MultiTextContextAction>);

export function MultiTextProvider({ children }: { children: React.ReactNode }) {
  const [multiTextState, dispatch] = useReducer(MultiTextReducer, initialState);
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
  oldMultiTextState: MultiTextContextType,
  action: MultiTextContextAction
) {
  switch (action.type) {
    case MultiTextContextActionTypes.UPDATE_TYPE_STATISTICS: {
      if (action.typeStatistic === undefined) {
        return oldMultiTextState;
      }
      if (oldMultiTextState.textIndex >= oldMultiTextState.numberOfTexts) {
        // out of index bound guard
        return oldMultiTextState;
      }
      let newTypeStatistics = oldMultiTextState.typeStatistics;
      newTypeStatistics[oldMultiTextState.textIndex] = action.typeStatistic;
      return {
        ...oldMultiTextState,
        typeStatistics: newTypeStatistics,
      };
    }
    case MultiTextContextActionTypes.NEXT_TEXT: {
      const currentTextIndex = action.currentTextIndex;
      if (currentTextIndex === undefined) {
        return oldMultiTextState;
      }
      return {
        ...oldMultiTextState,
        textIndex: currentTextIndex + 1,
      };
    }
    case MultiTextContextActionTypes.INITIALIZE: {
      if (action.numberOfTexts === undefined) {
        return oldMultiTextState;
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
        ...oldMultiTextState,
        startTyping: true,
        finishTyping: false,
        elapsedTimeInMS: null,
      };
    }
    case MultiTextContextActionTypes.END: {
      if (action.elapsedTimeInMS === undefined) {
        return oldMultiTextState;
      }
      return {
        ...oldMultiTextState,
        startTyping: true,
        finishTyping: true,
        elapsedTimeInMS: action.elapsedTimeInMS,
      };
    }
    default: {
      throw new Error("Unknown action " + action.type);
    }
  }
}
