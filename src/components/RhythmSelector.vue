<template>
    <v-row>
      <v-col cols="12" md="12">
        <v-text-field
          v-model="hexString"
          label="Rhythm (Hexadecimal)"
          outlined
          @input="onHexStringChange"
        />
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" :style="'margin:0;padding:0; padding-top:5vh; padding-bottom:5vh; max-width: 100%; witdh:100%; overflow-x: auto;'">
        <svg
          :width="(6+(94*this.columns/16))+'%'"
          :height="(this.cellSize) + 'vw'"
          :viewBox="'-3 0 '+ (6+(100*this.columns/16)) +  ' ' +(this.cellSize)"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            v-for="(active, index) in rhythmArray"
            :key="index"
            :x="(index * cellSize)"
            :y="0"
            :width="0.9*cellSize"
            :height="0.9*cellSize"
            :fill="active ? 'white' : 'black'"
            @click="toggleCell(index)"
            :stroke="index%16==0?'gold':'lightgrey'"
            :stroke-width="cellSize/10"
          />
          <circle
            v-for="(mid, index) in midPoints"
            :key="'mid-' + index"
            :cx="mid.x-0.05*this.cellSize"
            :cy="mid.y-0.05*this.cellSize"
            :r="cellSize/3"
            fill="darkgrey"
            @click="toggleCell(index)"
          />
          <text
            v-for="(index, i) in combArr"
            :key="'note-' + index"
            :x="(index * cellSize)+this.cellSize/2.0"
            :y="this.cellSize/2.0"
            :font-size="0.5*cellSize"
            @click="toggleCell(index)"
            fill="black"
            text-anchor="middle"
            dominant-baseline="middle">{{this.contour[i]}}</text>
          <text
            v-for="(mid, index) in midPoints"
            :key="'shadow-' + index"
            :x="mid.x-0.05*this.cellSize"
            :y="mid.y"
            :font-size="0.5*cellSize"
            fill="white"
            text-anchor="middle"
            dominant-baseline="middle"
            @click="toggleCell(index)"
          >{{this.shadowContour[index]}}</text>
        </svg>
      </v-col>
    </v-row>
</template>

<script>
import { BinaryNatural } from "../BinaryNatural";
import { Natural } from "../Natural";
import { Cipher, Name } from '../Cipher';
import { Composition } from 'ultra-mega-enumerator';

export default {
  name: "RhythmVisualizer",
  props: {
    value: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      hexString: this.value,
    };
  },
  computed: {
    rhythmArray() {
      return this.hexToBinary(this.hexString);
    },
    cellSize() {
      return (100.0/16);
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
      const f = this.columns/16;
      for(let i=0; i< this.combArr.length;i++) {
        let x = (this.combArr[i]+(this.comp[i]/2.0))+0.5;
        if(x >= this.columns) x -= this.columns;
        x = (100.0*x/this.columns);
        points.push({
            x: x*f,
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
    value(newValue) {
      this.hexString = newValue;
      this.onHexStringChange();
    },
  },
  methods: {
    onHexStringChange() {
      this.$emit("update:value", this.hexString);
    },
    hexToBinary(hex) {
      return (new Natural(Name.Hexadecimal, hex)).toBinaryNatural().getBitSetAsNumberArray();
    },
    toggleCell(index) {
      const ra = this.rhythmArray;

      ra[index] = 1 - this.rhythmArray[index];
      this.hexString = (new BinaryNatural(ra).reverse()).toNatural(Name.Hexadecimal).toString();
      this.onHexStringChange();
    },
  }
};
</script>

<style scoped>
svg {
  border: 1px solid black;
  position: relative;
}
</style>
