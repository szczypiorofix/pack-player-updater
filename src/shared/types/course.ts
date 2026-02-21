export interface ICourseNameLang {
    short: string;
    ver: string;
    name: string;
    dir: string;
    build: number;
    link: string;
    host: string;
    path: string;
    fileTitle: string;
    fileId: number;
}

export interface ICourseNames {
    id: number;
    name: string;
    lang: ICourseNameLang;
}
