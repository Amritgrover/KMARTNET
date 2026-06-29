const fs = require('fs');

const files = [
  'dist/assets/index-DYXXu0wA.js',
  'dist/assets/index-D0CI6L84.js'
];

files.forEach(file => {
  if (!fs.existsSync(file)) {
    console.error(`File not found: ${file}`);
    return;
  }

  // Read and normalize CRLF to LF
  let content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

  // 1. Inject States
  const targetState = 'const [neErr, setNeErr] = ge.useState(!1);';
  if (!content.includes(targetState)) {
    console.error(`Target state not found in ${file}`);
    return;
  }
  
  const newState = targetState + `
  const [isOnline, setIsOnline] = ge.useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = ge.useState(!1);
  const [offlineCount, setOfflineCount] = ge.useState(() => JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]").length);
  `;
  content = content.replace(targetState, newState);

  // 2. Wrap loadInitialData
  const targetLoad = `  // Load initial data
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
    loadInitialData();`;

  if (!content.includes(targetLoad)) {
    console.error(`Target loadInitialData not found in ${file}`);
    return;
  }

  const newLoad = `  // Load initial data
  ge.useEffect(() => {
    const loadInitialData = async () => {
      try {
        const { data: sList } = await Or.from("salesmen").select("*").order("name");
        if (sList) {
          localStorage.setItem("kmart_offline_salesmen", JSON.stringify(sList));
          setSalesmenList(sList);
          setAdminSalesmen(sList);
        }
      } catch (e) {
        const cached = localStorage.getItem("kmart_offline_salesmen");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setSalesmenList(parsed);
            setAdminSalesmen(parsed);
          } catch (err) {}
        }
      }

      try {
        const { data: cList } = await Or.from("customers").select("*").order("name");
        if (cList) {
          localStorage.setItem("kmart_offline_customers", JSON.stringify(cList));
          setBeatCustomers(cList);
        }
      } catch (e) {
        const cached = localStorage.getItem("kmart_offline_customers");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setBeatCustomers(parsed);
          } catch (err) {}
        }
      }

      try {
        const { data: bList } = await Or.from("beats").select("*").order("name");
        if (bList) {
          const beatsNames = bList.map(b => b.name);
          localStorage.setItem("kmart_offline_beats", JSON.stringify(beatsNames));
          setDbBeats(beatsNames);
        }
      } catch (e) {
        const cached = localStorage.getItem("kmart_offline_beats");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            setDbBeats(parsed);
          } catch (err) {}
        }
      }
    };
    loadInitialData();`;
  content = content.replace(targetLoad, newLoad);

  // 3. Wrap ue (fetch products)
  const targetUe = `  // Fetch products
  const ue=ge.useCallback(async()=>{
    const{data:j,error:J}=await Or.from("products").select("*,product_batches(*)").order("id");
    if(J){console.error(J),h(!1);return}
    const{data:bImgs}=await Or.from("brand_images").select("*");
    if(bImgs)setBrandImages(bImgs);
    if(j&&j.length>0)l(sortProducts(j.map(yl)));
    else{
      const he=Fb.map(ce=>({name:ce.name,cat:ce.cat,unit:ce.unit,mrp:ce.mrp,tp:ce.tp,note:ce.desc??""})),{data:me}=await Or.from("products").insert(he).select();
      me&&l(sortProducts(me.map(yl)))
    }
    h(!1)
  },[]);`;

  if (!content.includes(targetUe)) {
    console.error(`Target ue not found in ${file}`);
    return;
  }

  const newUe = `  // Fetch products
  const ue=ge.useCallback(async()=>{
    try {
      const{data:j,error:J}=await Or.from("products").select("*,product_batches(*)").order("id");
      if(J) throw J;
      const{data:bImgs}=await Or.from("brand_images").select("*");
      if(bImgs) {
        setBrandImages(bImgs);
        localStorage.setItem("kmart_offline_brand_images", JSON.stringify(bImgs));
      }
      if(j&&j.length>0) {
        l(sortProducts(j.map(yl)));
        localStorage.setItem("kmart_offline_products", JSON.stringify(j));
      } else {
        const he=Fb.map(ce=>({name:ce.name,cat:ce.cat,unit:ce.unit,mrp:ce.mrp,tp:ce.tp,note:ce.desc??""})),{data:me}=await Or.from("products").insert(he).select();
        if (me) {
          l(sortProducts(me.map(yl)));
          localStorage.setItem("kmart_offline_products", JSON.stringify(me));
        }
      }
    } catch(err) {
      console.error("Fetch products failed, trying offline cache:", err);
      const cachedProds = localStorage.getItem("kmart_offline_products");
      const cachedBImgs = localStorage.getItem("kmart_offline_brand_images");
      if (cachedBImgs) {
        try { setBrandImages(JSON.parse(cachedBImgs)); } catch(e) {}
      }
      if (cachedProds) {
        try {
          const parsed = JSON.parse(cachedProds);
          l(sortProducts(parsed.map(yl)));
          ye("Working offline (loaded cached products).");
        } catch(e) {
          ye("Offline: Failed to load cached products.");
        }
      } else {
        ye("Offline: No cached products found.");
      }
    }
    h(!1)
  },[ye]);`;
  content = content.replace(targetUe, newUe);

  // 4. Wrap fetchSalesmanOrders
  const targetSalesmanOrders = `  ge.useEffect(() => {
    if (r === "salesman" && selectedSalesman && (salesmanTab === "orders" || salesmanOrders.length === 0)) {
      const fetchSalesmanOrders = async () => {
        const { data, error } = await Or.from("orders").select("*, customer_id(name,phone)").eq("salesman_id", selectedSalesman.id).order("created_at", { ascending: false });
        if (!error) setSalesmanOrders(data || []);
      };
      fetchSalesmanOrders();
    }
  }, [r, selectedSalesman, salesmanTab]);`;

  if (!content.includes(targetSalesmanOrders)) {
    console.error(`Target fetchSalesmanOrders not found in ${file}`);
    return;
  }

  const newSalesmanOrders = `  ge.useEffect(() => {
    if (r === "salesman" && selectedSalesman && (salesmanTab === "orders" || salesmanOrders.length === 0)) {
      const fetchSalesmanOrders = async () => {
        try {
          const { data, error } = await Or.from("orders").select("*, customer_id(name,phone)").eq("salesman_id", selectedSalesman.id).order("created_at", { ascending: false });
          if (error) throw error;
          localStorage.setItem("kmart_offline_salesman_orders_" + selectedSalesman.id, JSON.stringify(data || []));
          
          const offlineOrders = JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]")
            .filter(o => o.salesman_id === selectedSalesman.id);
          setSalesmanOrders([...offlineOrders, ...(data || [])]);
        } catch(err) {
          console.error("Fetch orders failed, loading offline:", err);
          const cached = localStorage.getItem("kmart_offline_salesman_orders_" + selectedSalesman.id);
          const offlineOrders = JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]")
            .filter(o => o.salesman_id === selectedSalesman.id);
          if (cached) {
            try {
              setSalesmanOrders([...offlineOrders, ...JSON.parse(cached)]);
            } catch(e) {
              setSalesmanOrders(offlineOrders);
            }
          } else {
            setSalesmanOrders(offlineOrders);
          }
        }
      };
      fetchSalesmanOrders();
    }
  }, [r, selectedSalesman, salesmanTab]);`;
  content = content.replace(targetSalesmanOrders, newSalesmanOrders);

  const targetCustOrders = `  // Customer Orders and Name synchronization
  ge.useEffect(() => {
    if (cust) {
      H(cust.name);
      const fetchOrders = async () => {
        const { data, error } = await Or.from("orders").select("*, customer_id(name)").eq("customer_id", cust.id).order("created_at", { ascending: false });
        if (!error) setCustOrders(data || []);
      };
      fetchOrders();
    }
  }, [cust]);`;

  if (!content.includes(targetCustOrders)) {
    console.error(`Target fetchOrders not found in ${file}`);
    return;
  }

  const newCustOrders = `  // Customer Orders and Name synchronization
  ge.useEffect(() => {
    if (cust && r === "customer") {
      H(cust.name);
      const fetchOrders = async () => {
        try {
          const { data, error } = await Or.from("orders").select("*, customer_id(name)").eq("customer_id", cust.id).order("created_at", { ascending: false });
          if (error) throw error;
          localStorage.setItem("kmart_offline_customer_orders_" + cust.id, JSON.stringify(data || []));
          
          const offlineOrders = JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]")
            .filter(o => o.customer_id && o.customer_id.name === cust.name);
          setCustOrders([...offlineOrders, ...(data || [])]);
        } catch(err) {
          console.error("Fetch customer orders failed, loading offline:", err);
          const cached = localStorage.getItem("kmart_offline_customer_orders_" + cust.id);
          const offlineOrders = JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]")
            .filter(o => o.customer_id && o.customer_id.name === cust.name);
          if (cached) {
            try {
              setCustOrders([...offlineOrders, ...JSON.parse(cached)]);
            } catch(e) {
              setCustOrders(offlineOrders);
            }
          } else {
            setCustOrders(offlineOrders);
          }
        }
      };
      fetchOrders();
    }
  }, [cust, r]);`;
  content = content.replace(targetCustOrders, newCustOrders);

  // 6. Inject Offline listeners and syncOfflineOrders CALLBACK
  const targetAfterProductEffect = `  ge.useEffect(()=>{ue()},[ue]);`;
  if (!content.includes(targetAfterProductEffect)) {
    console.error(`Target product useEffect not found in ${file}`);
    return;
  }

  const newOfflineEffects = targetAfterProductEffect + `

  // Track online/offline status
  ge.useEffect(() => {
    const handleOnline = () => setIsOnline(!0);
    const handleOffline = () => setIsOnline(!1);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync offline orders callback
  const syncOfflineOrders = ge.useCallback(async () => {
    if (isSyncing || !navigator.onLine) return;
    const offlineOrders = JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]");
    if (offlineOrders.length === 0) {
      setOfflineCount(0);
      return;
    }

    setIsSyncing(!0);
    ye("🔄 Syncing offline orders...");

    const remainingOrders = [];
    let syncedCount = 0;

    for (const order of offlineOrders) {
      try {
        let finalCustId = order.actual_customer_id;
        
        // 1. If this was a new customer created offline, insert it now!
        if (!finalCustId && order.new_customer_data) {
          const { name, phone, beat } = order.new_customer_data;
          const { data: existing } = await Or.from("customers").select("id").eq("name", name);
          if (existing && existing.length > 0) {
            finalCustId = existing[0].id;
          } else {
            const { data: inserted, error: insErr } = await Or.from("customers").insert({ name, phone, beat }).select().single();
            if (insErr) throw insErr;
            finalCustId = inserted.id;
          }
        }

        // 2. Prepare order data
        const cleanOrder = {
          salesman_id: order.salesman_id,
          customer_id: finalCustId,
          source: order.source,
          items: order.items,
          total_amount: order.total_amount,
          status: "Pending",
          idempotency_key: order.idempotency_key
        };

        // 3. Insert order
        const { error: orderErr } = await Or.from("orders").insert(cleanOrder);
        if (orderErr) {
          if (!(orderErr.code === "23505" || (orderErr.message && orderErr.message.toLowerCase().includes("duplicate")))) {
            throw orderErr;
          }
        }
        syncedCount++;
      } catch (err) {
        console.error("Failed to sync offline order:", order.id, err);
        remainingOrders.push(order);
      }
    }

    localStorage.setItem("kmart_offline_orders", JSON.stringify(remainingOrders));
    setOfflineCount(remainingOrders.length);
    setIsSyncing(!1);

    if (syncedCount > 0) {
      ye("✅ Synced " + syncedCount + " offline order(s) successfully!");
      ue();
      if (r === "salesman" && selectedSalesman) {
        try {
          const { data } = await Or.from("orders").select("*, customer_id(name,phone)").eq("salesman_id", selectedSalesman.id).order("created_at", { ascending: false });
          if (data) {
            localStorage.setItem("kmart_offline_salesman_orders_" + selectedSalesman.id, JSON.stringify(data));
            setSalesmanOrders([...remainingOrders, ...data]);
          }
        } catch (e) {}
      }
    }
  }, [isSyncing, selectedSalesman, r, ue, ye]);

  // Trigger sync on online/mount
  ge.useEffect(() => {
    syncOfflineOrders();
    const handleOnlineSync = () => syncOfflineOrders();
    window.addEventListener("online", handleOnlineSync);
    const interval = setInterval(syncOfflineOrders, 30000);
    return () => {
      window.removeEventListener("online", handleOnlineSync);
      clearInterval(interval);
    };
  }, [syncOfflineOrders]);
  `;
  content = content.replace(targetAfterProductEffect, newOfflineEffects);

  // 7. Patch handleConfirmOrder for Offline fallback
  const targetConfirm = `    setIsSubmittingOrder(!0);

    let finalCustId = null;
    if (r === "customer") {
      finalCustId = cust.id;
    } else if (r === "salesman") {
      const name = z.trim();
      const { data: existing, error: findErr } = await Or.from("customers").select("*").eq("name", name);
      if (findErr) {
        ye("Database lookup failed. Try again.");
        console.error(findErr);
        setIsSubmittingOrder(!1);
        return;
      }
      if (existing && existing.length > 0) {
        finalCustId = existing[0].id;
      } else {
        let inserted = null, insErr = null;
        const insertRes = await Or.from("customers").insert({
          name,
          phone: newCustomerPhone.trim() || ("salesman-" + Date.now()),
          beat: selectedBeat
        }).select().single();
        inserted = insertRes.data;
        insErr = insertRes.error;
        if (insErr && (insErr.message && insErr.message.toLowerCase().includes("beat") || insErr.code === "PGRST204")) {
          const retryRes = await Or.from("customers").insert({
            name,
            phone: newCustomerPhone.trim() || ("salesman-" + Date.now())
          }).select().single();
          inserted = retryRes.data;
          insErr = retryRes.error;
        }
        if (insErr) {
          ye("Failed to register shop. Try again.");
          console.error(insErr);
          setIsSubmittingOrder(!1);
          return;
        }
        finalCustId = inserted.id;
        const { data: cList } = await Or.from("customers").select("*").order("name");
        if (cList) setBeatCustomers(cList);
      }
    }`;

  if (!content.includes(targetConfirm)) {
    console.error(`Target handleConfirmOrder customer lookup not found in ${file}`);
    return;
  }

  const newConfirm = `    setIsSubmittingOrder(!0);

    let finalCustId = null;
    let newCustData = null;
    let isOffline = !navigator.onLine;

    if (r === "customer") {
      finalCustId = cust.id;
    } else if (r === "salesman") {
      const name = z.trim();
      if (isOffline) {
        if (selectedCustomerId && selectedCustomerId !== "new") {
          finalCustId = parseInt(selectedCustomerId);
        } else {
          newCustData = {
            name,
            phone: newCustomerPhone.trim() || ("salesman-" + Date.now()),
            beat: selectedBeat
          };
        }
      } else {
        try {
          const { data: existing, error: findErr } = await Or.from("customers").select("*").eq("name", name);
          if (findErr) throw findErr;
          if (existing && existing.length > 0) {
            finalCustId = existing[0].id;
          } else {
            let inserted = null, insErr = null;
            const insertRes = await Or.from("customers").insert({
              name,
              phone: newCustomerPhone.trim() || ("salesman-" + Date.now()),
              beat: selectedBeat
            }).select().single();
            inserted = insertRes.data;
            insErr = insertRes.error;
            if (insErr && (insErr.message && insErr.message.toLowerCase().includes("beat") || insErr.code === "PGRST204")) {
              const retryRes = await Or.from("customers").insert({
                name,
                phone: newCustomerPhone.trim() || ("salesman-" + Date.now())
              }).select().single();
              inserted = retryRes.data;
              insErr = retryRes.error;
            }
            if (insErr) throw insErr;
            finalCustId = inserted.id;
            const { data: cList } = await Or.from("customers").select("*").order("name");
            if (cList) setBeatCustomers(cList);
          }
        } catch(err) {
          console.error("Online lookup failed, checking offline state:", err);
          if (err.message && (err.message.includes("fetch") || err.status === 0 || !navigator.onLine)) {
            isOffline = true;
            if (selectedCustomerId && selectedCustomerId !== "new") {
              finalCustId = parseInt(selectedCustomerId);
            } else {
              newCustData = {
                name,
                phone: newCustomerPhone.trim() || ("salesman-" + Date.now()),
                beat: selectedBeat
              };
            }
          } else {
            ye("Database lookup failed. Try again.");
            setIsSubmittingOrder(!1);
            return;
          }
        }
      }
    }`;
  content = content.replace(targetConfirm, newConfirm);

  // 8. Wrap orders insert logic for Offline fallback
  const targetOrderInsert = `    let result = await Or.from("orders").insert(orderDataWithIdemp).select();
    let insertErr = result.error;
    let insertData = result.data;`;

  if (!content.includes(targetOrderInsert)) {
    console.error(`Target orders insert not found in ${file}`);
    return;
  }

  const newOrderInsert = `    let result = null;
    let insertErr = null;
    let insertData = null;

    try {
      if (!isOffline) {
        result = await Or.from("orders").insert(orderDataWithIdemp).select();
        insertErr = result.error;
        insertData = result.data;
      }
    } catch(err) {
      console.error("Order placement failed, trying offline fallback:", err);
      insertErr = { message: "Network error", networkError: true };
    }

    const actuallyOffline = isOffline || (insertErr && (insertErr.networkError || insertErr.message === "TypeError: Failed to fetch" || insertErr.message.includes("fetch") || insertErr.status === 0));

    if (actuallyOffline) {
      const offlineOrders = JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]");
      const offlineId = "offline-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9);
      const newOfflineOrder = {
        id: offlineId,
        ...orderDataWithIdemp,
        created_at: new Date().toISOString(),
        customer_id: { name: r === "salesman" ? z.trim() : (cust ? cust.name : "Offline Customer") },
        actual_customer_id: finalCustId,
        new_customer_data: newCustData,
        status: "Pending Sync",
        is_offline: true
      };

      offlineOrders.push(newOfflineOrder);
      localStorage.setItem("kmart_offline_orders", JSON.stringify(offlineOrders));
      setOfflineCount(offlineOrders.length);

      if (r === "salesman") {
        setSalesmanOrders(prev => [newOfflineOrder, ...prev]);
      } else if (r === "customer") {
        setCustOrders(prev => [newOfflineOrder, ...prev]);
      }

      ye("💾 Saved offline! Will sync when connection restores.");
      b({});
      x({});
      H(r === "customer" && cust ? cust.name : "");
      setNeErr(!1);
      $(!1);
      setIsSubmittingOrder(!1);
      setSelectedCustomerId("");
      setNewCustomerName("");
      setNewCustomerPhone("");
      setCheckoutToken("chk-" + Date.now() + "-" + Math.random().toString(36).substring(2, 9));
      return;
    }`;
  content = content.replace(targetOrderInsert, newOrderInsert);

  // 9. Inject UI Banner inside the main view container
  const targetContainerStart = `      r!=="admin"&&r!=="delivery"&&S.jsxs("div",{
        style:{padding:16},
        children:[`;

  if (!content.includes(targetContainerStart)) {
    console.error(`Target main padding container not found in ${file}`);
    return;
  }

  const newContainerStart = targetContainerStart + `
          (!isOnline || offlineCount > 0) && S.jsxs("div", {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: !isOnline ? "#fff3cd" : "#d1ecf1",
              border: !isOnline ? "1px solid #ffeeba" : "1px solid #bee5eb",
              color: !isOnline ? "#856404" : "#0c5460",
              padding: "10px 14px",
              borderRadius: 12,
              marginBottom: 14,
              fontSize: 13,
              fontWeight: 600,
              boxShadow: "0 2px 6px rgba(0,0,0,0.04)"
            },
            children: [
              S.jsxs("div", {
                style: { display: "flex", alignItems: "center", gap: 8 },
                children: [
                  S.jsx("span", { style: { fontSize: 16 }, children: !isOnline ? "⚠️" : "🔄" }),
                  S.jsx("span", {
                    children: !isOnline
                      ? "Working Offline. Orders will be saved locally."
                      : "Online — " + offlineCount + " offline order(s) pending sync."
                  })
                ]
              }),
              isOnline && offlineCount > 0 && S.jsx("button", {
                onClick: syncOfflineOrders,
                disabled: isSyncing,
                style: {
                  background: C.primary,
                  color: "#fff",
                  border: "none",
                  padding: "5px 12px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  opacity: isSyncing ? 0.6 : 1,
                  fontFamily: "'Outfit', sans-serif"
                },
                children: isSyncing ? "Syncing..." : "Sync Now"
              })
            ]
          }),`;
  content = content.replace(targetContainerStart, newContainerStart);

  // Write changes
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ Successfully patched offline support into ${file}`);
});
