import { Cipher, Name } from './Cipher';
import { BinaryNatural } from './BinaryNatural';
import { Sequence } from './Sequence';
import { BitSet, Composition } from 'ultra-mega-enumerator'; 

export class Natural extends Array<string> {
    protected alphabetName: Name;

    constructor(alphabetName: Name);
    constructor(alphabetName: Name, array: string[]);
    constructor(alphabetName: Name, list: string[]);
    constructor(alphabetName: Name, string: string);
    constructor(alphabetName: Name, natural: Natural);
    constructor(alphabetName: Name, natural: BigInt, length: number);
    constructor(...args: any[]) {
        super(); // Initialize the base Array
        this.alphabetName = args[0]; // Set the alphabet name

        if (args.length === 1 && args[0] instanceof String) {
            const str = args[0] as string;
            for (let i = str.length - 1; i >= 0; i--) {
                this.push(str.charAt(i));
            }
        } else if (args.length === 2 && Array.isArray(args[1])) {
            for (const char of args[1]) {
                this.push(char);
            }
        } else if (args.length === 2 && args[1] instanceof Natural) {
            const natural = args[1] as Natural;
            this.alphabetName = natural.alphabetName;
            this.push(...natural);
        } else if (args.length === 3) {
            let natural = args[1] as bigint;
            let length = args[2] as number;
            const alphabet = Cipher.getAlphabet(this.alphabetName);
            const n = alphabet!.length;
            
            while (length-- > 0) {
                const r = natural%(BigInt(n));
                alphabet && alphabet[r as unknown as number] && this.push(alphabet[r as unknown as number]!.charAt(0));
                natural = (natural-r)/(BigInt(n));
            }
        }
    }

    getAlphabet(): Cipher {
        return Cipher.getAlphabet(this.alphabetName)!;
    }

    static log2OfBigInt(value: bigint): bigint {
        if (value <= 0n) throw new RangeError("Value must be positive.");
    
        let result: bigint = 0n;
    
        while (value > 1n) {
            value /= 2n;
            result += 1n;
        }
    
        return result;
    }
    
    toBinaryNatural(): BinaryNatural {
        const sz = Natural.log2OfBigInt(
            (BigInt(Cipher.getAlphabet(this.alphabetName)!.length)**BigInt(this.length))-1n
        ) as unknown as number;
        const b = new Natural(Name.Binary,this.toBigInteger(),sz);
        const bs = new BitSet(sz);
        for(let i=0;i<sz;i++) bs.set(i,b[i]=="1")
        return new BinaryNatural(bs);
    }

    toBigInteger(): BigInt {
        const alphabet = Cipher.getAlphabet(this.alphabetName)!;
        let sum = 0n;
        for (let k = 0; k < this.length; k++) {
            const p = BigInt(alphabet.length)**BigInt(k);
            sum +=BigInt(alphabet.indexOf(this[k]!))*p;
        }
        return sum;
    }

    getContour(): Sequence {
        const bn = this.toBinaryNatural();
        
        if (bn.cardinality() === 0) return new Sequence();
        return (new Sequence(...Composition.compositionFromCombination(bn).getCompositionAsArray().reverse()))
            .cyclicalDifference().signs();
    }

    getShadowContour(): Sequence {
        const combination = this.toBinaryNatural();
        if (combination.cardinality() === 0) return new Sequence();
        const a = Composition.compositionFromCombination(combination).getCompositionAsArray().reverse();
        const mid = new Sequence();
        for (let i = 1; i <= a.length; i++) {
            mid.add(a[i - 1] + a[i % a.length]);
        }
        return mid.cyclicalDifference().signs();
    }

    toBitstring(): string {
        return this.toBinaryNatural().toString();
    }

    static fromBitstring(alphabetName: Name, string: string): Natural {
        return BinaryNatural.fromBinaryString(string).toNatural(alphabetName);
    }

    static agglutinate(first: Natural, second: Natural): Natural {
        if (!first.getAlphabet().equals(second.getAlphabet())) throw new Error("Alphabets must match.");
        const result = new Natural(first.alphabetName, second);
        result.push(...first);
        return result;
    }

    static rotate(r: Natural, t: number): Natural {
        const result = new Natural(r.alphabetName,r);
        if (t < 0) {
            do {
                result.push(result.shift()!);
            } while (++t < 0);
        }
        if (t > 0) {
            do {
                result.unshift(result.pop()!);
            } while (--t > 0);
        }
        return result;
    }

    equals(other: any): boolean {
        if (!(other instanceof Natural)) return false;
        if (this.length !== other.length) return false;
        for (let i = 0; i < this.length; i++) {
            if (this[i] !== other[i]) return false;
        }
        return true;
    }

    static equivalentUnderRotation(a: Natural, b: Natural): boolean {
        if (a.length !== b.length) return false;
        for (let i = 0; i < a.length; i++) {
            if (a.equals(Natural.rotate(b, i))) {
                return true;
            }
        }
        return false;
    }
    public toString(): string {
        let sb = ''; // Using a string instead of StringBuilder

        // Append each element to the string
        for (const c of this) {
            sb += c.toString(); // assuming c is convertible to string
        }
        
        // Reverse the string
        return sb.split('').reverse().join('');
    }
}