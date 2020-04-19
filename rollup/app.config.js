import commonjs from 'rollup-plugin-commonjs';
import css from 'rollup-plugin-css-bundle';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import vue from 'rollup-plugin-vue';

const plugins = [
  commonjs(),
  vue({
    css: false,
  }),
  css(),
  replace({
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    'process.env.VUE_ENV': '"browser"',
  }),
  resolve({
    extensions: ['.js', '.vue'],
  }),
];

if (process.env.NODE_ENV === 'production') {
  plugins.push(terser());
}

export default {
  input: 'src/app.js',
  output: {
    file: 'public/bundle.js',
    format: 'iife',
    sourcemap: false,
  },
  plugins,
};
