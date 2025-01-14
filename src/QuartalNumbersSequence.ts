import { QuartalNumber } from './QuartalNumber';
import { Cipher, Name } from './Cipher';
import { BinaryNatural } from './BinaryNatural';
import { Natural } from './Natural';
import { BitSet, Combination } from 'ultra-mega-enumerator';

class QuartalNumbersSequence extends Array<QuartalNumber> {
    private alphabetName: Name;

    constructor(alphabetName: Name);
    constructor(alphabetName: Name, string: string);
    constructor(alphabetName: Name, natural: Natural);
    constructor(alphabetName: Name, binaryNatural: BinaryNatural);
    constructor(...args: any[]) {
        super();
        this.alphabetName = args[0]; // Set alphabetName

        if (args.length === 2 && typeof args[1] === 'string') {
            const string = args[1].replace(/\s+/g, "");
            if (string.length % 4 !== 0) throw new Error("String length must be a multiple of 4.");
            for (let i = 0; i < string.length; i += 4) {
                const quartalNumber = new QuartalNumber(this.alphabetName, string.substring(i, i + 4));
                this.push(quartalNumber);
            }
        } else if (args.length === 2 && args[1] instanceof Natural) {
            this.push(new QuartalNumber(this.alphabetName, args[1].toString()));
        } else if (args.length === 2 && args[1] instanceof BinaryNatural) {
            this.push(new QuartalNumber(this.alphabetName, args[1].toNatural(this.alphabetName)));
        } else {
            // Handle other initialization cases
            this.alphabetName = args[0];
        }
    }

    toNatural(): Natural {
        return new Natural(this.alphabetName, this.toString().replace(/\s/g, ""));
    }

    toBinaryNatural(): BinaryNatural {
        return this.toNatural().toBinaryNatural();
    }

    toString(): string {
        return this.reverse().map(qn => qn.toString(true)).join(' ').trim();
    }

    static expand(a: QuartalNumbersSequence, x: number, fill: boolean): QuartalNumbersSequence {
        const b = a.toBinaryNatural();
        const o = new BinaryNatural(new BitSet(x * b.size()));

        for (let i = 0; i < b.size(); i++) {
            if (b.get(-1 + b.size() - i)) {
                o.set(-1 + o.size() - i * x);
                if (fill) {
                    for (let j = 1; j < x; j++) {
                        o.set(-1 + o.size() - ((i * x) + j));
                    }
                }
            }
        }

        return new QuartalNumbersSequence(a.alphabetName, o.reverse());
    }

    static rotate(r: QuartalNumbersSequence, t: number): QuartalNumbersSequence {
        return new QuartalNumbersSequence(r.alphabetName, new BinaryNatural(r.toBinaryNatural().rotate(t)).reverse());
    }

    static not(a: QuartalNumbersSequence): QuartalNumbersSequence {
        return new QuartalNumbersSequence(a.alphabetName, a.toBinaryNatural().invert());
    }

    static and(a: QuartalNumbersSequence, b: QuartalNumbersSequence): QuartalNumbersSequence {
        if (a.alphabetName !== b.alphabetName) throw new Error("Alphabets must match.");

        const n = Math.max(a.length, b.length);
        const output = new QuartalNumbersSequence(a.alphabetName);

        for (let i = 0; i < n; i++) {
            const quartalNumberA = a[i % a.length] || a[i % a.length];
            const quartalNumberB = b[i % b.length] || b[i % b.length];

            const intersected = new BinaryNatural(
                quartalNumberA.toBinaryNatural().intersection(quartalNumberB.toBinaryNatural())
            ).reverse().toNatural(a.alphabetName);
            output.push(new QuartalNumber(intersected));
        }
        return output;
    }

    static or(a: QuartalNumbersSequence, b: QuartalNumbersSequence): QuartalNumbersSequence {
        if (a.alphabetName !== b.alphabetName) throw new Error("Alphabets must match.");

        const n = Math.max(a.length, b.length);
        const output = new QuartalNumbersSequence(a.alphabetName);

        for (let i = 0; i < n; i++) {
            const quartalNumberA = a[i % a.length] || a[i % a.length];
            const quartalNumberB = b[i % b.length] || b[i % b.length];

            const merged = new BinaryNatural(
                quartalNumberA.toBinaryNatural().union(quartalNumberB.toBinaryNatural())
            ).reverse().toNatural(a.alphabetName);
            output.push(new QuartalNumber(merged));
        }
        return output;
    }

    static xor(a: QuartalNumbersSequence, b: QuartalNumbersSequence): QuartalNumbersSequence {
        if (a.alphabetName !== b.alphabetName) throw new Error("Alphabets must match.");

        const n = Math.max(a.length, b.length);
        const output = new QuartalNumbersSequence(a.alphabetName);

        for (let i = 0; i < n; i++) {
            const quartalNumberA = a[i % a.length] || a[i % a.length];
            const quartalNumberB = b[i % b.length] || b[i % b.length];
            let p = quartalNumberA.toBinaryNatural();
            p.xor(quartalNumberB.toBinaryNatural());
            
            output.push(new QuartalNumber(p.reverse().toNatural(a.alphabetName)));
        }
        return output;
    }

    static minus(a: QuartalNumbersSequence, b: QuartalNumbersSequence): QuartalNumbersSequence {
        if (a.alphabetName !== b.alphabetName) throw new Error("Alphabets must match.");

        const n = Math.max(a.length, b.length);
        const output = new QuartalNumbersSequence(a.alphabetName);

        for (let i = 0; i < n; i++) {
            const quartalNumberA = a[i % a.length] || a[i % a.length];
            const quartalNumberB = b[i % b.length] || b[i % b.length];

            const minusResult = new BinaryNatural(
                quartalNumberA.toBinaryNatural().minus(quartalNumberB.toBinaryNatural())
            ).reverse().toNatural(a.alphabetName);
            output.push(new QuartalNumber(minusResult));
        }
        return output;
    }

    static convolve(a: QuartalNumbersSequence, b: QuartalNumbersSequence): QuartalNumbersSequence {
        if (a.alphabetName !== b.alphabetName) throw new Error("Alphabets must match.");

        const carrier = a;
        const impulse = b;
        const bCarrier = carrier.toBinaryNatural().reverse();
        const bImpulse = impulse.toBinaryNatural().reverse();

        const o = new BinaryNatural(new BitSet(bCarrier.size()));

        for (let i = 0; i < bCarrier.size(); i++) {
            for (let j = 0; j < bImpulse.size(); j++) {
                o.set((i + j) % o.size(), o.get((i + j) % o.size()) || (bCarrier.get(i) && bImpulse.get(j)));
            }
        }

        return new QuartalNumbersSequence(a.alphabetName, o.reverse());
    }

    isEquivalentUnderSynchronizedRotation(other: QuartalNumbersSequence): boolean {
        if (this.alphabetName !== other.alphabetName) throw new Error("Alphabets must match.");

        if (this.length !== other.length) return false;

        for (let i = 0; i < this.length; i++) {
            const rotated = QuartalNumbersSequence.rotate(other, i * (4 * Math.round(Cipher.getAlphabet(this.alphabetName)!.information())));
            let eq = true;
            for (let j = 0; j < rotated.length; j++) {
                if (this[j].toString() !== rotated[j].toString()) {
                    eq = false;
                    break;
                }
            }
            if (eq) return true;
        }
        return false;
    }

    static fromCombination(alphabetName: Name, combination: Combination): QuartalNumbersSequence {
        const output = new QuartalNumbersSequence(alphabetName);
        const abc = Cipher.getAlphabet(alphabetName)!;

        if (!abc.isInformationBinary()) throw new Error("Alphabet must be binary.");

        const sz_t = Math.round(abc.information()) * 4;
        if (combination.size() % sz_t !== 0) {
            throw new Error("Rhythm's size is not divisible by " + sz_t);
        }

        let k = 0;
        while (k < combination.size()) {
            const t = new BinaryNatural(new BitSet(sz_t));
            for (let i = 0; i < sz_t; i++) {
                if (combination.get(k)) {
                    t.set(k % sz_t, true);
                }
                k++;
            }
            output.push(new QuartalNumber(t.toNatural(alphabetName)));
        }
        return output;
    }

    static fromRhythmList(alphabetName: Name, list: Combination[]): QuartalNumbersSequence[] {
        const output: QuartalNumbersSequence[] = [];
        for (const r of list) {
            output.push(QuartalNumbersSequence.fromCombination(alphabetName, r));
        }
        return output;
    }

    static clusterRhythmPartition(alphabetName: Name, partition: Combination[]): QuartalNumbersSequence[] {
        if (!partition) throw new Error("Partition cannot be null.");
        const quartalSequences = QuartalNumbersSequence.fromRhythmList(alphabetName, partition);

        if (quartalSequences.length === 1) {
            return [quartalSequences[0]];
        }

        const us = new QuartalNumbersSequenceUnionSet();
        for (const r of quartalSequences) {
            us.add(r);
        }

        const output: QuartalNumbersSequence[] = [];
        for (const treeSet of us.getTreeSets()) {
            let s: QuartalNumbersSequence | null = null;
            for (const l of treeSet) {
                if (!s) {
                    s = new QuartalNumbersSequence(l.alphabetName, l.toString());
                }
                s = QuartalNumbersSequence.or(s, l);
            }

            s && output.push(s);
        }

        return output.reverse();
    }

    compareTo(o: QuartalNumbersSequence): number {
        return this.toString().localeCompare(o.toString());
    }
}

// Helper class to manage unique representations under synchronized rotation
class QuartalNumbersSequenceUnionSet {
    private representants: QuartalNumbersSequence[] = [];
    private instances: Map<string, Set<QuartalNumbersSequence>> = new Map();

    add(item: QuartalNumbersSequence) {
        let found = false;
        for (const r of this.representants) {
            if (r.isEquivalentUnderSynchronizedRotation(item)) {
                found = true;
                if (!this.instances.has(r.toString())) {
                    this.instances.set(r.toString(), new Set());
                }
                this.instances.get(r.toString())!.add(item);
            }
        }
        if (!found) {
            this.instances.set(item.toString(), new Set([item]));
            this.representants.push(item);
        }
    }

    getTreeSets(): QuartalNumbersSequence[][] {
        return Array.from(this.instances.values()).map(set => Array.from(set));
    }
}