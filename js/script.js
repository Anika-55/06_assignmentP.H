const API_BASE_URL = 'https://openapi.programming-hero.com/api';

// DOM Elements
const categoryListElement = document.getElementById('category-list');
const plantListElement = document.getElementById('plant-list');
const cartListElement = document.getElementById('cart-list');
const cartTotalElement = document.getElementById('cart-total');
const spinnerPlants = document.getElementById('spinner-plants');
const modalElement = document.getElementById('modal');
const modalCloseButton = document.getElementById('modal-close');
const modalContentElement = document.getElementById('modal-content');

let cart = [];
let totalCartPrice = 0;
let activeCategoryId = null;

// Spinner
const showSpinner = () => spinnerPlants.classList.remove('hidden');
const hideSpinner = () => spinnerPlants.classList.add('hidden');

// API Calls
const fetchCategories = async () => {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE_URL}/categories`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Category fetch error:', err);
    return [];
  } finally {
    hideSpinner();
  }
};

const fetchPlantsByCategory = async (categoryId) => {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE_URL}/category/${categoryId}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Plant fetch error:', err);
    return [];
  } finally {
    hideSpinner();
  }
};

const fetchPlantDetails = async (plantId) => {
  showSpinner();
  try {
    const res = await fetch(`${API_BASE_URL}/plant/${plantId}`);
    const data = await res.json();
    return data.data;
  } catch (err) {
    console.error('Plant detail fetch error:', err);
    return null;
  } finally {
    hideSpinner();
  }
};

const renderCategories = (categories) => {
  categoryListElement.innerHTML = '';
  categories.forEach(category => {
    const button = document.createElement('button');
    button.className = `category-button w-full text-left py-2 px-4 rounded-md hover:bg-green-100 text-green-800 focus:outline-none ${
      activeCategoryId === category.category_id ? 'bg-green-200 font-semibold' : ''
    }`;
    button.textContent = category.category_name;
    button.dataset.id = category.category_id;
    button.addEventListener('click', () => {
      activeCategoryId = category.category_id;
      renderCategories(categories);
      loadPlants(category.category_id);
    });
    const li = document.createElement('li');
    li.appendChild(button);
    categoryListElement.appendChild(li);
  });
};

const renderPlants = (plants) => {
  plantListElement.innerHTML = '';
  if (plants.length === 0) {
    plantListElement.innerHTML = '<p class="text-center text-gray-600 col-span-full">No plants found.</p>';
    return;
  }

  plants.forEach(plant => {
    const card = document.createElement('div');
    card.className = 'bg-white rounded-lg shadow-lg overflow-hidden flex flex-col';
    card.innerHTML = `
      <img src="'https://openapi.programming-hero.com/api/category/1'}" alt="${plant.plant_name}" class="w-full h-48 object-cover">
      <div class="p-4 flex flex-col flex-grow">
        <h3 class="text-xl font-semibold text-green-800 mb-2 cursor-pointer hover:text-green-600" data-id="${plant.plant_id}">${plant.plant_name}</h3>
        <p class="text-gray-600 text-sm mb-2">${plant.plant_short_description?.substring(0, 100) || ''}...</p>
        <p class="text-green-700 font-bold mb-2">Category: ${plant.plant_category}</p>
        <p class="text-green-900 font-bold text-lg mb-4">Price: ₹${plant.plant_price.toFixed(2)}</p>
        <button class="add-to-cart-btn bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-auto"
          data-id="${plant.plant_id}" data-name="${plant.plant_name}" data-price="${plant.plant_price}">
          Add to Cart
        </button>
      </div>
    `;
    plantListElement.appendChild(card);
  });

  // Add to Cart
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const { id, name, price } = btn.dataset;
      addToCart({ id, name, price: parseFloat(price) });
    });
  });

  // Modal Trigger
  document.querySelectorAll('#plant-list h3[data-id]').forEach(title => {
    title.addEventListener('click', async () => {
      const plantId = title.dataset.id;
      const details = await fetchPlantDetails(plantId);
      if (details) {
        renderModal(details);
        modalElement.classList.remove('hidden');
      }
    });
  });
};

const renderCart = () => {
  cartListElement.innerHTML = '';
  totalCartPrice = 0;

  if (cart.length === 0) {
    cartListElement.innerHTML = '<p class="text-gray-600">Your cart is empty.</p>';
  }

  cart.forEach(item => {
    totalCartPrice += item.price;
    const div = document.createElement('div');
    div.className = 'flex justify-between items-center bg-green-50 p-3 rounded-md';
    div.innerHTML = `
      <p class="text-green-800">${item.name} <span class="text-sm text-gray-600">(₹${item.price.toFixed(2)})</span></p>
      <button class="remove-from-cart-btn text-red-500 hover:text-red-700 font-bold text-lg" data-id="${item.id}">&times;</button>
    `;
    cartListElement.appendChild(div);
  });

  cartTotalElement.textContent = `₹${totalCartPrice.toFixed(2)}`;

  document.querySelectorAll('.remove-from-cart-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const plantId = btn.dataset.id;
      removeFromCart(plantId);
    });
  });
};

const renderModal = (plant) => {
  modalContentElement.innerHTML = `
    <h3 class="text-3xl font-bold text-green-800 mb-4">${plant.plant_name}</h3>
    <img src=" 'https://openapi.programming-hero.com/api/plant/${id}'}" alt="${plant.plant_name}" class="w-full h-64 object-cover mb-4 rounded-lg">
    <p class="text-gray-700 mb-4">${plant.plant_description || plant.plant_short_description}</p>
    <p class="text-green-700 font-semibold mb-2">Category: ${plant.plant_category}</p>
    <p class="text-green-900 font-bold text-xl mb-4">Price: ₹${plant.plant_price.toFixed(2)}</p>
    <div class="mt-4">
      <h4 class="font-semibold text-green-800 mb-2">Care Instructions:</h4>
      <ul class="list-disc list-inside text-gray-700">
        ${plant.plant_care_instructions?.map(i => `<li>${i}</li>`).join('') || '<li>No care instructions provided.</li>'}
      </ul>
    </div>
  `;
};

// Cart Logic
const addToCart = (plant) => {
  if (cart.find(item => item.id === plant.id)) {
    alert(`${plant.name} is already in your cart!`);
    return;
  }
  cart.push(plant);
  renderCart();
};

const removeFromCart = (plantId) => {
  cart = cart.filter(item => item.id !== plantId);
  renderCart();
};

// Initial Load
const loadCategories = async () => {
  const categories = await fetchCategories();
  if (categories.length > 0) {
    activeCategoryId = categories[0].category_id;
    renderCategories(categories);
    loadPlants(activeCategoryId);
  }
};

const loadPlants = async (categoryId) => {
  const plants = await fetchPlantsByCategory(categoryId);
  renderPlants(plants);
};

// Modal Events
modalCloseButton.addEventListener('click', () => modalElement.classList.add('hidden'));
modalElement.addEventListener('click', (e) => {
  if (e.target === modalElement) modalElement.classList.add('hidden');
});

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  loadCategories();
  renderCart();
});


