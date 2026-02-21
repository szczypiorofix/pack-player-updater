export interface IPresentationSlideTitleTranslation {
    courseId: number;
    languageDir: string;
    lang: string;
    langFull: string;
    presentationName: string;
    version: string;
    updateDate: number;
    lastId: number;
    items: IPresentationSlideTitleTranslationItem[];
}

export interface IPresentationSlideTitleTranslationItem {
    id: number;
    catId: number;
    name: string;
    translatedName: string;
}
