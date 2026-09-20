import { useState } from 'react';

export default function CartActions() {
  const [quantity, setQuantity] = useState(0);

  function addOne() {
    setQuantity(quantity + 1);
  }

  function addThree() {
    addOne();
    addOne();
    addOne();
  }

  return (
    <section className="card">
      <div className="eyebrow">Shopping cart</div>
      <h2>Quick add</h2>
      <p>Add items to your order in one click.</p>
      <div className="row">
        <span>Items in cart</span>
        <output aria-label="Items in cart">{quantity}</output>
      </div>
      <div className="actions">
        <button className="secondary" onClick={addOne}>Add 1</button>
        <button onClick={addThree}>Add 3</button>
      </div>
    </section>
  );
}
