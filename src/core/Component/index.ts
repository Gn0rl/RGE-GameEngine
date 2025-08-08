export class Component {
    public name: string;
    public isEnabled: boolean;

    constructor(name: string) {
        this.isEnabled = true
        this.name = name
    }

    start(): void {}

    update(): void {}
}