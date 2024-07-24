# Rollup - WASM

This repository contains three "packages":

C -> B -> A

A is a wasm-bindgen package that has `a_bg.wasm`.
B is a React component package that uses a custom plugin to emit `a_bg.wasm` into `lib/a_bg.wasm` while also emitting a `lib/worker.js` file.
C is also a React component package that uses `<B />` in it's `index.js`.

The issue is that when building package C using `npm run build` the resulting `lib` directory will not contain the `a_bg.wasm` file

```bash
./bin/setup.sh

cd ./packages/b
npm install
npm run build
cd -

cd ./packages/c
npm install
npm run build
cd -
```
If you `ls -la ./packages/c/node_modules/b/lib` you'll see that there is indeed a a_bg.wasm file present however if you `ls -la ./packages/c/lib` there is no wasm file which breaks the worker
