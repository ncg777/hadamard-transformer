<template>
  <svg v-if="isPureDuple"
    :width="this.width"
    :height="this.height"
    :viewBox="'-2 -2 104 104'"
    xmlns="http://www.w3.org/2000/svg"
  >
  <g v-for="(row, rowIndex) in hadamardArrSequency" :key="rowIndex">
      <rect
        v-for="(cell, colIndex) in row"
        :key="colIndex"
        :x="colIndex * cellSize"
        :y="(rows-1-rowIndex) * cellSize"
        :width="cellSize"
        :height="cellSize"
        :fill="cell === 1 ? color(transform[rowIndex],rowIndex) : 'black'"
        :stroke="0"
      />
    </g>
  </svg>
</template>

<script>
import { HadamardMatrix } from "../HadamardMatrix";
import { Natural } from "../Natural";
import { Name } from '../Cipher';

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
    hadamardArrSequency() {
      return this.hadamard.sortSequency().toArray()
    },
    transform() {
      return this.hadamard.transform(this.hexToBinary(this.hexString), true).map(n => n/this.cardinality);
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
      const bn = (new Natural(Name.Hexadecimal, this.hexString)).toBinaryNatural();
      const n = bn.size();
      return n;
    },
  },
  watch: {
    value(newValue) {
      this.hexString = newValue;
    },
  },
  methods: {
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
