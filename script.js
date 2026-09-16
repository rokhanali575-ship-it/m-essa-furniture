import { db, collection, getDocs, query, orderBy } from "./firebase.js";

const fallbackProducts = [
  {name:"Luna Sofa",category:"Sofa Sets",price:"Contact for price",description:"A refined lounge sofa designed for everyday comfort.",image:"https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80"},
  {name:"Noir Bed",category:"Beds",price:"Contact for price",description:"A clean, elegant bedroom centerpiece with a premium feel.",image:"https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80"},
  {name:"Oak Dining",category:"Dining Tables",price:"Contact for price",description:"Warm dining design made for family gatherings.",image:"https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=900&q=80"}
];

const categories = ["Sofa Sets","Luxury Sofas","Beds","Bedroom Sets","Dining Tables","Dining Chairs","Wardrobes","Dressing Tables","TV Consoles","Center Tables","Office Furniture","Office Chairs","Study Tables","Cabinets","Customized Furniture"];

const categoryGrid = document.querySelector("#categoryGrid");
const productsGrid = document.querySelector("#productsGrid");
const filter = document.querySelector("#categoryFilter");

document.querySelector("#year").textContent = new Date().getFullYear();

categories.forEach((cat,i)=>{
  const card=document.createElement("a");
  card.className="category-card";
  card.href="#products";
  card.innerHTML=`<h3>${cat}</h3><span>${String(i+1).padStart(2,"0")} / COLLECTION</span>`;
  card.onclick=()=>{filter.value=cat; renderProducts(window.__products||fallbackProducts)};
  categoryGrid.appendChild(card);
  const option=document.createElement("option"); option.value=cat; option.textContent=cat; filter.appendChild(option);
});

function escapeHtml(value=""){return String(value).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}

function renderProducts(products){
  const selected=filter.value;
  const list=selected==="all"?products:products.filter(p=>p.category===selected);
  if(!list.length){productsGrid.innerHTML=`<div class="empty">No furniture has been added to this collection yet.</div>`;return;}
  productsGrid.innerHTML=list.map(p=>{
    const wa=`https://wa.me/923315172956?text=${encodeURIComponent("Assalam-o-Alaikum M ESSA Furniture, I am interested in: "+p.name+" ("+(p.price||"Price not listed")+")")}`;
    return `<article class="product-card">
      <div class="product-img"><img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" loading="lazy"></div>
      <div class="product-info">
        <div class="product-meta"><span>${escapeHtml(p.category)}</span><span class="price">${escapeHtml(p.price||"Contact for price")}</span></div>
        <h3>${escapeHtml(p.name)}</h3>
        <p class="product-desc">${escapeHtml(p.description||"Premium furniture from M ESSA Furniture.")}</p>
        <div class="product-actions"><a class="mini-btn" href="${wa}" target="_blank" rel="noopener">WhatsApp Inquiry</a><a class="mini-btn" href="tel:+923315172956">Call</a></div>
      </div>
    </article>`;
  }).join("");
}

async function loadProducts(){
  try{
    const snap=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc")));
    const products=snap.docs.map(d=>({id:d.id,...d.data()}));
    window.__products=products.length?products:fallbackProducts;
  }catch(err){
    console.warn("Firebase not configured yet. Showing demo products.",err);
    window.__products=fallbackProducts;
  }
  renderProducts(window.__products);
}
filter.addEventListener("change",()=>renderProducts(window.__products||fallbackProducts));
loadProducts();

document.querySelector("#menuToggle").addEventListener("click",()=>document.querySelector(".site-header").classList.toggle("open"));
document.querySelectorAll("nav a").forEach(a=>a.addEventListener("click",()=>document.querySelector(".site-header").classList.remove("open")));
