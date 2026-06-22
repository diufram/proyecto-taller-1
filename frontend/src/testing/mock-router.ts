export interface NavigationCall {
    commands: any[];
    extras?: any;
}

export class MockRouter {
    public navigations: NavigationCall[] = [];
    public urlValue = '/';

    get url(): string {
        return this.urlValue;
    }

    navigate(commands: any[], extras?: any): Promise<boolean> {
        this.navigations.push({ commands, extras });
        this.urlValue =
            typeof commands[0] === 'string' ? commands[0] : this.urlValue;
        return Promise.resolve(true);
    }
}