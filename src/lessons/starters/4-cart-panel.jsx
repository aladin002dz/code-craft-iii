import { useState } from 'react';

function CartItem({ name, quantity, onAdd }) {
  return (
    <div className="row">
      <span>{name}</span>
      <output aria-label="Quantity">0</output>
      <button onClick={() => {}}>Add one</button>
    </div>
  );
}

export default function CartPanel() {
  const [quantity, setQuantity] = useState(2);

  function addOne() {
    setQuantity(quantity + 1);
  }

  return (
    <section className="card">
      <div className="eyebrow">Shopping cart</div>
      <h2>Your order</h2>
      <CartItem />
      <p className="muted">Total items: {quantity}</p>
    </section>
  );
}
