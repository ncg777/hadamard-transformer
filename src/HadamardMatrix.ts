import { Matrix } from './Matrix';
import { Sequence } from './Sequence';

export class HadamardMatrix extends Matrix<number> {
    private static h1_arr: number[][] = [[1, 1], [1, -1]];
    private static mats: HadamardMatrix[] = [new HadamardMatrix()];

    public static getMatrix(order: number): HadamardMatrix {
        if (order < 1) throw new Error("Order must be at least 1");
        
        const currentSize = HadamardMatrix.mats.length; 
        let size = currentSize;

        while (size < order) {
            const newMatrix = HadamardMatrix.mats[0].kronecker(HadamardMatrix.mats[size - 1], (a,b) => a*b);
            HadamardMatrix.mats.push(new HadamardMatrix(newMatrix));
            size++;
        }

        return HadamardMatrix.mats[order - 1];
    }

     public constructor();
     public constructor(mat: Matrix<number>);
     constructor(mat?: Matrix<number>) {
         if (mat) {
             super(mat.toArray());
         } else {
             super(HadamardMatrix.h1_arr);
         }
     }

    public expand(): HadamardMatrix {
        const expandedMatrix = (new HadamardMatrix()).kronecker(this, (a,b) => a*b);
        return new HadamardMatrix(expandedMatrix);
    }

    public sortSequence(): Matrix<number> {
        const rowsMap: Map<number, number[]> = new Map();
        
        for (let i = 0; i < this.rowCount(); i++) {
            const sequence = new Sequence(...this.getRow(i));
            const key = new Sequence(...sequence.difference().toArray().map((n) => n === 0 ? 0 : 1)).sum();
            rowsMap.set(key, this.getRow(i));
        }

        const sortedMatrix = new Matrix<number>(Array.from(rowsMap.values()));
        return sortedMatrix;
    }

    public getOrder(): number {
        return Math.round(Math.log2(this.columnCount()));
    }
}