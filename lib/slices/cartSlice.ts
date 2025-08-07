import { CartState } from "@/types/Cart";
import { createId } from "@/utils/id";
import { createSlice } from "@reduxjs/toolkit";

const initialState: CartState = {
  products: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action) => {
      state.products.push({
        ...action.payload,
        id: createId(),
      });
    },
    addToProduct: (state, action) => {
      state.products = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            amount: product.amount + 1,
          };
        }
        return product;
      })
    },
    minusFromProduct: (state, action) => {
      if (action.payload.amount === 1) {
        state.products = state.products.filter((product) => product.id !== action.payload.id);
        return;
      } else {
        state.products = state.products.map((product) => {
          if (product.id === action.payload.id) {
            return {
              ...product,
              amount: product.amount - 1,
            };
          }
          return product;
        })
      }
    },
    resetCart: () => {
      return initialState;
    },
  },
});

export const { addProduct, addToProduct, minusFromProduct, resetCart } = cartSlice.actions;
export default cartSlice.reducer;