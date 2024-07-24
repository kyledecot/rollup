use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct A {}

#[wasm_bindgen]
impl A {
    #[wasm_bindgen(constructor)]
    pub fn new() -> Self {
        Self {}
    }

    pub fn hello(&self) -> String {
        "Hello from A".to_string()
    }
}
