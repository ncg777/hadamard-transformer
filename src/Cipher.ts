
export enum Name {
    Hexadecimal,
    Octal,
    Binary,
}


export class Cipher extends Array<string> {
    static Ciphers: Map<Name, Cipher> = new Map();

    static {
        const ARR_BINARY = ['0', '1'];
        const ARR_OCTAL = ['0', '1', '2', '3', '4', '5', '6', '7'];
        const ARR_HEXADECIMAL = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];

        Cipher.Ciphers.set(Name.Hexadecimal, new Cipher(ARR_HEXADECIMAL));
        Cipher.Ciphers.set(Name.Octal, new Cipher(ARR_OCTAL));
        Cipher.Ciphers.set(Name.Binary, new Cipher(ARR_BINARY));
    }

    constructor(characters: string[]) {
        super(...characters);
    }

    information(): number {
        return Math.log(this.length) / Math.log(2);
    }

    isInformationBinary(): boolean {
        return Math.pow(2, Math.round(this.information())) === this.length;
    }

    static getAlphabet(name: Name): Cipher | undefined {
        return Cipher.Ciphers.get(name);
    }

    equals(other: any): boolean {
        if (!(other instanceof Cipher)) return false;
        if (this.length !== other.length) return false;
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== other[i]) return false;
        }
        return true;
    }
}
