// Webpack loader settings for loading SCSS file as a modules
declare module '*.scss' {
    const scss: {
        [k: string]: string;
    };
    export = scss;
}

declare module '*.css' {
    const css: {
        [k: string]: string;
    };
    export = css;
}

declare module '*.png' {
    export default '' as string;
}

declare module '*.svg' {
    const content: any;
    export default content;
}
