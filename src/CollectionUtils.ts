import { Sequence } from './Sequence';

export class CollectionUtils {
    static randomDouble(min: number, max: number): number {
        return Math.random() * (max - min) + min; // Generate a random double in the range [min, max]
    }
    static getPermutationFromDisjointCycles(cs: Array<Array<number>>): number[] {
        const t = new Set<number>();
        let sz = 0;
        for (const c of cs) {
            sz += c.length;
            c.forEach(item => t.add(item));
        }
        if (sz !== t.size || Math.min(...t) !== 0 || Math.max(...t) !== sz - 1) {
            throw new Error("Invalid argument for getPermutationFromDisjointCycles.");
        }
        const o: number[] = new Array(sz);
        for (const c of cs) {
            for (let i = 0; i < c.length; i++) {
                o[c[i]] = c[(i + 1) % c.length];
            }
        }
        return o;
    }

    static getPermutationFunction(permutation: number[]): (i: number) => number {
        return (i: number) => permutation[i];
    }
    static gcd(a: number, b: number): number {
        // Ensure non-negative integers for GCD
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }
    // Method to compute the LCM of two numbers
    static lcm(a: number, b: number): number {
        if (a === 0 || b === 0) return 0; // LCM of zero with any number is zero
        return Math.abs((a * b) / this.gcd(a, b));
    }
    static getPermutationOrder(permutation: number[]): number {
        const cs = this.getPermutationAsDisjointCycles(permutation);
        let o: number | null = null;
        for (const s of cs) {
            if (o === null) {
                o = s.size();
            } else {
                o = this.lcm(o, s.size());
            }
        }
        return o as number; // Ensure type is number
    }

    static getPermutationAsDisjointCycles(permutation: number[]): Set<Sequence> {
        const o = new Set<Sequence>();
        let s = new Sequence(...permutation);
        const f = this.getPermutationFunction(permutation);

        while (s.size() > 0) {
            const c = new Sequence();
            const initial = s.get(0);
            let current = initial!;
            do {
                c.add(current);
                current = f(current);
            } while (current !== initial);
            s = new Sequence(...(s.toArray().filter((z) => !c.toArray().includes(z))));
            // s.removeAll(c);
            o.add(c);
        }
        return o;
    }

    static rotate<T>(arr: T[], n: number): T[] {
        const c = [...arr];
        const m = n % c.length;
        return [...c.slice(-m), ...c.slice(0, -m)];
    }

    static countKins<T>(k: T, a: T[]): number {
        return a.filter(item => item === k).length;
    }

    static arrayEquals<T>(a: T[], b: T[]): boolean {
        if (a.length !== b.length) return false;
        return a.every((val, index) => val === b[index]);
    }
}