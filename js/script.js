const menuBtn = document.getElementById("menu-btn");
const mobileMenu = document.getElementById("mobile-menu");

menuBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

const categoryList = document.getElementById("category-list");
const plantList = document.getElementById("plant-list");
const cartItems = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");

let allPlants = [];
let cart = [];
let activeCategory = "All Plants"; // 🌿 Track active category

// ✅ Load all plants from API with loading spinner
async function loadPlants() {
  try {
    showSpinner(); // 🌀 Show spinner

    const res = await fetch("https://openapi.programming-hero.com/api/plants");
    const data = await res.json();
    allPlants = data.plants;

    loadCategories();
    displayPlants(allPlants);

  } catch (error) {
    console.error("Error loading plants:", error);
    plantList.innerHTML = `<p class="col-span-3 text-center text-red-500">Failed to load plants</p>`;
  } finally {
    hideSpinner(); // 🌀 Hide spinner
  }
}

// ✅ Show spinner
function showSpinner() {
  plantList.innerHTML = `
    <div class="col-span-full flex justify-center py-10">
      <div class="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  `;
}

// ✅ Hide spinner (will be done automatically when displayPlants runs)



function loadCategories() {
  const categories = [...new Set(allPlants.map((p) => p.category))];

  categoryList.innerHTML = `
    <li>
      <button 
        onclick="setActiveCategory('All Plants'); displayPlants(allPlants)" 
        class="block w-full text-left py-2 px-3 rounded-md font-semibold category-btn"
      >
        All Plants
      </button>
    </li>
  `;

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button 
        onclick="setActiveCategory('${category}'); filterByCategory('${category}')" 
        class="block w-full text-left py-2 px-3 rounded-md category-btn"
      >
        ${category}
      </button>
    `;
    categoryList.appendChild(li);
  });

  updateActiveButton(); 
}

function setActiveCategory(category) {
  activeCategory = category;
  updateActiveButton();
}

function updateActiveButton() {
  const buttons = document.querySelectorAll(".category-btn");
  buttons.forEach((btn) => {
    if (btn.textContent.trim() === activeCategory) {
      btn.classList.add("bg-green-600", "text-white", "font-semibold");
      btn.classList.remove("bg-green-100", "text-gray-700");
    } else {
      btn.classList.remove("bg-green-600", "text-white");
      btn.classList.add("text-gray-700", "hover:bg-green-100");
    }
  });
}

function filterByCategory(category) {
  const filtered = allPlants.filter((plant) => plant.category === category);
  displayPlants(filtered);
}


function displayPlants(plants) {
  if (!plants.length) {
    plantList.innerHTML = `<p class="col-span-full text-center text-gray-500">No plants found.</p>`;
    return;
  }

  plantList.innerHTML = plants
    .map(
      (p) => `
      <div class="rounded-lg shadow-md overflow-hidden h-63 hover:shadow-lg transition-shadow">
        <img src="${p.image}" alt="${p.name}" class="w-full h-40 object-cover">
        <div class="p-4">
          <h4 class="text-lg font-semibold text-gray-800">${p.name}</h4>
          <p class="text-sm text-gray-600 mb-2">${p.description.slice(0, 80)}...</p>
          <p class="text-green-600 font-bold mb-3">₹${p.price}</p>
          <button 
            class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            onclick="addToCart(${p.id})"
          >
            Add to Cart
          </button>
        </div>
      </div>
    `
    )
    .join("");
}

function addToCart(id) {
  const plant = allPlants.find((p) => p.id === id);
  const existing = cart.find((item) => item.id === id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...plant, quantity: 1 });
  }

  updateCart();
}

function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}
function updateCart() {
  cartItems.innerHTML = cart
    .map(
      (item) => `
      <div class="flex justify-between items-center border-b pb-2">
        <div>
          <p class="font-medium text-gray-800">${item.name}</p>
          <p class="text-sm text-gray-600">₹${item.price} × ${item.quantity}</p>
        </div>
        <button 
          class="text-red-500 hover:text-red-700" 
          onclick="removeFromCart(${item.id})"
        >X</button>
      </div>
    `
    )
    .join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalAmount.textContent = `₹${total}`;
}

// ✅ Initialize
loadPlants();
