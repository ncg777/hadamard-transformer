<template>
  <svg v-if="isPureDuple"
    :width="this.width"
    :height="this.height"
    :viewBox="'-2 -2 ' + (((this.rows+2)*this.cellSize).toFixed(4)+4)+ ' 104'"
    xmlns="http://www.w3.org/2000/svg"
  >
  <g v-for="(row, rowIndex) in hadamardArr" :key="rowIndex">
      <rect
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :x="colIndex * cellSize"
        :y="(rows-1-rowIndex) * cellSize"
        :width="cellSize"
        :height="cellSize"
        :fill="cell === 1 ? color(transformNorm[rowIndex],rowIndex) : 'black'"
        :stroke="0"
      />
      <text
      :key="'minus-' + rowIndex"
      :x="(rows+0.5)*cellSize"
      :y="(rowIndex * cellSize)+(cellSize/2.0)"
      :font-size="cellSize/2.0"
      :fill="'rgb(255,0,0)'"
      text-anchor="middle"
      dominant-baseline="middle" 
      @click="minus(rowIndex)">-</text>
      
      <text
      :key="'plus-' + rowIndex"
      :x="(rows+1.5)*cellSize"
      :y="(rowIndex * cellSize)+(cellSize/2.0)"
      :font-size="cellSize/2.0"
      :fill="'rgb(0,255,0)'"
      text-anchor="middle"
      dominant-baseline="middle" 
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
    minus(rowIndex) {
      const t = this.transform.splice(0);
      const c = this.cardinality;
      if(t[rowIndex] > -c) {
        t[rowIndex]--;
        this.hexString = ((new BinaryNatural(this.hadamard.transform(t).map(n => n >= 1 ? true : false))).toNatural(Name.Hexadecimal).toString());
        this.onHexStringChange();
      }
    },
    plus(rowIndex) {
      const t = this.transform.splice(0);
      const c = this.cardinality;
      if(t[rowIndex] < c) {
        t[rowIndex]++;
        this.hexString = ((new BinaryNatural(this.hadamard.transform(t).map(n => n >= 1 ? true : false))).toNatural(Name.Hexadecimal).toString());
        this.onHexStringChange();
      }
    },

    hexToBinary(hex) {
      return (new Natural(Name.Hexadecimal, hex)).toBinaryNatural().getBitSetAsNumberArray();
    },
    color(x, rowIndex) {
      const r = (x < 0 ? Math.abs(x) : 0)*255;
      const g = (x > 0 ? x : 0)*255;
      const b = 0*255;
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
