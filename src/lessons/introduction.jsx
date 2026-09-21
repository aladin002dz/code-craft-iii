import { useState } from 'react'

export default function Cart() {
  const [count, setCount] = useState(0)

  return (
    <section className="card">
      <h2>Your shopping cart</h2>
      <p>Items in cart: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Add to cart
      </button>
    </section>
  )
}
