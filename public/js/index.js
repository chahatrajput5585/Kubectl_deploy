let navbar = document.querySelector(".navbar");

// document.querySelector("#menu-btn").onclick = () => {
//   navbar.classList.toggle("active");
//   searchForm.classList.remove("active");
//   cartItem.classList.remove("active");
// };

// menu button (check if it exists)
const menuBtn = document.querySelector("#menu-btn");
if (menuBtn) {
  menuBtn.onclick = () => {
    navbar?.classList.toggle("active");
    searchForm?.classList.remove("active");
    cartItem?.classList.remove("active");
  };
}

let cartItem = document.querySelector(".cart-items-container");

const cartBtn = document.querySelector("#cart-btn");
if (cartBtn) {
  cartBtn.onclick = () => {
    cartItem?.classList.toggle("active");
    navbar?.classList.remove("active");
    searchForm?.classList.remove("active");
  };
}

let searchForm = document.querySelector(".search-form");

const searchBtn = document.querySelector("#search-btn");
if (searchBtn) {
  searchBtn.onclick = () => {
    searchForm?.classList.toggle("active");
    navbar?.classList.remove("active");
    cartItem?.classList.remove("active");
  };
}

window.onscroll = () => {
  navbar.classList.remove("active");
  searchForm.classList.remove("active");
  cartItem.classList.remove("active");
};
