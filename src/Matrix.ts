export class Matrix<T> {
    private mat: Map<string, T> = new Map();
    private m: number;
    private n: number;
    private defaultValue: T | null = null;

    constructor(arr: T[][]) {
        this.m = arr.length;
        this.n = arr[0].length;
        this.init(arr.length, arr[0].length, null);
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                this.set(i, j, arr[i][j]);
            }
        }
    }

    public columnCount(): number {
        return this.n;
    }

    public rowCount(): number {
        return this.m;
    }

    public apply(transform: (value: T) => T): void {
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                this.set(i, j, transform(this.get(i, j) as T));
            }
        }
    }
    public kronecker(other: Matrix<T>, productFn: (a: T, b: T) => T): Matrix<T> {
        const resultRows = this.rowCount() * other.rowCount();
        const resultCols = this.columnCount() * other.columnCount();
        const result = new Matrix<T>(Array.from({ length: resultRows }, () => Array(resultCols).fill(null as any)));
    
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                const valueA = this.get(i, j);
                for (let k = 0; k < other.rowCount(); k++) {
                    for (let l = 0; l < other.columnCount(); l++) {
                        const valueB = other.get(k, l);
                        const productValue = productFn(valueA!, valueB!);
                        result.set((i * other.rowCount()) + k, (j * other.columnCount()) + l, productValue);
                    }
                }
            }
        }
        return result;
    }
    public get(i: number, j: number): T | null {
        const key = `${i}:${j}`; // Create a unique key for each position
        return this.mat.get(key) ?? this.defaultValue; // Return default value if not found
    }

    public set(i: number, j: number, val: T): T | null {
        const key = `${i}:${j}`; // Create a unique key for each position
        const previousValue = this.get(i, j);
        if (this.isDefaultValue(val)) {
            this.mat.delete(key); // Remove entry if default value
        } else {
            this.mat.set(key, val); // Set new value
        }
        return previousValue;
    }

    private isDefaultValue(value: any): boolean {
        return value === null ? this.defaultValue === null : value === this.defaultValue;
    }

    private init(p_m: number, p_n: number, fill: T | null): void {
        this.m = p_m;
        this.n = p_n;
        if (fill !== null) {
            for (let i = 0; i < p_m; i++) {
                for (let j = 0; j < p_n; j++) {
                    this.set(i, j, fill);
                }
            }
        }
    }

    public toString(): string {
        let result = '';
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                result += this.get(i, j) !== null ? this.get(i, j)!.toString() : '∅';
                if (j < this.n - 1) {
                    result += ' ';
                }
            }
            result += '\n';
        }
        return result;
    }
    public product(other: Matrix<T>, initValue: T, sumFn: (a: T, b: T) => T, productFn: (a: T, b: T) => T): Matrix<T> {
        if (this.n !== other.m) {
            throw new Error("Matrix dimensions do not match for multiplication");
        }
        const result = new Matrix<T>(Array.from({ length: this.m }, () => Array(other.n).fill(initValue)));
        
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < other.n; j++) {
                let total = initValue;
                for (let k = 0; k < this.n; k++) {
                    total = sumFn(total, productFn(this.get(i, k) as T, other.get(k, j) as T));
                }
                result.set(i, j, total);
            }
        }
        return result;
    }

    public appendRow(row: T[]): void {
        this.insertRow(this.m, row);
    }

    public insertRow(i: number, row: T[]): void {
        if (row.length !== this.n && this.m !== 0) {
            throw new Error("Matrix::insertRow list size doesn't match matrix.");
        }
        this.shiftRowsDown(i);
        for (let j = 0; j < this.n; j++) {
            this.set(i, j, row[j]);
        }
    }

    public appendColumn(col: T[]): void {
        this.insertColumn(this.n, col);
    }

    public insertColumn(j: number, col: T[]): void {
        if (col.length !== this.m && this.n !== 0) {
            throw new Error("Matrix::insertColumn list size doesn't match matrix.");
        }
        this.shiftColumnsRight(j);
        for (let i = 0; i < this.m; i++) {
            this.set(i, j, col[i]);
        }
    }

    private shiftColumnsRight(j: number): void {
        this.n++;
        const newMat = new Map<string, T>();
        this.mat.forEach((value, key) => {
            const [i, oldJ] = key.split(':').map(Number);
            if (oldJ >= j) {
                newMat.set(`${i}:${oldJ + 1}`, value);
            } else {
                newMat.set(key, value);
            }
        });
        this.mat = newMat;
    }

    private shiftRowsDown(i: number): void {
        this.m++;
        const newMat = new Map<string, T>();
        this.mat.forEach((value, key) => {
            const [oldI, j] = key.split(':').map(Number);
            if (oldI >= i) {
                newMat.set(`${oldI + 1}:${j}`, value);
            } else {
                newMat.set(key, value);
            }
        });
        this.mat = newMat;
    }

    public getColumn(j: number): T[] {
        const column: T[] = [];
        for (let i = 0; i < this.m; i++) {
            column.push(this.get(i, j) as T);
        }
        return column;
    }

    public getRow(i: number): T[] {
        const row: T[] = [];
        for (let j = 0; j < this.n; j++) {
            row.push(this.get(i, j) as T);
        }
        return row;
    }

    public computeDeterminant(sumFn: (a: T, b: T) => T, productFn: (a: T, b: T) => T, negateFn: (v: T) => T): T {
        if (this.m !== this.n) {
            throw new Error("Matrix must be square to compute determinant.");
        }
        return this.computeDeterminantRecursive(this, sumFn, productFn, negateFn);
    }

    private computeDeterminantRecursive(matrix: Matrix<T>, sumFn: (a: T, b: T) => T, productFn: (a: T, b: T) => T, negateFn: (v: T) => T): T {
        const size = matrix.m;
        if (size === 1) {
            return matrix.get(0, 0) as T;
        }
        let determinant: T | null = null;
        for (let c = 0; c < size; c++) {
            const subMatrix = matrix.getSubMatrix(0, c);
            const subDeterminant = this.computeDeterminantRecursive(subMatrix, sumFn, productFn, negateFn);
            const cofactor = (c % 2 === 0) ? subDeterminant : negateFn(subDeterminant);
            const term = productFn(matrix.get(0, c) as T, cofactor);
            determinant = (determinant === null) ? term : sumFn(determinant, term);
        }
        return determinant as T;
    }

    public getSubMatrix(excludingRow: number, excludingCol: number): Matrix<T> {
        const subMatrix = new Matrix<T>(Array.from({ length: this.m - 1 }, () => Array(this.n - 1).fill(this.defaultValue as T)));
        for (let i = 0, subI = 0; i < this.m; i++) {
            if (i === excludingRow) continue;
            for (let j = 0, subJ = 0; j < this.n; j++) {
                if (j === excludingCol) continue;
                subMatrix.set(subI, subJ, this.get(i, j) as T);
                subJ++;
            }
            subI++;
        }
        return subMatrix;
    }
    public toArray(): T[][] {
        const array: T[][] = Array.from({ length: this.m }, () => Array(this.n).fill(this.defaultValue as T));
    
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                array[i][j] = this.get(i, j) as T; // Retrieve each value using `get` method
            }
        }
    
        return array;
    }

    public getTranspose(): Matrix<T> {
        // Create a new matrix with switched dimensions
        const transposedMatrix = new Matrix<T>(Array.from({ length: this.n }, () => Array(this.m).fill(this.defaultValue as T)));
    
        // Fill the transposed matrix with values from the original matrix
        for (let i = 0; i < this.m; i++) {
            for (let j = 0; j < this.n; j++) {
                transposedMatrix.set(j, i, this.get(i, j) as T); // Set transposed element
            }
        }
    
        return transposedMatrix; // Return the transposed matrix
    }
}