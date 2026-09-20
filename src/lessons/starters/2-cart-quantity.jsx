import { useState } from 'react';

export default function CartItem() {
  // TODO 1: keep the quantity in state, starting at 1.
  const quantity = 1;

  function increase() {
    // TODO 2: add one to the quantity.
  }

  function decrease() {
    // TODO 3: remove one, but never go below 0.
  }

  return (
    <section className="card">
      <div className="eyebrow">Shopping cart</div>
      <h2>Desk lamp</h2>
      <p>Warm light · Graphite</p>
      <div className="row">
        <span>Quantity</span>
        <div className="stepper">
          <button className="icon-button" aria-label="Decrease quantity" onClick={decrease}>−</button>
          <output aria-label="Quantity">{quantity}</output>
          <button className="icon-button" aria-label="Increase quantity" onClick={increase}>+</button>
        </div>
      </div>
    </section>
  );
}
