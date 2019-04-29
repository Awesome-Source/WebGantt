declare interface Date {
        addDays(days: number): Date;
        isToday(): boolean;
        clone(): Date;
        isSameDate(date: Date): boolean;
}

Date.prototype.addDays = function (days: number): Date {
    let date = this;
    date.setDate(date.getDate() + days);

    return date;
};

Date.prototype.isToday = function (): boolean {
    let today = new Date();
    return this.isSameDate(today);
};

Date.prototype.clone = function (): Date {
    return new Date(this.getTime());
};

Date.prototype.isSameDate = function (date: Date): boolean {
    return date && this.getFullYear() === date.getFullYear() && this.getMonth() === date.getMonth() && this.getDate() === date.getDate();
};