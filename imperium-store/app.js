const CONFIG = window.IMPERIUM_CONFIG || {};
const products = [
 {id:1,name:"Signature Tee",category:"T-Shirts",price:499,image:"assets/tee-black.svg",sizes:["S","M","L","XL","XXL"],desc:"A clean everyday essential with a structured silhouette and the IMPERIUM mark."},
 {id:2,name:"Essential Hoodie",category:"Hoodies",price:899,image:"assets/hoodie-cream.svg",sizes:["S","M","L","XL","XXL"],desc:"A heavyweight-feel hoodie built for understated luxury and everyday wear."},
 {id:3,name:"Classic Cap",category:"Accessories",price:249,image:"assets/cap-black.svg",sizes:["OS"],desc:"Minimal headwear finished with the IMPERIUM wordmark."},
 {id:4,name:"Signature Beanie",category:"Accessories",price:199,image:"assets/beanie-black.svg",sizes:["OS"],desc:"A clean ribbed beanie for a simple finishing touch."},
 {id:5,name:"Cargo Pants",category:"Trousers",price:699,image:"assets/cargo-black.svg",sizes:["S","M","L","XL"],desc:"Relaxed utility trousers with a clean, modern streetwear profile."}
];

let cart = JSON.parse(localStorage.getItem("imperiumCart") || "[]");

const money = n => `${CONFIG.currency || "R"}${Number(n).toLocaleString("en-ZA")}`;
const save = () => localStorage.setItem("imperiumCart", JSON.stringify(cart));

function renderProducts(filter="All", query=""){
  const grid = document.getElementById("productGrid");
  const q = query.trim().toLowerCase();
  const list = products.filter(p => (filter==="All" || p.category===filter) && (!q || `${p.name} ${p.category}`.toLowerCase().includes(q)));
  grid.innerHTML = list.length ? list.map(p => `
    <article class="product-card" data-id="${p.id}">
      <div class="product-image"><img src="${p.image}" alt="${p.name}">
        <button class="quick-add" data-quick="${p.id}">QUICK ADD</button>
      </div>
      <div class="product-info"><h3>${p.name.toUpperCase()}</h3><p>${money(p.price)}</p></div>
    </article>`).join("") : `<p>No products found.</p>`;
}

function updateCart(){
  const count = cart.reduce((s,i)=>s+i.qty,0);
  document.getElementById("cartCount").textContent = count;
  const items = document.getElementById("cartItems");
  if(!cart.length) items.innerHTML = `<div style="padding:50px 0;text-align:center;color:#777">YOUR CART IS EMPTY.</div>`;
  else items.innerHTML = cart.map(i => {
    const p=products.find(x=>x.id===i.id);
    return `<div class="cart-row">
      <img src="${p.image}" alt="">
      <div><h4>${p.name.toUpperCase()}</h4><p>${i.size} · ${money(p.price)}</p>
      <div class="qty"><button data-minus="${p.id}" data-size="${i.size}">−</button><span>${i.qty}</span><button data-plus="${p.id}" data-size="${i.size}">+</button></div>
      <button class="remove" data-remove="${p.id}" data-size="${i.size}">REMOVE</button></div>
      <strong>${money(p.price*i.qty)}</strong>
    </div>`;
  }).join("");
  const subtotal=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  const shipping=subtotal===0?0:(subtotal >= (CONFIG.freeShippingThreshold||1000)?0:(CONFIG.shippingFlatRate||99));
  document.getElementById("cartSubtotal").textContent=money(subtotal);
  document.getElementById("cartShipping").textContent=shipping?money(shipping):"FREE";
  document.getElementById("cartTotal").textContent=money(subtotal+shipping);
}

function openCart(){document.getElementById("cartDrawer").classList.add("open");document.getElementById("backdrop").classList.add("open")}
function closeCart(){document.getElementById("cartDrawer").classList.remove("open");document.getElementById("backdrop").classList.remove("open")}
function addToCart(id,size,qty=1){
  const existing=cart.find(i=>i.id===id&&i.size===size);
  if(existing) existing.qty+=qty; else cart.push({id,size,qty});
  save(); updateCart(); openCart();
}

function openProduct(id){
  const p=products.find(x=>x.id===id);
  document.getElementById("modalImage").src=p.image;
  document.getElementById("modalImage").alt=p.name;
  document.getElementById("modalCategory").textContent=p.category.toUpperCase();
  document.getElementById("modalName").textContent=p.name;
  document.getElementById("modalDescription").textContent=p.desc;
  document.getElementById("modalPrice").textContent=money(p.price);
  document.getElementById("modalSize").innerHTML=p.sizes.map(s=>`<option>${s}</option>`).join("");
  document.getElementById("modalQty").value=1;
  document.getElementById("modalAdd").dataset.id=id;
  document.getElementById("productModal").classList.add("open");
}
function closeProduct(){document.getElementById("productModal").classList.remove("open")}

function checkoutWhatsApp(){
  if(!cart.length){alert("Your cart is empty.");return}
  const subtotal=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);
  const shipping=subtotal >= (CONFIG.freeShippingThreshold||1000)?0:(CONFIG.shippingFlatRate||99);
  const total=subtotal+shipping;
  const lines=cart.map(i=>{const p=products.find(x=>x.id===i.id);return `${i.qty} x ${p.name} (${i.size}) — ${money(p.price*i.qty)}`});
  const message=`Hello IMPERIUM, I would like to place an order:%0A%0A${lines.join("%0A")}%0A%0ASubtotal: ${money(subtotal)}%0ADelivery: ${shipping?money(shipping):"FREE"}%0ATotal: ${money(total)}%0A%0AName:%0AAddress:%0APhone:%0A`;
  if(!CONFIG.whatsappNumber || CONFIG.whatsappNumber==="27820000000"){
    alert("Replace the WhatsApp number in config.js before using checkout.");
    return;
  }
  window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=${message}`,"_blank");
}

document.addEventListener("click",e=>{
  const product=e.target.closest(".product-card");
  if(product && !e.target.matches("button")) openProduct(Number(product.dataset.id));
  if(e.target.dataset.quick) { const p=products.find(x=>x.id===Number(e.target.dataset.quick)); addToCart(p.id,p.sizes[0]); }
  if(e.target.dataset.plus){const i=cart.find(x=>x.id===Number(e.target.dataset.plus)&&x.size===e.target.dataset.size);if(i)i.qty++;save();updateCart();}
  if(e.target.dataset.minus){const i=cart.find(x=>x.id===Number(e.target.dataset.minus)&&x.size===e.target.dataset.size);if(i){i.qty--;if(i.qty<=0)cart=cart.filter(x=>x!==i)}save();updateCart();}
  if(e.target.dataset.remove){cart=cart.filter(x=>!(x.id===Number(e.target.dataset.remove)&&x.size===e.target.dataset.size));save();updateCart();}
  const f=e.target.closest(".filter"); if(f){document.querySelectorAll(".filter").forEach(x=>x.classList.remove("active"));f.classList.add("active");renderProducts(f.dataset.filter,document.getElementById("searchInput").value);}
  const cat=e.target.closest(".category"); if(cat?.dataset.filter){document.querySelectorAll(".filter").forEach(x=>x.classList.toggle("active",x.dataset.filter===cat.dataset.filter));renderProducts(cat.dataset.filter);}
});

document.getElementById("cartBtn").onclick=openCart;
document.getElementById("closeCart").onclick=closeCart;
document.getElementById("backdrop").onclick=closeCart;
document.getElementById("closeModal").onclick=closeProduct;
document.getElementById("modalAdd").onclick=()=>{const p=products.find(x=>x.id===Number(document.getElementById("modalAdd").dataset.id));addToCart(p.id,document.getElementById("modalSize").value,Number(document.getElementById("modalQty").value)||1);closeProduct()};
document.getElementById("checkoutBtn").onclick=checkoutWhatsApp;
document.getElementById("searchBtn").onclick=()=>{document.getElementById("searchPanel").classList.add("open");document.getElementById("searchInput").focus()};
document.getElementById("closeSearch").onclick=()=>document.getElementById("searchPanel").classList.remove("open");
document.getElementById("searchInput").addEventListener("input",e=>renderProducts("All",e.target.value));
document.getElementById("contactWhatsApp").onclick=e=>{e.preventDefault();if(CONFIG.whatsappNumber)window.open(`https://wa.me/${CONFIG.whatsappNumber}?text=Hello%20IMPERIUM%2C%20I%20have%20an%20enquiry.`,"_blank")};
document.getElementById("footerEmail").textContent=CONFIG.email||"orders@yourdomain.co.za";
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();updateCart();
