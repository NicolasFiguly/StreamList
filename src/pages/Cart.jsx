import React from "react";
import { useCart } from "../context/CartContext";

function posterUrl(path) {
  if (!path) return "";
  return `https://image.tmdb.org/t/p/w185${path}`;
}

function formatMoney(value) {
  const num = Number(value);
  if (!Number.isFinite(num)) return "0.00";
  return num.toFixed(2);
}

export default function Cart() {
  const { items, increment, decrement, removeFromCart, clearCart, totals } = useCart();

  return (
    <div className="page">
      <div className="card">
        <h1 className="title">Shopping Cart</h1>
        <p className="muted">
          Review your selected movies and manage quantities before checkout.
        </p>

        <div className="cartLayout">
          <div className="cartList">
            
            {items.length === 0 ? (
              <div className="emptyState">
                <p>Your cart is empty.</p>
                <p className="muted">Go to Movies and add a title to see it appear here.</p>
              </div>
            ) : (
              items.map((item) => {
                const priceEach = Number(item.price);
                const qty = Number(item.qty) || 1;
                const lineTotal = (Number.isFinite(priceEach) ? priceEach : 0) * qty;

                return (
                  <div className="cartRow" key={item.id}>
                    <div className="thumb">
                      {item.posterPath ? (
                        <img src={posterUrl(item.posterPath)} alt={item.title} />
                      ) : (
                        <div className="thumbPlaceholder">IMG</div>
                      )}
                    </div>

                    <div className="cartInfo">
                      <div className="cartTitle">
                        {item.title} {item.year ? <span className="muted">({item.year})</span> : null}
                      </div>

                      <div className="cartOverview muted">
                        ${formatMoney(priceEach)} each • Line total: ${formatMoney(lineTotal)}
                      </div>
                    </div>

                    <div className="cartActions">
                      <div className="qtyControls">
                        <button className="qtyBtn" onClick={() => decrement(item.id)}>
                          −
                        </button>
                        <div className="qtyValue">{qty}</div>
                        <button className="qtyBtn" onClick={() => increment(item.id)}>
                          +
                        </button>
                      </div>

                      <button
                        className="removeBtn"
                        aria-label={`Remove ${item.title}`}
                        onClick={() => removeFromCart(item.id)}
                      >
                        ×
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <aside className="cartSummary">
            <h2>Summary</h2>

            <div className="summaryRow">
              <span>Total Items</span>
              <span>{totals.totalQty}</span>
            </div>

            <div className="summaryRow">
              <strong>Total Price</strong>
              <strong>${totals.totalPrice}</strong>
            </div>

            <button
              className="primaryWide"
              disabled={items.length === 0}
              onClick={() => alert("Checkout placeholder for course project.")}
            >
              CHECKOUT
            </button>

            <button
              className="secondaryWide"
              disabled={items.length === 0}
              onClick={clearCart}
            >
              Clear Cart
            </button>
          </aside>
        </div>
      </div>
    </div>
  );
}