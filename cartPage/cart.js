// Get the cart items from local storage
var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];

// Select the container where cart items will be displayed
var cartContainer = document.querySelector(".cart-items");

// Variables to keep track of total price and total quantity
var totalQuantity = 0;
var totalPrice = 0;

function updateCartCount() {
  var cartCountElement = document.getElementById("cartCount");
  if (cartCountElement) {
    var totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElement.textContent = totalItems.toString();
  } else {
    console.error("Cart count element not found.");
  }
}

// Loop through the cart items and create elements for each item
function cartRefresh() {
  cartItems.length === 0
    ? (cartContainer.innerHTML = "<h2>Nothing in cart</h2>", updatePrice())
    : (cartContainer.innerHTML = "");

  cartItems.forEach(function (item, ind) {
    var cartItemDiv = document.createElement("div");
    cartItemDiv.classList.add("cart-item");
    cartItemDiv.setAttribute("data-item", item.name); // Set a data attribute for identification

    var img = document.createElement("img");
    img.setAttribute("src", item.imageURL1);
    img.setAttribute("alt", item.name);

    var itemName = document.createElement("h6");
    itemName.classList.add("item-name"); // Use a consistent class name
    itemName.textContent = item.name;

    var itemPrice = document.createElement("p");
    itemPrice.textContent = "Price: $" + item.price;
    itemPrice.classList.add("item-price"); // Use a consistent class name

    var itemQuantity = document.createElement("p");
    itemQuantity.textContent = item.quantity;
    itemQuantity.classList.add("item-quantity");

    var increaseButton = createButton("+", "increase-button");
    increaseButton.addEventListener("click", () => {
      updateQuantity(+1, item, itemQuantity);
    });

    var decreaseButton = createButton("-", "decrease-button");
    decreaseButton.addEventListener("click", () => {
      updateQuantity(-1, item, itemQuantity);
    });

    var removeButton = createButton("Remove", "remove-button");
    removeButton.addEventListener("click", function () {
      removeCartItem(item, ind);
    });

    cartItemDiv.append(img, itemName, itemPrice, increaseButton, itemQuantity, decreaseButton, removeButton);
    cartContainer.appendChild(cartItemDiv);
  });

  // Update the cart count
  updateCartCount();
}

function createButton(text, className) {
  var button = document.createElement("button");
  button.textContent = text;
  button.classList.add(className);
  return button;
}

function updateQuantity(update, element, itemQuantity) {
  // Find the index of the item in the cartItems array
  const itemIndex = cartItems.findIndex(
    (item) => item.name === element.name && item.price === element.price
  );

  if (itemIndex !== -1) {
    // Update the quantity
    cartItems[itemIndex].quantity += update;

    // Check if the quantity is zero and remove the item if needed
    if (cartItems[itemIndex].quantity === 0) {
      cartItems.splice(itemIndex, 1);
    }

    // Update the item quantity in the DOM
    itemQuantity.innerText = cartItems[itemIndex].quantity;

    // Update the total price and quantity
    updatePrice();

    // Update the cart count
    updateCartCount();

    // Store the updated cartItems in local storage
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }
}

function updatePrice() {
  var isCouponApplied = localStorage.getItem("isCouponApplied");

  var totalQuantity = 0,
    totalPrice = 0;
  cartItems.length === 0
    ? (totalQuantity = 0, (totalPrice = 0))
    : cartItems.forEach((ele) => {
        totalQuantity += ele.quantity;
        totalPrice += ele.quantity * ele.price;
      });

  document.getElementById("total-num").textContent = totalQuantity;
  document.getElementById("total-price").textContent = totalPrice.toFixed(2);

  document.getElementById("promo").addEventListener("submit", function (e) {
    e.preventDefault();
    var target = e.target;
    var couponCode = target.querySelector("#inputC").value;
    console.log(couponCode);
    if (isCouponApplied) return; // Coupon already applied

    // Apply coupon code logic
    if (couponCode === "MASAI30") {
      totalPrice *= 0.7; // Apply 30% discount
      totalPrice = totalPrice.toFixed(2);
      document.getElementById("total-price").textContent = totalPrice;

      isCouponApplied = true;
      localStorage.setItem("isCouponApplied", true);
    }
  });
}

function removeCartItem(item, ind) {
  cartItems = cartItems.filter((e, index) => {
    return ind != index;
  });

  // Update the total price and quantity
  updatePrice();

  // Update the cart count
  updateCartCount();

  localStorage.setItem("cartItems", JSON.stringify(cartItems));
  cartRefresh();
}

cartRefresh();
updatePrice();
updateCartCount();


document.getElementById('accountIcon').addEventListener('click', function() {
  window.location.href = '../login_page/login.html'; 
});

document.getElementById('cartIcon').addEventListener('click', function() {
  window.location.href = '../cartPage/cart.html'; 
});