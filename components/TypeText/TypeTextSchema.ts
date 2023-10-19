// structure should look like this
/**
 * <MultiTextWrapper>
 *     <TypeTimer/> // the timer
 *     <MultiText> // allows for multiple typing texts
 *        <TextStateController/> // controls all of the typing text components
 *          <Text/> // the typing text component (each "paragraph")
 *     </MultiText>
 * </MultiTextWrapper>
 */


// shared
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

export interface TypedWord {
  word: string;
  correctWord: string;
  // lastMatchedIndex: number; // seems to be useless
  isActive: boolean;
}

export interface TextData {
  text: string;
  title: string;
}

// MultiTextContext.tsx
export interface MultiTextContextType {
    textIndex: number;
    numberOfTexts:number;
    typeStatistics: TypeStatistic[];
    startTyping: boolean;
    finishTyping: boolean;
    elapsedTimeInMS: number | null;
  }
  
export interface MultiTextContextAction {
    type: MultiTextContextActionTypes;
    typeStatistic?: TypeStatistic;
    numberOfTexts?: number;
    currentTextIndex?: number;
    elapsedTimeInMS?: number; // in milliseconds
}

// TextStateController.tsx
export const enum TextStateActionTypes {
  BACKSPACE,
  SPACE,
  ADD_LETTER
}

export interface TextState {
  typedWords: TypedWord[];
  wordIndex: number,
  lastCorrectWordIndex: number,
  activeWord: string;
}

export interface TextStateAction {
  type: TextStateActionTypes;
  newCharacter?: string;
}