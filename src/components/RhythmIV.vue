<template>
  <svg
    :width="this.width"
    :height="this.height"
    :viewBox="'-2 -2 ' + (2.0*this.cellSize+4) + ' 104'"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      v-for="(v, index) in spectrum"
      :key="index"
      :x="0"
      :y="(index * cellSize)"
      :width="cellSize*2"
      :height="cellSize"
      :stroke="'rgb('+ (255*(index/(spectrum.length-1)))+  ', 0, ' +  255*((spectrum.length-1-index)/(spectrum.length-1))+ ')'"
      :stroke-width="cellSize/20"
    />
    <text
      v-for="(v, index) in spectrum"
      :key="'specval-' + index"
      :x="1"
      :y="(index * cellSize)+(this.cellSize/2.0)"
      :font-size="cellSize/2.0"
      fill="white"
      text-anchor="start"
      dominant-baseline="middle">{{ (index+1).toString().padStart(2,'0')+ ": "+ this.spectrum[index].toFixed(0) }}</text>
  </svg>
</template>

<script>
import { BinaryNatural } from "../BinaryNatural";
import { Natural } from "../Natural";
import { Name } from '../Cipher';

export default {
  name: "RhythmIV",
  props: {
    value: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "5%"
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
    spectrum() {
      const bn = (new Natural(Name.Hexadecimal, this.hexString)).toBinaryNatural();
      const k = bn.cardinality();
      const max = k*(k-1)/2.0;
      return BinaryNatural.calcSpectrum(bn).toArray();
    },
    cellSize() {
      return (100.0/this.rows);
    },
    rows() {
      return this.spectrum.length;
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
  }
};
</script>

<style scoped>
svg {
  border: 1px solid black;
}
</style>
