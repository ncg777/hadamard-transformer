import { BitSet, Combination } from 'ultra-mega-enumerator';
import { Sequence } from './Sequence';
import { Name } from './Cipher';
import { Natural } from './Natural';

export class BinaryNatural extends Combination {
    constructor(size: number | BitSet | boolean[]) {
        if (typeof size === 'number') {
            super(size);
        } else if (size instanceof BitSet) {
            super(size.size());
            this.or(size);
        } else {
            super(size.length);
            (size as boolean[]).forEach((value, index) => this.set(index, value));
        }
    }

    static fromBinaryString(binaryString: string): BinaryNatural {
        const bits = binaryString.split('').map(char => char === '1');
        return new BinaryNatural(bits);
    }
    toBigInteger(): BigInt {
        const alphabet = Name.Binary
        let sum = 0n;
        for (let k = 0; k < this.size(); k++) {
            const p = BigInt(2)**BigInt(k);
            sum +=BigInt(this.get(k) ? 1 : 0)*p;
        }
        return sum;
    }
    
    toNatural(alphabetName: Name) {
        return new Natural(alphabetName, this.toBigInteger(), this.size());
    }

    toBinaryString(): string {
        let binaryString = '';
        for (let i = 0; i < this.n; i++) {
            binaryString += this.get(i) ? '1' : '0';
        }
        return binaryString.split('').reverse().join('');
    }

    reverse(): BinaryNatural {
        const newBitSet = new BitSet(this.n);
        for (let i = 0; i < this.n; i++) {
            newBitSet.set(i, this.get(this.n - 1 - i)!);
        }
        return new BinaryNatural(newBitSet);
    }

    scaleModulo(k: number, n: number): BinaryNatural {
        if (this.n % n !== 0) {
            throw new Error("n does not divide the length of the rhythm.");
        }

        const newBitSet = new BitSet(this.n);
        for (let i = 0; i < this.n; i++) {
            const index = (i * k) % n + n * Math.floor(i / n);
            newBitSet.set(i, this.get(index)!);
        }
        return new BinaryNatural(newBitSet);
    }

    static calcIntervalVector(input: boolean[], n: number): Sequence {
        const m = Math.floor(n / 2);
        const sequence = new Sequence();

        for (let i = 1; i <= m; i++) {
            let count = 0;
            for (let j = 0; j < n; j++) {
                if (input[j] && input[(i + j) % n]) {
                    count++;
                }
            }
            if (i === m && n % 2 === 0) {
                count = Math.floor(count / 2);
            }
            sequence.add(count);
        }
        return sequence;
    }

    static calcSpectrum(binaryNatural: BinaryNatural): Sequence {
        const input = new Array(binaryNatural.n);
        for (let i = 0; i < binaryNatural.n; i++) {
            input[i] = binaryNatural.get(i);
        }
        
        const intervalVector = BinaryNatural.calcIntervalVector(input, binaryNatural.n);
        const spectrumSequence = new Sequence();

        // Assuming we will store the number of intervals for each distance
        for (let i = 0; i < intervalVector.size(); i++) {
            spectrumSequence.add(intervalVector.get(i)!);
        }

        return spectrumSequence;
    }
    invert():BinaryNatural {
        var o = new BinaryNatural(this);
        for(let i=0;i<o.size();i++) o.set(i,!o.get(i));;
        return o;
    }
}