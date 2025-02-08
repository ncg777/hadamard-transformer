<template>
  <div style="text-align: center;">
    <v-btn @click="undo" :disabled="!canUndo">Undo</v-btn>
    <v-btn @click="invert" style="margin-left: 10px;">±</v-btn>
  </div>
  <div :style="'text-align:center;'">{{this.transform?.join(", ")}}</div>
  <svg v-if="isPureDuple"
    :width="this.width"
    :height="this.height"
    :viewBox="'-2 -2 ' + (((this.rows+1)*this.cellSize).toFixed(4)+4)+ ' 104'"
    xmlns="http://www.w3.org/2000/svg"
  >
  <g v-for="(row, rowIndex) in hadamardArr" :key="rowIndex">
      <rect
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :x="colIndex * cellSize"
        :y="rowIndex * cellSize"
        :width="cellSize*0.975"
        :height="cellSize*0.975"
        :fill="cell === 1 ? color(rowIndex,colIndex) : 'black'"
        :stroke="hadamard.get(rowIndex,colIndex) ==1 ? 'white' : 0"
        :stroke-width="cellSize/40"
        @click="swap(rowIndex,colIndex)"
      />
      <text
          v-for="(cell, colIndex) in row"
          :x="colIndex * cellSize + cellSize/2"
          :y="rowIndex * cellSize + cellSize/2"
          fill="white"
          :font-size="cellSize*0.8"
          font-family="sans-serif"
          text-anchor="middle"
          dominant-baseline="middle"
          @click="swap(rowIndex,colIndex)"
        >
          {{this.transform[Math.max(rowIndex,colIndex)] == 0 ? "" : this.transform[Math.max(rowIndex,colIndex)]}}
        </text>
    </g>
  </svg>
</template>

<script>
import { HadamardMatrix } from "../HadamardMatrix";
import { Natural } from "../Natural";
import { Name } from '../Cipher';
import { BinaryNatural } from "@/BinaryNatural";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";

export default {
  name: "RhythmHadamard",
  props: {
    value: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%" 
    },
  },
  data() {
    return {
      hexString: this.value,
      undoStack:[],
    };
  },
  computed: {
    hadamard() {
      const h = HadamardMatrix.getMatrix(Math.log2(this.rows));
      return h;
    },
    hadamardArr() {
      return this.hadamard.toArray()
    },
    transform() {
      return this.hadamard?.transform(this.hexToBinary(this.hexString), false);
    },
    transformNorm() {
      return this.transform.map(n => n/this.cardinality);
    },
    cardinality() {
      return (new Natural(Name.Hexadecimal, this.hexString)).toBinaryNatural().cardinality();
    },
    isPureDuple() {
      return Number.isInteger(Math.log2(this.rows));
    },
    cellSize() {
      return (100.0/this.rows);
    },
    rows() {
      return this.hexString.replace(/\s+/g,'').length*4;
    },
    canUndo() {
      return this.undoStack.length > 0;
    }
  },
  watch: {
    value(newValue) {
      this.hexString = newValue;
      this.onHexStringChange();
    },
  },
  methods: {
    onHexStringChange() {
      this.$emit("update:value", this.hexString);
    },
    saveState() {
      this.undoStack.push(this.hexString); // Push current state to the stack
    },
    undo() {
      if (this.canUndo) {
        this.hexString = this.undoStack.pop(); // Restore the last state from the stack
        this.onHexStringChange(); // Emit the change
      }
    },
    swap(rowIndex,colIndex) {
      if(rowIndex == colIndex) return;
      const t = this.transform.splice(0);
      const c = this.cardinality;
      if(t[rowIndex] > -c && t[colIndex] < c) {
        let o = this.hexString;
        while(t[rowIndex] > -c && t[colIndex] < c) {
          t[rowIndex]--;
          t[colIndex]++;
          o = ((new BinaryNatural(this.hadamard.transform(t,false).map(n => n >= 1.0 ? true : false))).reverse().toNatural(Name.Hexadecimal).toString());
          if(o != this.hexString) break;
        }
        if(this.hexString != o) {
          this.saveState();
          this.hexString = o;
          this.onHexStringChange();
        }
      }
    },
    invert() {
      if (!this.transform) return;
      
      // Save current state
      this.saveState();
      
      // Get current transform values
      const currentTransform = this.transform.slice();
      
      // Invert all values except the first component
      const invertedTransform = [this.rows-this.cardinality, ...currentTransform.slice(1).map(val => -1*val)];
      // Create new BinaryNatural from inverted transform
      const binaryNatural = 
        new BinaryNatural(
          this.hadamard
            .transform(invertedTransform,false).map(n => n >= 0.999 ? true : false));

      // Convert back to hex string
      this.hexString = binaryNatural.reverse().toNatural(Name.Hexadecimal).toString();
      
      // Emit the change
      this.onHexStringChange();
    },
    hexToBinary(hex) {
      return (new Natural(Name.Hexadecimal, hex)).toBinaryNatural().getBitSetAsNumberArray();
    },
    color(rowIndex,colIndex) {
      const i = Math.max(rowIndex, colIndex);
      const x = Math.cbrt(this.transformNorm[i]);
      const h = this.hadamard.get(rowIndex,colIndex) == 1 ? 1 : 0;
      const r = (x < 0 ? Math.abs(x) : 0)*255;
      const g = (x > 0 ? x : 0)*255;
      const b = 0;
      return `rgb(${r},${g},${b})`;
    }
  }
};
</script>

<style scoped>
svg {
  border: 1px solid black;
}
</style>
