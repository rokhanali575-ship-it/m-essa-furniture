import {auth, db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, onAuthStateChanged, signInWithEmailAndPassword, signOut} from "./firebase.js";

const CATEGORIES=["Sofa Sets","Luxury Sofas","Beds","Bedroom Sets","Dining Tables","Dining Chairs","Wardrobes","Dressing Tables","TV Consoles","Center Tables","Office Furniture","Office Chairs","Study Tables","Cabinets","Customized Furniture"];
const loginView=document.querySelector("#loginView"), dashboard=document.querySelector("#dashboard");
const formPanel=document.querySelector("#formPanel"), form=document.querySelector("#productForm");
const pCategory=document.querySelector("#pCategory"), imageInput=document.querySelector("#pImage"), preview=document.querySelector("#previewImg");
CATEGORIES.forEach(c=>pCategory.insertAdjacentHTML("beforeend",`<option>${c}</option>`));

onAuthStateChanged(auth,user=>{
  if(user){loginView.classList.add("hidden");dashboard.classList.remove("hidden");loadProducts();}
  else{dashboard.classList.add("hidden");loginView.classList.remove("hidden");}
});

document.querySelector("#loginForm").addEventListener("submit",async e=>{
 e.preventDefault(); document.querySelector("#loginError").textContent="";
 try{await signInWithEmailAndPassword(auth,document.querySelector("#email").value.trim(),document.querySelector("#password").value);}
 catch(err){document.querySelector("#loginError").textContent="Login failed. Check your owner email/password and Firebase setup.";}
});
document.querySelector("#logoutBtn").onclick=()=>signOut(auth);
document.querySelector("#newBtn").onclick=()=>openForm();
document.querySelector("#cancelBtn").onclick=()=>closeForm();
imageInput.onchange=async()=>{if(imageInput.files[0]){preview.src=await compressImage(imageInput.files[0]);preview.parentElement.classList.add("show");}};

function openForm(product=null){
 formPanel.classList.remove("hidden");
 document.querySelector("#formTitle").textContent=product?"Edit Product":"Add Product";
 document.querySelector("#productId").value=product?.id||"";
 document.querySelector("#pName").value=product?.name||"";
 document.querySelector("#pCategory").value=product?.category||CATEGORIES[0];
 document.querySelector("#pPrice").value=product?.price||"";
 document.querySelector("#pDescription").value=product?.description||"";
 preview.src=product?.image||"";
 preview.parentElement.classList.toggle("show",!!product?.image);
 form.scrollIntoView({behavior:"smooth",block:"start"});
}
function closeForm(){form.reset();document.querySelector("#productId").value="";preview.src="";preview.parentElement.classList.remove("show");formPanel.classList.add("hidden");}

async function compressImage(file){
 return new Promise((resolve,reject)=>{
  const reader=new FileReader();
  reader.onload=()=>{const img=new Image();img.onload=()=>{
    const max=900, scale=Math.min(1,max/Math.max(img.width,img.height));
    const c=document.createElement("canvas");c.width=Math.round(img.width*scale);c.height=Math.round(img.height*scale);
    c.getContext("2d").drawImage(img,0,0,c.width,c.height);
    resolve(c.toDataURL("image/jpeg",.72));
  };img.onerror=reject;img.src=reader.result;};reader.onerror=reject;reader.readAsDataURL(file);
 });
}

form.addEventListener("submit",async e=>{
 e.preventDefault();
 const msg=document.querySelector("#formMsg");msg.textContent="Saving...";
 try{
  const id=document.querySelector("#productId").value;
  let image=preview.src;
  if(imageInput.files[0]) image=await compressImage(imageInput.files[0]);
  if(!image || image==="") throw new Error("Please select a product photo.");
  if(image.length>950000) throw new Error("This image is still too large. Choose a smaller photo.");
  const data={name:document.querySelector("#pName").value.trim(),category:pCategory.value,price:document.querySelector("#pPrice").value.trim()||"Contact for price",description:document.querySelector("#pDescription").value.trim(),image};
  if(id){await updateDoc(doc(db,"products",id),data);msg.textContent="Product updated."; }
  else{data.createdAt=serverTimestamp();await addDoc(collection(db,"products"),data);msg.textContent="Product added.";}
  closeForm();await loadProducts();
 }catch(err){console.error(err);msg.textContent=err.message||"Could not save product.";}
});

async function loadProducts(){
 const box=document.querySelector("#adminProducts");box.innerHTML="<div class='muted'>Loading...</div>";
 try{
  const snap=await getDocs(query(collection(db,"products"),orderBy("createdAt","desc")));
  const products=snap.docs.map(d=>({id:d.id,...d.data()}));
  document.querySelector("#count").textContent=`${products.length} product${products.length===1?"":"s"}`;
  if(!products.length){box.innerHTML="<div class='muted' style='padding:30px 0'>No products yet. Add your first piece.</div>";return;}
  box.innerHTML=products.map(p=>`<div class="admin-row"><img src="${p.image}" alt=""><div><h3>${escapeHtml(p.name)}</h3><p>${escapeHtml(p.category)} • ${escapeHtml(p.price||"Contact for price")}</p></div><div class="row-actions"><button data-edit="${p.id}">Edit</button><button class="delete" data-delete="${p.id}">Delete</button></div></div>`).join("");
  box.querySelectorAll("[data-edit]").forEach(b=>b.onclick=()=>openForm(products.find(p=>p.id===b.dataset.edit)));
  box.querySelectorAll("[data-delete]").forEach(b=>b.onclick=async()=>{if(confirm("Delete this product?")){await deleteDoc(doc(db,"products",b.dataset.delete));loadProducts();}});
 }catch(err){box.innerHTML="<div class='error'>Could not load products. Check Firestore setup and security rules.</div>";}
}
function escapeHtml(v=""){return String(v).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));}
