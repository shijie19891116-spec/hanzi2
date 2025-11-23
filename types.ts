export interface CharacterData {
  char: string;
  pinyin: string;
  definition: string;
  example: string;
  exampleTranslation: string;
}

export interface HanziWriterContextType {
  animate: () => void;
  quiz: () => void;
}