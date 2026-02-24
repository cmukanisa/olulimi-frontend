export interface DictionaryEntry {
  id: string
  mashiWord: string
  frenchTranslation: string
  phonetic: string | null
  grammaticalCategory: string | null
  notes: string | null
  synonyms: string[]
  examples: DictionaryExample[]
}

export interface DictionaryExample {
  id: string
  mashiPhrase: string
  frenchTranslation: string
}
