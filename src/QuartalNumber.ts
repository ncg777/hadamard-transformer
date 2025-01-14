import { Natural } from './Natural'; // Assume Natural is in a separate file
import { Cipher, Name } from './Cipher'; // Import Cipher
import { Sequence } from './Sequence';

export class QuartalNumber extends Natural {
    constructor(alphabetName: Name, array: string[]);
    constructor(alphabetName: Name, string: string);
    constructor(alphabetName: Name, list: string[]);
    constructor(alphabetName: Name, sequence: Sequence);
    constructor(natural: Natural);
    constructor(...args: any[]) {
        super(
            args[0] instanceof Natural ? args[0].getAlphabet() : args[0], 
            args[1] instanceof Sequence ? args[1].toArray().map(i => Cipher.getAlphabet(args[0])![i]) : args[1]);
        if (args[0] instanceof Natural && args[0].length !== 4) {
            throw new Error('Natural must have a length of 4');
        }
    }

    toString(insertSpace: boolean = false): string {
        let sb = '';
        sb += this[3];
        sb += this[2];
        if (insertSpace) sb += ' ';
        sb += this[1];
        sb += this[0];
        return sb;
    }
}