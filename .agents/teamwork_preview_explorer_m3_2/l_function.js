function l_(){
  const getInitialView = () => {
    const host = window.location.hostname.toLowerCase();
    const p = window.location.pathname.toLowerCase();
    const search = window.location.search.toLowerCase();
    const storedSl = localStorage.getItem("kmart_salesman");
    if (search.includes("view=admin")) return "admin";
    if (search.includes("view=salesman")) return "salesman";
    if (search.includes("view=customer")) return "customer";
    if (host.includes("admin")) return "admin";
    if (host.includes("salesman")) return "salesman";
    if (host.includes("customer") || host.includes("order")) return "customer";
    if (p.startsWith("/admin")) return "admin";
    if (p.startsWith("/salesman")) return "salesman";
    if (storedSl) return "salesman";
    return "customer";
  };

  const [r, a] = ge.useState(getInitialView);
  const [isSubmittingOrder, setIsSubmittingOrder] = ge.useState(!1);
  const [checkoutToken, setCheckoutToken] = ge.useState(() => "chk-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9));
  const [s, l] = ge.useState([]);
  const [c, h] = ge.useState(!0);
  const [f, y] = ge.useState("");
  const [g, m] = ge.useState("All");
  const [v, b] = ge.useState({});
  const [T, x] = ge.useState({});
  const [z, H] = ge.useState("");const [selectedBeat, setSelectedBeat] = ge.useState("Chohla Sahib");const [selectedCustomerId, setSelectedCustomerId] = ge.useState("");const [newCustomerName, setNewCustomerName] = ge.useState("");const [newCustomerPhone, setNewCustomerPhone] = ge.useState("");const [dbBeats, setDbBeats] = ge.useState(["Chohla Sahib", "Tarn Taran", "Patti", "Harike", "Goindwal Sahib", "Naushehra Pannuan", "Bhikhiwind", "Others"]);const [adminBeatName, setAdminBeatName] = ge.useState("");const [adminCustName, setAdminCustName] = ge.useState("");const [adminCustPhone, setAdminCustPhone] = ge.useState("");const [adminCustBeat, setAdminCustBeat] = ge.useState("Chohla Sahib");const [adminBeatFilter, setAdminBeatFilter] = ge.useState("All");const [adminCatFilter, setAdminCatFilter] = ge.useState("All");const [editingCustomer, setEditingCustomer] = ge.useState(null);const [deleteConfirm, setDeleteConfirm] = ge.useState(null);const [editCustName, setEditCustName] = ge.useState("");const [editCustPhone, setEditCustPhone] = ge.useState("");const [editCustBeat, setEditCustBeat] = ge.useState("");const [adminCustVisionId, setAdminCustVisionId] = ge.useState("");const [editCustVisionId, setEditCustVisionId] = ge.useState("");const [editingOrder, setEditingOrder] = ge.useState(null);const [adminOrderBeatFilter, setAdminOrderBeatFilter] = ge.useState("all");const [adminOrderDateFilter, setAdminOrderDateFilter] = ge.useState(() => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); });const [salesmanOrderDateFilter, setSalesmanOrderDateFilter] = ge.useState(() => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); });
  const [neErr, setNeErr] = ge.useState(!1);
  const [X, $] = ge.useState(!1);
  const [I, q] = ge.useState(!1);
  const [ie, ke] = ge.useState("");
  const [se, W] = ge.useState(!1);
  const [slAuth, setSlAuth] = ge.useState(() => localStorage.getItem("kmart_salesman") !== null);
  const [authTarget, setAuthTarget] = ge.useState("admin");
  const [Ze, Me] = ge.useState(!1);
  const [zn, tt] = ge.useState("");
  const [nt, pt] = ge.useState(!1);
  const [It, ht] = ge.useState(!1);
  const [N, G] = ge.useState(!1);
  const [ee, we] = ge.useState(null);
  const [Ee, E] = ge.useState(null);
  const [B, Y] = ge.useState("");
  const [V, ae] = ge.useState({name:"",cat:"",brand:"",unit:"",mrp:"",tp:"",cp:"",cs:"",customer_price:"",tier2_min_qty:"",tier2_price:"",desc:""});

  // NEW Customer states
  const [cust, setCust] = ge.useState(() => {
    const stored = localStorage.getItem("kmart_customer");
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    return null;
  });
  const [custNameInput, setCustNameInput] = ge.useState("");
  const [custPhoneInput, setCustPhoneInput] = ge.useState("");
  const [custOrders, setCustOrders] = ge.useState([]);
  const [showCustOrders, setShowCustOrders] = ge.useState(!1);
  const [showCustProfile, setShowCustProfile] = ge.useState(!1);
  const [customCats, setCustomCats] = ge.useState(() => {
    const defaults = ["Staples", "Edible Oils", "Home Care", "Dairy", "Biscuits", "Instant Food", "Personal Care", "Beverages", "Snacks"];
    const stored = localStorage.getItem("kmart_custom_categories");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return Array.from(new Set(parsed.map(x => x.trim()).filter(Boolean)));
        }
      } catch(e) {}
    }
    return defaults;
  });
  const [newCatName, setNewCatName] = ge.useState("");
  const [showNewCatInput, setShowNewCatInput] = ge.useState(!1);const [catToDelete, setCatToDelete] = ge.useState(null);const [adminOrderSubTab, setAdminOrderSubTab] = ge.useState("customer");const [orderToDelete, setOrderToDelete] = ge.useState(null);const [newCatEmoji, setNewCatEmoji] = ge.useState("");const [selectedSalesmanFilter, setSelectedSalesmanFilter] = ge.useState("all");const [selectedBrand, setSelectedBrand] = ge.useState("All");const [customBrands, setCustomBrands] = ge.useState(()=>{const defaults=["Reckitt Benckiser","Marico","McVitie's"];const stored=localStorage.getItem("kmart_custom_brands");if(stored){try{const parsed=JSON.parse(stored);if(Array.isArray(parsed)){return Array.from(new Set(parsed.map(x=>x.trim()).filter(Boolean)));}}catch(e){}}return defaults;});const [newBrandName, setNewBrandName] = ge.useState("");const [showNewBrandInput, setShowNewBrandInput] = ge.useState(!1);const [brandToDelete, setBrandToDelete] = ge.useState(null);

  // NEW Salesman states
  const [salesmenList, setSalesmenList] = ge.useState([]);
  const [selectedSalesman, setSelectedSalesman] = ge.useState(() => {
    const stored = localStorage.getItem("kmart_salesman");
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    return null;
  });
  const [salesmanSelId, setSalesmanSelId] = ge.useState("");
  const [beatCustomers, setBeatCustomers] = ge.useState([]);
  const [salesmanTab, setSalesmanTab] = ge.useState("catalogue");
  const [salesmanOrders, setSalesmanOrders] = ge.useState([]);

  // NEW Admin states
  const [adminSalesmen, setAdminSalesmen] = ge.useState([]);
  const [adminSalesmanName, setAdminSalesmanName] = ge.useState("");
  const [adminSalesmanPin, setAdminSalesmanPin] = ge.useState("");const [adminSalesmanVisionId, setAdminSalesmanVisionId] = ge.useState("");const [editingSalesman, setEditingSalesman] = ge.useState(null);const [editSalesmanName, setEditSalesmanName] = ge.useState("");const [editSalesmanPin, setEditSalesmanPin] = ge.useState("");const [editSalesmanVisionId, setEditSalesmanVisionId] = ge.useState("");
  const [adminOrders, setAdminOrders] = ge.useState([]);
  const [adminTab, setAdminTab] = ge.useState("products");

  // Helper to sort products alphabetically by category first, then by name
  const sortProducts = (list) => {
    return [...list].sort((a, b) => {
      const catCompare = a.cat.localeCompare(b.cat);
      if (catCompare !== 0) return catCompare;
      return a.name.localeCompare(b.name);
    });
  };

  // Helper to format order like message preview
  const getOrderPreviewText = (o) => {
    const J = new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
    const custName = o.customer_id && typeof o.customer_id === "object" ? o.customer_id.name : "Unknown Customer";
    
    const itemsText = o.items.map(it => {
      const rate = parseFloat(it.price) || 0;
      const lineTotal = rate * it.qty;
      const rateStr = rate % 1 === 0 ? String(rate) : rate.toFixed(2);
      const totalStr = lineTotal.toFixed(lineTotal % 1 === 0 ? 0 : 2);
      const discStr = it.discount ? `  |  Disc: ${it.discount}%` : "";
      return `• ${it.name} × ${it.qty} @ ₹${rateStr} = ₹${totalStr}${discStr}`;
    }).join("\n");

    const totalAmount = parseFloat(o.total_amount) || 0;
    const totalStr = totalAmount.toFixed(totalAmount % 1 === 0 ? 0 : 2);

    return `*📦 ORDER — ${custName}*
_${J}_

${itemsText}

*TOTAL: ₹${totalStr}*`;
  };

  // Sync URL with view state
  ge.useEffect(() => {
    const path = r === "customer" ? "/" : "/" + r;
    if (window.location.pathname !== path) {
      window.history.pushState(null, "", path);
    }
  }, [r]);

  // Handle browser navigation
  ge.useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      if (p.startsWith("/admin")) {
        if (se) {
          a("admin");
        } else {
          setAuthTarget("admin");
          tt("");
          pt(!1);
          Me(!0);
          if (slAuth) a("salesman");
          else a("customer");
        }
      } else if (p.startsWith("/salesman")) {
        if (se) {
          a("admin");
        } else if (slAuth) {
          a("salesman");
        } else {
          setAuthTarget("salesman");
          tt("");
          pt(!1);
          Me(!0);
          a("customer");
        }
      } else {
        if (se) {
          a("admin");
        } else if (slAuth) {
          a("salesman");
        } else {
          a("customer");
        }
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [se, slAuth]);

  // Load initial data
  ge.useEffect(() => {
    const loadInitialData = async () => {
      const { data: sList } = await Or.from("salesmen").select("*").order("name");
      if (sList) {
        setSalesmenList(sList);
        setAdminSalesmen(sList);
      }
      const { data: cList } = await Or.from("customers").select("*").order("name");
      if (cList) setBeatCustomers(cList);
      const { data: bList } = await Or.from("beats").select("*").order("name");
      if (bList) setDbBeats(bList.map(b => b.name));
    };
    loadInitialData();

    // Auto-login salesman
    const storedSl = localStorage.getItem("kmart_salesman");
    if (storedSl) {
      try {
        const parsed = JSON.parse(storedSl);
        setSelectedSalesman(parsed);
        setSlAuth(!0);
      } catch(e) {}
    }
  }, []);

  // Customer Orders and Name synchronization
  ge.useEffect(() => {
    if (cust) {
      H(cust.name);
      const fetchOrders = async () => {
        const { data, error } = await Or.from("orders").select("*, customer_id(name)").eq("customer_id", cust.id).order("created_at", { ascending: false });
        if (!error) setCustOrders(data || []);
      };
      fetchOrders();
    }
  }, [cust]);

  // Admin Orders loader
  ge.useEffect(() => {
    if (adminTab === "orders" && se) {
      const fetchAdminOrders = async () => {
        const { data, error } = await Or.from("orders").select("*, customer_id(name,phone,beat), salesman_id(name)").order("created_at", { ascending: false });
        if (!error) setAdminOrders(data || []);
      };
      fetchAdminOrders();
    }
  }, [adminTab, se]);

  ge.useEffect(() => {
    if (r === "salesman" && selectedSalesman && (salesmanTab === "orders" || salesmanOrders.length === 0)) {
      const fetchSalesmanOrders = async () => {
        const { data, error } = await Or.from("orders").select("*, customer_id(name,phone)").eq("salesman_id", selectedSalesman.id).order("created_at", { ascending: false });
        if (!error) setSalesmanOrders(data || []);
      };
      fetchSalesmanOrders();
    }
  }, [r, selectedSalesman, salesmanTab]);

  // Stylesheet and Fonts
  ge.useEffect(()=>{
    const j=document.createElement("link");
    return j.rel="stylesheet",j.href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap",document.head.appendChild(j),document.body.style.margin="0",document.body.style.fontFamily="'Outfit', sans-serif",document.body.style.background=C.bg,()=>{try{document.head.removeChild(j)}catch{}}
  },[]);

  // Fetch products
  const ue=ge.useCallback(async()=>{
    const{data:j,error:J}=await Or.from("products").select("*,product_batches(*)").order("id");
    if(J){console.error(J),h(!1);return}
    if(j&&j.length>0)l(sortProducts(j.map(yl)));
    else{
      const he=Fb.map(ce=>({name:ce.name,cat:ce.cat,unit:ce.unit,mrp:ce.mrp,tp:ce.tp,note:ce.desc??""})),{data:me}=await Or.from("products").insert(he).select();
      me&&l(sortProducts(me.map(yl)))
    }
    h(!1)
  },[]);

  ge.useEffect(()=>{ue()},[ue]);

  const ye=ge.useCallback(j=>{ke(j),setTimeout(()=>ke(""),2400)},[]),
  Pe=ge.useMemo(()=>["All",...Array.from(new Set(s.map(j=>j.cat)))],[s]),dbBrands=ge.useMemo(()=>["All",...Array.from(new Set(s.map(j=>j.brand).filter(Boolean)))],[s]),Ue=ge.useMemo(()=>s.filter(j=>(g==="All"||j.cat===g)&&(selectedBrand==="All"||j.brand===selectedBrand)&&(j.name.toLowerCase().includes(f.toLowerCase())||j.cat.toLowerCase().includes(f.toLowerCase())||(j.desc??"").toLowerCase().includes(f.toLowerCase()))),[s,f,g,selectedBrand]),
  Dn=ge.useMemo(()=>s.filter(j=>(adminCatFilter==="All"||j.cat===adminCatFilter)&&(j.name.toLowerCase().includes(B.toLowerCase())||j.cat.toLowerCase().includes(B.toLowerCase()))), [s,B,adminCatFilter]),
  tn=ge.useMemo(()=>Object.entries(v).reduce((j,[J,he])=>{
    const [prodIdStr,bchcodeStr]=J.split('_');
    const prodId=parseInt(prodIdStr);
    const bchcode=bchcodeStr?parseInt(bchcodeStr):0;
    const me=s.find(ce=>ce.id===prodId);
    if(!me)return j;
    let batchMrp=me.mrp;
    if(bchcode>0&&me.product_batches){
      const batch=me.product_batches.find(b=>b.bchcode===bchcode);
      if(batch)batchMrp=parseFloat(batch.mrp)||me.mrp;
    }
    if(r==="customer"){
      const base=me.customer_price>0?me.customer_price:batchMrp,price=(me.tier2_min_qty>0&&he>=me.tier2_min_qty)?me.tier2_price:base;
      return j+price*he
    }
    const disc=parseFloat(T[prodId])||0;
    let batchTp=me.tp;if(bchcode>0&&me.product_batches){const batch=me.product_batches.find(b=>b.bchcode===bchcode);if(batch&&batch.tp>0)batchTp=parseFloat(batch.tp)}return j+batchTp*he*(1-disc/100)
  },0),[v,s,T,r]),
  Ot=ge.useMemo(()=>Object.values(v).reduce((j,J)=>j+J,0),[v]),
  Nn=ge.useCallback((j,J)=>{
    b(he=>{
      const me=(he[j]||0)+J;
      if(me<=0){const{[j]:ce,...yt}=he;return yt}
      return{...he,[j]:me}
    });
    x(he=>{const{[j]:ce,...yt}=he;return yt})
  },[]),
  Nt=ge.useCallback((j,J)=>{
    b(he=>{
      if(J<=0){const{[j]:me,...ce}=he;return ce}
      return{...he,[j]:J}
    });
    x(he=>{const{[j]:ce,...yt}=he;return yt})
  },[]);

  const handleCustomerLogin=async()=>{
    if(!custNameInput.trim()||!custPhoneInput.trim()){ye("Please enter Name and Phone.");return}
    if(custPhoneInput.trim().le