const products = [
  {
    id: 1,
    name: "Essential Black Hoodie",
    category: "hoodies",
    price: 65,
    oldPrice: 85,
    image: "images/product-1.jpg",
    sale: true
  },
  {
    id: 2,
    name: "Oversized Logo T-Shirt",
    category: "tshirts",
    price: 35,
    oldPrice: 45,
    image: "images/product-2.jpg",
    sale: true
  },
  {
    id: 3,
    name: "Classic Cargo Pants",
    category: "pants",
    price: 70,
    oldPrice: null,
    image: "images/product-3.jpg",
    sale: false
  },
  {
    id: 4,
    name: "Heavyweight Grey Hoodie",
    category: "hoodies",
    price: 75,
    oldPrice: 95,
    image: "images/product-4.jpg",
    sale: true
  }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productsGrid = document.getElementById("productsGrid");
const productsCount = document.getElementById("productsCount");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");
const categorySelect = document.getElementById("categorySelect");

const cartButton = document.getElementById("cartButton");
const cartPanel = document.getElementById("cartPanel");
const cartOverlay = document.getElementById("cartOverlay");
const closeCart = document.getElementById("closeCart");
const cartItems = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.getElementById("cartCount");
const checkoutButton = document.getElementById("checkoutButton");

const menuButton = document.getElementById("menuButton");
const sideMenu = document.getElementById("sideMenu");
const closeMenu = document.getElementById("closeMenu");

function formatPrice(price) {
  return `$${price.toFixed(2)}`;
}

function renderProducts() {
  let filteredProducts = [...products];

  const searchValue = searchInput.value.toLowerCase().trim();
  const categoryValue = categorySelect.value;
  const sortValue = sortSelect.value;

  if (searchValue) {
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchValue)
    );
  }

  if (categoryValue !== "all") {
    filteredProducts = filteredProducts.filter(product =>
      product.category === categoryValue
    );
  }

  if (sortValue === "low") {
    filteredProducts.sort((a, b) => a.price - b.price);
  }

  if (sortValue === "high") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  if (sortValue === "name") {
    filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
  }

  productsCount.textContent = filteredProducts.length;

  if (filteredProducts.length === 0) {
    productsGrid.innerHTML = `
      <p class="empty-products">
        No products found.
      </p>
    `;
    return;
  }

  productsGrid.innerHTML = filteredProducts.map(product => `
    <article class="product-card">
      <div class="product-image">

        <img
          src="${product.image}"
          alt="${product.name}"
          loading="lazy"
        >

        ${
          product.sale
            ? `<span class="sale-label">SALE</span>`
            : ""
        }

        <button
          class="quick-add"
          data-id="${product.id}"
        >
          ADD TO BAG
        </button>
      </div>

      <div class="product-info">
        <h2 class="product-name">${product.name}</h2>
        <p class="product-category">${product.category}</p>

        <p class="product-price">
          ${
            product.oldPrice
              ? `<span class="old-price">${formatPrice(product.oldPrice)}</span>`
              : ""
          }

          ${formatPrice(product.price)}
        </p>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".quick-add").forEach(button => {
    button.addEventListener("click", () => {
      addToCart(Number(button.dataset.id));
    });
  });
}

function addToCart(productId) {
  const product = products.find(item => item.id === productId);

  if (!product) return;

  cart.push(product);
  saveCart();
  renderCart();
  openCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  saveCart();
  renderCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function renderCart() {
  cartCount.textContent = cart.length;

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty-cart">Your bag is empty.</p>
    `;

    cartTotal.textContent = "$0.00";
    return;
  }

  cartItems.innerHTML = cart.map((product, index) => `
    <div class="cart-item">
      <img src="${product.image}" alt="${product.name}">

      <div class="cart-item-info">
        <h3>${product.name}</h3>
        <p>${formatPrice(product.price)}</p>

        <button
          class="remove-item"
          data-index="${index}"
        >
          Remove
        </button>
      </div>
    </div>
  `).join("");

  const total = cart.reduce((sum, product) => {
    return sum + product.price;
  }, 0);

  cartTotal.textContent = formatPrice(total);

  document.querySelectorAll(".remove-item").forEach(button => {
    button.addEventListener("click", () => {
      removeFromCart(Number(button.dataset.index));
    });
  });
}

function openCart() {
  cartPanel.classList.add("open");
  cartOverlay.classList.add("show");
}

function closeCartPanel() {
  cartPanel.classList.remove("open");
  cartOverlay.classList.remove("show");
}

cartButton.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartPanel);
cartOverlay.addEventListener("click", closeCartPanel);

menuButton.addEventListener("click", () => {
  sideMenu.classList.add("open");
});

closeMenu.addEventListener("click", () => {
  sideMenu.classList.remove("open");
});

document.querySelectorAll(".side-menu a").forEach(link => {
  link.addEventListener("click", () => {
    sideMenu.classList.remove("open");
  });
});

searchInput.addEventListener("input", renderProducts);
sortSelect.addEventListener("change", renderProducts);
categorySelect.addEventListener("change", renderProducts);

document.getElementById("newsletterForm").addEventListener("submit", event => {
  event.preventDefault();
  alert("Thank you for subscribing!");
  event.target.reset();
});

checkoutButton.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your bag is empty.");
    return;
  }

  const phoneNumber = "000000000000";

  const orderDetails = cart.map(product => {
    return `- ${product.name}: ${formatPrice(product.price)}`;
  }).join("\n");

  const total = cart.reduce((sum, product) => {
    return sum + product.price;
  }, 0);

  const message = `
Hello, I want to place an order:

${orderDetails}

Total: ${formatPrice(total)}
  `;

  const whatsappUrl =
    `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, "_blank");
});

renderProducts();
renderCart();
