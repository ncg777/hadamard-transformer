<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-text-field
          v-model="hexString"
          label="Enter Rhythm (Hexadecimal)"
          outlined
          @input="onHexStringChange"
        />
      </v-col>
    </v-row>
    <v-row justify="center">
      <svg
        :width="this.width"
        :height="this.height"
        :viewBox="'0 0 100 ' +(100.0/this.columns)"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Draw grid -->
        <rect
          v-for="(active, index) in rhythmArray"
          :key="index"
          :x="(index * cellSize)"
          :y="0"
          :width="cellSize"
          :height="cellSize"
          :fill="active ? 'green' : 'lightgray'"
          @click="toggleCell(index)"
          stroke="black"
        />
        <!-- Draw midpoints -->
        <circle
          v-for="(mid, index) in midPoints"
          :key="'mid-' + index"
          :cx="mid.x"
          :cy="mid.y"
          r="2%"
          fill="yellow"
        />
        <!-- Draw contour values -->
        <text
          v-for="(index, i) in combArr"
          :key="'note-' + index"
          :x="(index * cellSize)+this.cellSize/2.0"
          :y="this.cellSize/2.0"
          font-size="1"
          fill="black"
          text-anchor="middle"
          dominant-baseline="middle">{{this.contour[i]}}</text>
        <!-- Draw shadow contour values -->
        <text
          v-for="(mid, index) in midPoints"
          :key="'shadow-' + index"
          :x="mid.x"
          :y="this.cellSize/2.0"
          font-size="1"
          fill="black"
          text-anchor="middle"
          dominant-baseline="middle"
        >{{this.shadowContour[index]}}</text>
      </svg>
    </v-row>
  </v-container>
</template>

<script>
import { BinaryNatural } from "../BinaryNatural";
import { Natural } from "../Natural";
import { Cipher, Name } from '../Cipher';
import { Composition } from 'ultra-mega-enumerator';

export default {
  name: "RhythmVisualizer",
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "5%" 
    },
  },
  data() {
    return {
      hexString: this.modelValue,
    };
  },
  computed: {
    rhythmArray() {
      return this.hexToBinary(this.hexString);
    },
    cellSize() {
      return (100.0/this.columns);
    },
    columns() {
      return this.rhythmArray.length;
    },
    contour() {
      return (new Natural(Name.Hexadecimal,this.hexString)).getContour().toArray();
    },
    shadowContour() {
      return (new Natural(Name.Hexadecimal,this.hexString)).getShadowContour().toArray();
    },
    comb() {
      return new BinaryNatural(this.rhythmArray);
    },
    combArr() { 
      return this.comb.getCombinationAsArray();
    },
    comp() {
      return Composition.compositionFromCombination(this.comb).getCompositionAsArray();
    },
    midPoints() {
      const points = [];
      for(let i=0; i< this.combArr.length;i++) {
        let x = (this.combArr[i]+(this.comp[i]/2.0));
        if(x >= this.columns) x -= this.columns;
        x = (100.0*x/this.columns);
        points.push({
            x: x,
            y: this.cellSize/2.0,
          });
      }
      
      return points;
    },
    contourValues() {
      // Returns contour values at each note position
      return this.rhythmArray.map((active, index) => {
        const x = (index % this.columns) * this.cellSize + this.cellSize / 2;
        const y = Math.floor(index / this.columns) * this.cellSize + this.cellSize / 2;
        return { x, y, value: active ? this.contour[index] : "" };
      });
    },
    shadowContourValues() {
      return this.midPoints.map((mid, index) => ({
        x: mid.x,
        y: mid.y,
        value: this.shadowContour[index],
      }));
    },
  },
  watch: {
    modelValue(newValue) {
      this.hexString = newValue;
      this.onHexStringChange();
    },
  },
  methods: {
    onHexStringChange() {
      this.$emit("update:modelValue", this.hexString);
    },
    hexToBinary(hex) {
      return (new Natural(Name.Hexadecimal, hex)).toBinaryNatural().getBitSetAsNumberArray();
    },
    toggleCell(index) {
      const ra = this.rhythmArray;

      ra[index] = 1 - this.rhythmArray[index];
      this.hexString = (new BinaryNatural(ra).reverse()).toNatural(Name.Hexadecimal).toString();
      this.$emit("update:modelValue", this.hexString);
    },
    binaryToHex(binaryArray) {
      const binaryString = binaryArray.join("");
      return Array.from(
        { length: binaryString.length / 4 },
        (_, i) =>
          parseInt(binaryString.slice(i * 4, i * 4 + 4), 2).toString(16)
      ).join("");
    }
  }
};
</script>

<style scoped>
svg {
  border: 1px solid black;
}
</style>
