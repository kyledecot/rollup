// @ts-ignore
import init, { A } from "../../a/build/a.js";

// @ts-ignore
import wasm from "a_bg.wasm";

// @ts-ignore
init(wasm).then(() => {
  const a = new A();
  
  a.hello();
});
