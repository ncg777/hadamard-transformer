<template>
  <div style="text-align: center;"><v-btn @click="undo" :disabled="!canUndo">Undo</v-btn></div>
  
  <svg v-if="isPureDuple"
    :width="this.width"
    :height="this.height"
    :viewBox="'-2 -2 ' + (((this.rows+4)*this.cellSize).toFixed(4)+4)+ ' 104'"
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
        :fill="cell === 1 ? color(Math.sqrt(transformNorm[rowIndex]),rowIndex,colIndex) : 'black'"
        :stroke="hadamard.get(rowIndex,colIndex) ==1 ? 'white' : 0"
        :stroke-width="cellSize/40"
      />
      <text v-if="rowIndex>0"
      :key="'minus-' + rowIndex"
      :x="(rows+0.5)*cellSize"
      :y="(rowIndex * cellSize)+(cellSize/2.0)"
      :font-size="cellSize"
      :fill="'rgb(255,0,0)'"
      text-anchor="middle"
      dominant-baseline="middle"
      style="cursor: pointer;"
      @click="minus(rowIndex)">-</text>
      <text v-if="rowIndex>0"
      :key="'zero-' + rowIndex"
      :x="(rows+1.5)*cellSize"
      :y="(rowIndex * cellSize)+(cellSize/2.0)"
      :font-size="cellSize"
      :fill="'rgb(255,255,0)'"
      text-anchor="middle"
      dominant-baseline="middle"
      style="cursor: pointer;"
      @click="zero(rowIndex)">0</text>
      <text v-if="rowIndex>0"
      :key="'plus-' + rowIndex"
      :x="(rows+2.5)*cellSize"
      :y="(rowIndex * cellSize)+(cellSize/2.0)"
      :font-size="cellSize"
      :fill="'rgb(0,255,0)'"
      text-anchor="middle"
      dominant-baseline="middle"
      style="cursor: pointer;"
      @click="plus(rowIndex)">+</text>
    </g>
  </svg>
</template>

<script>
import { HadamardMatrix } from "../HadamardMatrix";
import { Natural } from "../Natural";
import { Name } from '../Cipher';
import { BinaryNatural } from "@/BinaryNatural";

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
      return this.hadamard.transform(this.hexToBinary(this.hexString), false);
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
      return this.undoStack.length > 0; // Check if there's a saved previous state
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
    minus(rowIndex) {
      this.saveState();
      const t = this.transform.splice(0);
      const c = this.cardinality;
      if(t[rowIndex] > -c) {
        t[rowIndex]--;
        this.hexString = ((new BinaryNatural(this.hadamard.transform(t,false).map(n => n >= 1.0 ? true : false))).reverse().toNatural(Name.Hexadecimal).toString());
        this.onHexStringChange();
      }
    },
    zero(rowIndex) {
      this.saveState();
      const t = this.transform.splice(0);
      const c = this.cardinality;
      if(t[rowIndex] > 0 || t[rowIndex] < 0) {
        t[rowIndex] = 0;
        this.hexString = ((new BinaryNatural(this.hadamard.transform(t,false).map(n => n >= 1.0 ? true : false))).reverse().toNatural(Name.Hexadecimal).toString());
        this.onHexStringChange();
      }
    },
    plus(rowIndex) {
      this.saveState();
      const t = this.transform.splice(0);
      const c = this.cardinality;
      if(t[rowIndex] < c) {
        t[rowIndex]++;
        this.hexString = ((new BinaryNatural(this.hadamard.transform(t,false).map(n => n >= 1.0 ? true : false))).reverse().toNatural(Name.Hexadecimal).toString());
        this.onHexStringChange();
      }
    },

    hexToBinary(hex) {
      return (new Natural(Name.Hexadecimal, hex)).toBinaryNatural().getBitSetAsNumberArray();
    },
    color(_x, rowIndex,colIndex) {
      const x = _x;
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
