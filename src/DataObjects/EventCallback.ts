class EventCallback<T>{
    public Owner: any;
    public Callback: (value: T) => void;

    constructor(owner: any, callback: (value: T) => void) {
        this.Owner = owner;
        this.Callback = callback;
    }
}