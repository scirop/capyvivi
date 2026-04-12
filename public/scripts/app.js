import { products } from "./catalog.js";
import { Cart } from "./cart.js";

const productCard = document.getElementById("product-card");
const cartSummary = document.getElementById("cart-summary");
const checkoutButton = document.getElementById("checkout-btn");
const checkoutError = document.getElementById("checkout-error");
const cartCloseBtn = document.getElementById("cart-close-btn");

const [product] = products;
const cart = new Cart(product.id);

const moneyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: product.currency.toUpperCase()
});

function openCart() {
  document.body.classList.add("cart-open");
}

function closeCart() {
  document.body.classList.remove("cart-open");
}

cartCloseBtn.addEventListener("click", closeCart);

function renderProduct() {
  productCard.innerHTML = `
    <div class="product-layout">
      <div class="product-image-wrap">
        <img src="${product.image}" alt="Happy capybara coloring book cover" />
      </div>
      <div class="product-meta">
        <h2>${product.name}</h2>
        <p>${product.description}</p>
        <p class="price">${moneyFormatter.format(product.priceCents / 100)}</p>
        <ul>
          ${product.details.map((detail) => `<li>${detail}</li>`).join("")}
        </ul>
        <label class="quantity-picker" for="quantity-input">
          Quantity
          <input id="quantity-input" type="number" min="1" max="10" value="1" />
        </label>
        <button class="add-to-basket-btn" id="add-to-basket-btn" type="button">🛒 Add to Basket</button>
      </div>
    </div>
  `;

  const quantityInput = document.getElementById("quantity-input");
  quantityInput.addEventListener("input", (event) => {
    cart.setQuantity(event.target.value);
    event.target.value = String(cart.getSnapshot().quantity);
    renderSummary();
  });

  document.getElementById("add-to-basket-btn").addEventListener("click", () => {
    cart.setQuantity(quantityInput.value);
    renderSummary();
    openCart();
  });
}

function renderSummary() {
  const snapshot = cart.getSnapshot();
  const subtotal = snapshot.quantity * product.priceCents;
  cartSummary.innerHTML = `
    <p><strong>Item:</strong> ${product.name}</p>
    <p><strong>Quantity:</strong> ${snapshot.quantity}</p>
    <p><strong>Total:</strong> ${moneyFormatter.format(subtotal / 100)}</p>
  `;
}

async function startCheckout() {
  checkoutError.textContent = "";
  checkoutButton.disabled = true;
  checkoutButton.textContent = "Sending to Stripe...";

  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(cart.getSnapshot())
    });

    const payload = await response.json();

    if (!response.ok || !payload.url) {
      throw new Error(payload.error || "Could not start checkout. Please try again.");
    }

    window.location.assign(payload.url);
  } catch (error) {
    checkoutError.textContent = error.message;
    checkoutButton.disabled = false;
    checkoutButton.textContent = "Checkout";
  }
}

checkoutButton.addEventListener("click", startCheckout);
renderProduct();
renderSummary();
renderSummary();
