const products = [
  {
    id: 1,
    name: "智能手表 Pro",
    category: "tech",
    price: 1299,
    sales: "月销 2.3 万",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 2,
    name: "高能蓝牙耳机",
    category: "tech",
    price: 599,
    sales: "月销 1.7 万",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 3,
    name: "水润精华套装",
    category: "beauty",
    price: 399,
    sales: "月销 9800+",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 4,
    name: "极简香氛蜡烛",
    category: "home",
    price: 169,
    sales: "月销 6500+",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 5,
    name: "软糯针织套装",
    category: "fashion",
    price: 459,
    sales: "月销 1.2 万",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 6,
    name: "智能空气炸锅",
    category: "home",
    price: 899,
    sales: "月销 8300+",
    rating: "4.9",
    image:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 7,
    name: "小众设计师包",
    category: "fashion",
    price: 1280,
    sales: "月销 5400+",
    rating: "4.8",
    image:
      "https://images.unsplash.com/photo-1523359346063-d879354c0ea3?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: 8,
    name: "高倍防晒乳",
    category: "beauty",
    price: 189,
    sales: "月销 1.1 万",
    rating: "4.7",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80",
  },
];

const productGrid = document.querySelector("#product-grid");
const searchInput = document.querySelector("#search");
const filterButtons = document.querySelectorAll(".chip");
const cartCount = document.querySelector("#cart-count");
const countdown = document.querySelector("#countdown");

let activeFilter = "all";
let cartTotal = 0;

const formatPrice = (value) => `¥${value.toLocaleString()}`;

const renderProducts = () => {
  const keyword = searchInput.value.trim();
  const filtered = products.filter((product) => {
    const matchesFilter =
      activeFilter === "all" || product.category === activeFilter;
    const matchesKeyword =
      !keyword || product.name.includes(keyword) || product.sales.includes(keyword);
    return matchesFilter && matchesKeyword;
  });

  productGrid.innerHTML = filtered
    .map(
      (product) => `
      <article class="product-card">
        <img src="${product.image}" alt="${product.name}" />
        <div class="product-content">
          <div>
            <h3>${product.name}</h3>
            <div class="product-meta">
              <span>${product.sales}</span>
              <span>⭐ ${product.rating}</span>
            </div>
          </div>
          <div class="price">${formatPrice(product.price)}</div>
          <div class="product-actions">
            <button class="outline" type="button">收藏</button>
            <button class="primary" type="button" data-add="${product.id}">
              加入购物车
            </button>
          </div>
        </div>
      </article>
    `
    )
    .join("");
};

const setActiveFilter = (value) => {
  activeFilter = value;
  filterButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.filter === value);
  });
  renderProducts();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setActiveFilter(button.dataset.filter);
  });
});

productGrid.addEventListener("click", (event) => {
  const target = event.target.closest("button[data-add]");
  if (!target) return;
  cartTotal += 1;
  cartCount.textContent = cartTotal;
});

searchInput.addEventListener("input", renderProducts);

const updateCountdown = () => {
  const [hours, minutes, seconds] = countdown.textContent
    .split(":")
    .map(Number);
  const totalSeconds = hours * 3600 + minutes * 60 + seconds - 1;
  const safeSeconds = totalSeconds > 0 ? totalSeconds : 7200;
  const nextHours = String(Math.floor(safeSeconds / 3600)).padStart(2, "0");
  const nextMinutes = String(Math.floor((safeSeconds % 3600) / 60)).padStart(
    2,
    "0"
  );
  const nextSeconds = String(safeSeconds % 60).padStart(2, "0");
  countdown.textContent = `${nextHours}:${nextMinutes}:${nextSeconds}`;
};

renderProducts();
setInterval(updateCountdown, 1000);
