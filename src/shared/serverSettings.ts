export const DoceboSandbox = (isBeta: boolean): IDoceboAPIServerSettings => {
    return {
        doceboHost: 'wabco-academy-onlinesandbox.docebosaas.com',
        serverType: DoceboAPIServerType.SANDBOX,
    };
};

export const DoceboProduction = (isBeta: boolean): IDoceboAPIServerSettings => {
    return {
        doceboHost: 'elearning.proacademy.zf.com',
        serverType: DoceboAPIServerType.PRODUCTION,
    };
};

export interface IDoceboAPIServerSettings {
    doceboHost: string;
    serverType: DoceboAPIServerType;
}

export enum DoceboAPIServerType {
    SANDBOX,
    PRODUCTION,
}

export const getServerSettings = (
    serverType: DoceboAPIServerType,
    isBeta: boolean = false
): IDoceboAPIServerSettings => {
    switch (serverType) {
        case DoceboAPIServerType.PRODUCTION:
            return DoceboProduction(isBeta);
        default:
            return DoceboSandbox(isBeta);
    }
};
