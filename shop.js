const PRODUCTS = {
  apple: { name: "Apple", emoji: "🍏" },
  banana: { name: "Banana", emoji: "🍌" },
  lemon: { name: "Lemon", emoji: "🍋" },
};

const BUNDLES = {
  healthy_mix: {
    name: "Healthy Mix",
    products: ["apple", "banana"],
    emoji: "🍏🍌"
  },
  citrus_lovers: {
    name: "Citrus Lovers",
    products: ["lemon", "apple"],
    emoji: "🍋🍏"
  },
  tropical_party: {
    name: "Tropical Party",
    products: ["banana", "lemon"],
    emoji: "🍌🍋"
  },
  fruit_feast: {
    name: "Fruit Feast",
    products: ["apple", "banana", "lemon"],
    emoji: "🍏🍌🍋"
  }
};

// --- World Fruit Bundles Data ---
const worldFruitBundles = [
  {
    region: "India",
    flag: "🇮🇳",
    fruits: [
      { name: "Mango", emoji: "🥭", price: 2.5 },
      { name: "Guava", emoji: "🥝", price: 1.5 },
      { name: "Lychee", emoji: "🍒", price: 2.0 },
      { name: "Banana", emoji: "🍌", price: 1.0 }
    ],
    facts: [
      "India is the world's largest producer of mangoes, often called the 'King of Fruits.'",
      "Bananas are grown year-round in India and are a staple in many regions.",
      "Lychee is a summer fruit native to India's subtropical regions."
    ]
  },
  {
    region: "South America",
    flag: "🌎",
    fruits: [
      { name: "Papaya", emoji: "🍈", price: 2.2 },
      { name: "Passion Fruit", emoji: "🍇", price: 2.8 },
      { name: "Pineapple", emoji: "🍍", price: 2.0 }
    ],
    facts: [
      "South America is home to many exotic fruits, including papaya and passion fruit.",
      "Pineapples are native to South America and were spread around the world by explorers."
    ]
  },
  {
    region: "Europe",
    flag: "🇪🇺",
    fruits: [
      { name: "Apple", emoji: "🍏", price: 1.2 },
      { name: "Pear", emoji: "🍐", price: 1.3 },
      { name: "Plum", emoji: "🍑", price: 1.7 }
    ],
    facts: [
      "Europe is known for its apple and pear orchards.",
      "Plums are a traditional fruit in many European desserts."
    ]
  }
];

function getBasket() {
  const basket = localStorage.getItem("basket");
  return basket ? JSON.parse(basket) : [];
}

function addToBasket(product) {
  const basket = getBasket();
  basket.push(product);
  localStorage.setItem("basket", JSON.stringify(basket));
}

function clearBasket() {
  localStorage.removeItem("basket");
}

function addBundle(bundleId) {
  const bundle = BUNDLES[bundleId];
  if (bundle) {
    const basket = getBasket();
    basket.push(`bundle_${bundleId}`);
    localStorage.setItem("basket", JSON.stringify(basket));
    renderBasketIndicator();
  }
}

function renderBasket() {
  const basket = getBasket();
  const basketList = document.getElementById("basketList");
  const cartButtonsRow = document.querySelector(".cart-buttons-row");
  if (!basketList) return;
  basketList.innerHTML = "";
  if (basket.length === 0) {
    basketList.innerHTML = "<li>No products in basket.</li>";
    if (cartButtonsRow) cartButtonsRow.style.display = "none";
    return;
  }
  basket.forEach((item) => {
    if (item.startsWith("bundle_")) {
      const bundleId = item.replace("bundle_", "");
      const bundle = BUNDLES[bundleId];
      if (bundle) {
        const li = document.createElement("li");
        li.innerHTML = `<span class='basket-emoji'>${bundle.emoji}</span> <span>${bundle.name} Bundle</span>`;
        basketList.appendChild(li);
      }
    } else {
      const product = PRODUCTS[item];
      if (product) {
        const li = document.createElement("li");
        li.innerHTML = `<span class='basket-emoji'>${product.emoji}</span> <span>${product.name}</span>`;
        basketList.appendChild(li);
      }
    }
  });
  if (cartButtonsRow) cartButtonsRow.style.display = "flex";
}

function renderBasketIndicator() {
  const basket = getBasket();
  let indicator = document.querySelector(".basket-indicator");
  if (!indicator) {
    const basketLink = document.querySelector(".basket-link");
    if (!basketLink) return;
    indicator = document.createElement("span");
    indicator.className = "basket-indicator";
    basketLink.appendChild(indicator);
  }
  if (basket.length > 0) {
    indicator.textContent = basket.length;
    indicator.style.display = "flex";
  } else {
    indicator.style.display = "none";
  }
}

// Call this on page load and after basket changes
if (document.readyState !== "loading") {
  renderBasketIndicator();
} else {
  document.addEventListener("DOMContentLoaded", renderBasketIndicator);
}

// Patch basket functions to update indicator
const origAddToBasket = window.addToBasket;
window.addToBasket = function (product) {
  origAddToBasket(product);
  renderBasketIndicator();
};
const origClearBasket = window.clearBasket;
window.clearBasket = function () {
  origClearBasket();
  renderBasketIndicator();
};
