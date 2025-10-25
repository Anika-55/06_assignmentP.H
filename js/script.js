const categoryList = document.getElementById("category-list");
const plantList = document.getElementById("plant-list");
const cartItems = document.getElementById("cart-items");
const totalAmount = document.getElementById("total-amount");

let allPlants = [];
let cart = [];

// ✅ Load all plants from API
async function loadPlants() {
  try {
    const res = await fetch("https://openapi.programming-hero.com/api/plants"); // 👈 replace with your actual endpoint
    const data = await res.json();
    allPlants = data.plants;

    loadCategories();
    displayPlants(allPlants); // show all plants initially
  } catch (error) {
    console.error("Error loading plants:", error);
    plantList.innerHTML = `<p class="col-span-3 text-center text-red-500">Failed to load plants</p>`;
  }
}

// ✅ Load unique categories dynamically
function loadCategories() {
  const categories = [...new Set(allPlants.map((p) => p.category))];

  categoryList.innerHTML = `
    <li>
      <button onclick="displayPlants(allPlants)" 
        class="block w-full text-left py-2 px-3 text-gray-700 hover:bg-green-100 rounded-md font-semibold">
        All Plants
      </button>
    </li>
  `;

  categories.forEach((category) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <button 
        onclick="filterByCategory('${category}')"
        class="block w-full text-left py-2 px-3 text-gray-700 hover:bg-green-100 rounded-md"
      >
        ${category}
      </button>
    `;
    categoryList.appendChild(li);
  });
}

// ✅ Filter plants by category
function filterByCategory(category) {
  const filtered = allPlants.filter((plant) => plant.category === category);
  displayPlants(filtered);
}

// ✅ Display plants in cards
function displayPlants(plants) {
  if (!plants.length) {
    plantList.innerHTML = `<p class="col-span-full text-center text-gray-500">No plants found.</p>`;
    return;
  }

  plantList.innerHTML = plants
    .map(
      (p) => `
      <div class=" rounded-lg shadow-md overflow-hidden h-63 hover:shadow-lg transition-shadow">
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

// ✅ Add to cart
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

// ✅ Remove from cart
function removeFromCart(id) {
  cart = cart.filter((item) => item.id !== id);
  updateCart();
}

// ✅ Update cart UI
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
