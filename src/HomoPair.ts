export class HomoPair<T> {
    public readonly first: T;
    public readonly second: T;

    private constructor(first: T, second: T) {
        this.first = first;
        this.second = second;
    }

    public static makeHomoPair<T>(first: T, second: T): HomoPair<T> {
        return new HomoPair(first, second);
    }
}
