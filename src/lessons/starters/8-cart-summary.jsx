import { useState } from 'react';

const unitPrice = 25;

export default function CartSummary() {
  const [quantity, setQuantity] = useState(2);
  const [subtotal, setSubtotal] = useState(50);

  function addOne() {
    setQuantity(quantity + 1);
    // The subtotal has to change along with the quantity...
  }

  return (
    <section className="card">
      <div className="eyebrow">Shopping cart</div>
      <h2>Order summary</h2>
      <div className="row">
        <span>Desk lamp × {quantity}</span>
        <button onClick={addOne}>Add one</button>
      </div>
      <div className="row total">
        <span>Subtotal</span>
        <output aria-label="Subtotal">${subtotal}</output>
      </div>
    </section>
  );
}
