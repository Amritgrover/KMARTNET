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

  // 1. Inject States (right after offlineCount state)
  const targetState = `  const [offlineCount, setOfflineCount] = ge.useState(() => JSON.parse(localStorage.getItem("kmart_offline_orders") || "[]").length);`;
  if (!content.includes(targetState)) {
    console.error(`Target state not found in ${file}`);
    return;
  }

  const newState = targetState + `
  const [deliveryPersonsList, setDeliveryPersonsList] = ge.useState([]);
  const [tripsList, setTripsList] = ge.useState([]);
  const [selectedUnassignedOrders, setSelectedUnassignedOrders] = ge.useState([]);
  const [selectedTripDeliveryPerson, setSelectedTripDeliveryPerson] = ge.useState("");
  const [tripVehicleNo, setTripVehicleNo] = ge.useState("");
  const [unassignedOrdersList, setUnassignedOrdersList] = ge.useState([]);
  const [activeTripsTab, setActiveTripsTab] = ge.useState("builder");
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = ge.useState(() => {
    const stored = localStorage.getItem("kmart_delivery_person");
    if (stored) {
      try { return JSON.parse(stored); } catch(e) {}
    }
    return null;
  });
  const [activeTrip, setActiveTrip] = ge.useState(null);
  const [tripStops, setTripStops] = ge.useState([]);
  const [isCreatingTrip, setIsCreatingTrip] = ge.useState(!1);
  const [groupType, setGroupType] = ge.useState("beat");
  `;
  content = content.replace(targetState, newState);

  // 2. Append delivery_persons to loadInitialData
  const targetLoad = `      try {
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
      }`;

  if (!content.includes(targetLoad)) {
    console.error(`Target loadInitialData beats section not found in ${file}`);
    return;
  }

  const newLoad = targetLoad + `

      try {
        const { data: dList } = await Or.from("delivery_persons").select("*").order("name");
        if (dList) {
          localStorage.setItem("kmart_offline_delivery_persons", JSON.stringify(dList));
          setDeliveryPersonsList(dList);
        }
      } catch (e) {
        const cached = localStorage.getItem("kmart_offline_delivery_persons");
        if (cached) {
          try {
            setDeliveryPersonsList(JSON.parse(cached));
          } catch (err) {}
        }
      }`;
  content = content.replace(targetLoad, newLoad);

  // 3. Replace fetchDeliveryOrders useEffect with Active Trip Loader Effect
  const targetDeliveryOrdersEffect = `  ge.useEffect(() => {
    if (r === "delivery") {
      const fetchDeliveryOrders = async () => {
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

  // Wait! In step 3, targetDeliveryOrdersEffect is actually salesman orders fetch!
  // Let's locate the real target delivery orders effect in index-DYXXu0wA.js around line 1082:
  const realTargetDeliveryOrdersEffect = `  ge.useEffect(() => {
    if (r === "delivery") {
      const fetchDeliveryOrders = async () => {
        const { data, error } = await Or.from("orders").select("*, customer_id(id,name,phone,beat,location), salesman_id(name)").order("created_at", { ascending: false });
        if (!error) setDeliveryOrders(data || []);
      };
      fetchDeliveryOrders();
    }
  }, [r]);`;

  if (!content.includes(realTargetDeliveryOrdersEffect)) {
    console.error(`Target realTargetDeliveryOrdersEffect not found in ${file}`);
    return;
  }

  const newDeliveryOrdersEffect = `  // Active trip loader for Delivery Person
  ge.useEffect(() => {
    if (r === "delivery" && selectedDeliveryPerson) {
      const fetchActiveTrip = async () => {
        try {
          const { data: trips, error } = await Or.from("trips")
            .select("*, delivery_person_id(*)")
            .eq("delivery_person_id", selectedDeliveryPerson.id)
            .eq("status", "active")
            .limit(1);
          
          if (error) throw error;
          if (trips && trips.length > 0) {
            const trip = trips[0];
            setActiveTrip(trip);
            localStorage.setItem("kmart_offline_active_trip_" + selectedDeliveryPerson.id, JSON.stringify(trip));
            
            // Load stops
            const { data: stops, error: stopsErr } = await Or.from("trip_orders")
              .select("*, order_id(*, customer_id(id,name,phone,beat,location), salesman_id(name))")
              .eq("trip_id", trip.id)
              .order("stop_sequence");
            
            if (stopsErr) throw stopsErr;
            setTripStops(stops || []);
            localStorage.setItem("kmart_offline_trip_stops_" + trip.id, JSON.stringify(stops || []));
          } else {
            setActiveTrip(null);
            setTripStops([]);
          }
        } catch (err) {
          console.error("Failed to load active trip:", err);
          const cachedTrip = localStorage.getItem("kmart_offline_active_trip_" + selectedDeliveryPerson.id);
          if (cachedTrip) {
            try {
              const parsedTrip = JSON.parse(cachedTrip);
              setActiveTrip(parsedTrip);
              const cachedStops = localStorage.getItem("kmart_offline_trip_stops_" + parsedTrip.id);
              if (cachedStops) {
                setTripStops(JSON.parse(cachedStops));
              }
            } catch(e) {}
          }
        }
      };
      fetchActiveTrip();
    }
  }, [r, selectedDeliveryPerson]);`;
  content = content.replace(realTargetDeliveryOrdersEffect, newDeliveryOrdersEffect);

  // 4. Inject Admin Trip handlers & useEffect right before Admin Orders loader useEffect
  const targetAdminLoader = `  // Admin Orders loader
  ge.useEffect(() => {
    if (adminTab === "orders" && se) {`;

  if (!content.includes(targetAdminLoader)) {
    console.error(`Target Admin Orders loader not found in ${file}`);
    return;
  }

  const newAdminTripLogic = `  // Admin Trips Builder actions
  const handleCreateTrip = async () => {
    if (!selectedTripDeliveryPerson) {
      ye("Please select a delivery person.");
      return;
    }
    if (selectedUnassignedOrders.length === 0) {
      ye("Please select at least one order.");
      return;
    }
    setIsCreatingTrip(!0);

    try {
      const { data: newTrip, error: tripErr } = await Or.from("trips").insert({
        delivery_person_id: parseInt(selectedTripDeliveryPerson),
        vehicle_no: tripVehicleNo.trim() || null,
        status: "draft"
      }).select().single();

      if (tripErr) throw tripErr;

      const stopRecords = selectedUnassignedOrders.map((orderId, index) => ({
        trip_id: newTrip.id,
        order_id: orderId,
        stop_sequence: index + 1,
        status: "pending"
      }));

      const { error: stopsErr } = await Or.from("trip_orders").insert(stopRecords);
      if (stopsErr) throw stopsErr;

      ye("🎉 Trip created successfully as Draft!");
      setSelectedUnassignedOrders([]);
      setSelectedTripDeliveryPerson("");
      setTripVehicleNo("");
      
      // Refresh
      const { data: tList } = await Or.from("trips").select("*, delivery_person_id(*)").order("created_at", { ascending: false });
      if (tList) setTripsList(tList);
      const { data: assignedOrders } = await Or.from("trip_orders").select("order_id");
      const assignedSet = new Set(assignedOrders ? assignedOrders.map(x => x.order_id) : []);
      const { data: confirmedOrders } = await Or.from("orders").select("*, customer_id(name,phone,beat), salesman_id(name)").eq("status", "Pending");
      if (confirmedOrders) {
        const unassigned = confirmedOrders.filter(o => !assignedSet.has(o.id));
        setUnassignedOrdersList(unassigned);
      }
    } catch (err) {
      console.error(err);
      ye("Failed to create trip.");
    } finally {
      setIsCreatingTrip(!1);
    }
  };

  const handleActivateTrip = async (tripId) => {
    try {
      const { error } = await Or.from("trips").update({
        status: "active",
        activated_at: new Date().toISOString()
      }).eq("id", tripId);

      if (error) throw error;
      ye("🚀 Trip activated successfully!");
      const { data: tList } = await Or.from("trips").select("*, delivery_person_id(*)").order("created_at", { ascending: false });
      if (tList) setTripsList(tList);
    } catch(err) {
      console.error(err);
      ye("Failed to activate trip.");
    }
  };

  const handleCompleteTrip = async (tripId) => {
    try {
      const { error } = await Or.from("trips").update({
        status: "completed",
        completed_at: new Date().toISOString()
      }).eq("id", tripId);

      if (error) throw error;
      ye("🏁 Trip completed successfully!");
      setActiveTrip(null);
      setTripStops([]);
      setSelectedDeliveryPerson(null);
      localStorage.removeItem("kmart_delivery_person");
    } catch(err) {
      console.error(err);
      ye("Failed to complete trip.");
    }
  };

  // Trips data loader for Admin Trip Builder
  ge.useEffect(() => {
    if (adminTab === "trips" && se) {
      const fetchTripsData = async () => {
        try {
          const { data: dList } = await Or.from("delivery_persons").select("*").order("name");
          if (dList) setDeliveryPersonsList(dList);

          const { data: tList } = await Or.from("trips").select("*, delivery_person_id(*)").order("created_at", { ascending: false });
          if (tList) setTripsList(tList);

          const { data: assignedOrders } = await Or.from("trip_orders").select("order_id");
          const assignedSet = new Set(assignedOrders ? assignedOrders.map(x => x.order_id) : []);

          const { data: confirmedOrders } = await Or.from("orders").select("*, customer_id(name,phone,beat), salesman_id(name)").eq("status", "Pending");
          if (confirmedOrders) {
            const unassigned = confirmedOrders.filter(o => !assignedSet.has(o.id));
            setUnassignedOrdersList(unassigned);
          }
        } catch(err) {
          console.error(err);
        }
      };
      fetchTripsData();
    }
  }, [adminTab, se]);

  // Admin Orders loader
  ge.useEffect(() => {
    if (adminTab === "orders" && se) {`;
  content = content.replace(targetAdminLoader, newAdminTripLogic);

  // 5. Inject offline delivery outcomes sync logic
  const targetSyncHook = `  // Trigger sync on online/mount
  ge.useEffect(() => {
    syncOfflineOrders();
    const handleOnlineSync = () => syncOfflineOrders();
    window.addEventListener("online", handleOnlineSync);
    const interval = setInterval(syncOfflineOrders, 30000);
    return () => {
      window.removeEventListener("online", handleOnlineSync);
      clearInterval(interval);
    };
  }, [syncOfflineOrders]);`;

  if (!content.includes(targetSyncHook)) {
    console.error(`Target sync hook not found in ${file}`);
    return;
  }

  const newSyncHook = `  // Sync offline delivery outcomes callback
  const syncOfflineDeliveries = ge.useCallback(async () => {
    if (!navigator.onLine) return;
    const offlineSubmits = JSON.parse(localStorage.getItem("kmart_offline_delivery_submits") || "[]");
    if (offlineSubmits.length === 0) return;

    const remainingSubmits = [];
    let syncedCount = 0;

    for (const submit of offlineSubmits) {
      try {
        const { error: ordErr } = await Or.from("orders").update(submit.payload).eq("id", submit.parent_order_id);
        if (ordErr) throw ordErr;

        const { error: stopErr } = await Or.from("trip_orders").update(submit.stop_update).eq("id", submit.stop_id);
        if (stopErr) throw stopErr;

        syncedCount++;
      } catch (err) {
        console.error("Failed to sync offline delivery:", submit.stop_id, err);
        remainingSubmits.push(submit);
      }
    }

    localStorage.setItem("kmart_offline_delivery_submits", JSON.stringify(remainingSubmits));
    if (syncedCount > 0) {
      ye("✅ Synced " + syncedCount + " offline delivery outcome(s)!");
      if (activeTrip) {
        try {
          const { data: stops } = await Or.from("trip_orders")
            .select("*, order_id(*, customer_id(id,name,phone,beat,location), salesman_id(name))")
            .eq("trip_id", activeTrip.id)
            .order("stop_sequence");
          if (stops) setTripStops(stops);
        } catch(e) {}
      }
    }
  }, [activeTrip, ye]);

  // Trigger sync on online/mount
  ge.useEffect(() => {
    syncOfflineOrders();
    syncOfflineDeliveries();
    const handleOnlineSync = () => {
      syncOfflineOrders();
      syncOfflineDeliveries();
    };
    window.addEventListener("online", handleOnlineSync);
    const interval = setInterval(() => {
      syncOfflineOrders();
      syncOfflineDeliveries();
    }, 30000);
    return () => {
      window.removeEventListener("online", handleOnlineSync);
      clearInterval(interval);
    };
  }, [syncOfflineOrders, syncOfflineDeliveries]);`;
  content = content.replace(targetSyncHook, newSyncHook);

  // 6. Refactor the complete Delivery Person Portal layout block (Line 2540 to 3051)
  const targetDeliveryBlockStart = `      r==="delivery"&&S.jsxs("div",{
        style:{padding:16, fontFamily:"'Outfit', sans-serif"},
        children:[`;

  const targetDeliveryBlockEnd = `      r==="admin"&&se&&S.jsxs("div",{`;

  const startIdx = content.indexOf(targetDeliveryBlockStart);
  const endIdx = content.indexOf(targetDeliveryBlockEnd);

  if (startIdx === -1 || endIdx === -1) {
    console.error(`Could not locate delivery rendering block bounds in ${file}`);
    return;
  }

  const newDeliveryViewCode = targetDeliveryBlockStart + `
          // 1. If no delivery person selected, show LOGIN SCREEN
          !selectedDeliveryPerson && S.jsxs("div", {
            style: { display: "flex", flexDirection: "column", gap: 14, maxWidth: 360, margin: "40px auto 0" },
            children: [
              S.jsxs("div", {
                style: { textAlign: "center", marginBottom: 10 },
                children: [
                  S.jsx("div", { style: { fontSize: 24, fontWeight: 800, color: C.primary }, children: "🚚 Delivery Login" }),
                  S.jsx("div", { style: { fontSize: 12, color: C.muted, marginTop: 4 }, children: "Select your name to see today's active trip" })
                ]
              }),
              S.jsxs("div", {
                style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 12, padding: 16 },
                children: [
                  S.jsxs("select", {
                    value: selectedDeliveryPerson ? String(selectedDeliveryPerson.id) : "",
                    onChange: e => {
                      const found = deliveryPersonsList.find(dp => String(dp.id) === e.target.value);
                      if (found) {
                        setSelectedDeliveryPerson(found);
                        localStorage.setItem("kmart_delivery_person", JSON.stringify(found));
                      }
                    },
                    style: { width: "100%", padding: "10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13.5, fontWeight: 600, color: C.text, outline: "none", fontFamily: "'Outfit', sans-serif" },
                    children: [
                      S.jsx("option", { value: "", children: "-- Select Your Name --" }),
                      deliveryPersonsList.filter(dp => dp.active).map(dp => S.jsx("option", { value: String(dp.id), children: dp.name }, dp.id))
                    ]
                  })
                ]
              })
            ]
          }),

          // 2. If logged in but no active trip
          selectedDeliveryPerson && !activeTrip && S.jsxs("div", {
            style: { textAlign: "center", padding: "40px 16px" },
            children: [
              S.jsx("div", { style: { fontSize: 48, marginBottom: 12 }, children: "💤" }),
              S.jsxs("div", { style: { fontSize: 16, fontWeight: 800, color: C.text }, children: ["Hi, ", selectedDeliveryPerson.name] }),
              S.jsx("div", { style: { fontSize: 13, color: C.muted, marginTop: 6, lineHeight: 1.5 }, children: "You do not have any active delivery trips assigned for today. Please contact the administrator to build and activate your trip." }),
              S.jsx("button", {
                onClick: () => {
                  setSelectedDeliveryPerson(null);
                  localStorage.removeItem("kmart_delivery_person");
                },
                style: { marginTop: 20, padding: "8px 16px", background: C.bg, border: \`1.5px solid \${C.border}\`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, color: C.text, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                children: "Logout / Change User"
              })
            ]
          }),

          // 3. Stop List View (activeTrip found and no stop selected)
          selectedDeliveryPerson && activeTrip && !activeStopOrder && (() => {
            const completedCount = tripStops.filter(s => s.status !== "pending").length;
            const cashToday = tripStops.reduce((sum, s) => {
              if ((s.status === "delivered" || s.status === "partial") && s.payment_mode === "Cash") {
                return sum + (s.payment_collected || 0);
              }
              return sum;
            }, 0);

            const allCompleted = tripStops.length > 0 && completedCount === tripStops.length;

            const stops = tripStops.map(o => {
              const order = o.order_id || {};
              const custInfo = order.customer_id || {};
              const coords = parseGPS(custInfo.location);
              let distance = null;
              if (userCoords && coords) {
                distance = getDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
              }
              return { stop: o, order, custInfo, coords, distance };
            });

            // Keep stops ordered by sequence
            stops.sort((a, b) => a.stop.stop_sequence - b.stop.stop_sequence);

            return S.jsxs("div", {
              children: [
                // Top Header Card
                S.jsxs("div", {
                  style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },
                  children: [
                    S.jsxs("div", {
                      children: [
                        S.jsxs("div", { style: { fontSize: 15, fontWeight: 800, color: C.text }, children: ["Trip #", activeTrip.id] }),
                        S.jsxs("div", { style: { fontSize: 12, color: C.muted, marginTop: 2 }, children: ["Vehicle: ", activeTrip.vehicle_no || "N/A"] }),
                        S.jsxs("div", { style: { fontSize: 11, color: C.muted, marginTop: 1 }, children: ["Stops: ", completedCount, "/", tripStops.length, " Completed"] })
                      ]
                    }),
                    allCompleted ? S.jsx("button", {
                      onClick: () => handleCompleteTrip(activeTrip.id),
                      style: { background: C.green, color: "#fff", border: "none", borderRadius: 20, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                      children: "Complete Trip"
                    }) : S.jsx("button", {
                      onClick: async () => {
                        const { data: stops } = await Or.from("trip_orders")
                          .select("*, order_id(*, customer_id(id,name,phone,beat,location), salesman_id(name))")
                          .eq("trip_id", activeTrip.id)
                          .order("stop_sequence");
                        if (stops) {
                          setTripStops(stops);
                          ye("Trip stops refreshed!");
                        }
                      },
                      style: { background: C.bg, border: \`1.5px solid \${C.border}\`, borderRadius: 20, padding: "6px 12px", fontSize: 11.5, fontWeight: 700, color: C.text, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                      children: "Refresh 🔄"
                    })
                  ]
                }),

                // Running cash collected card
                S.jsxs("div", {
                  style: { background: C.greenBg, border: \`1.5px solid \${C.green}40\`, borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },
                  children: [
                    S.jsxs("div", {
                      children: [
                        S.jsx("div", { style: { fontSize: 11, fontWeight: 700, color: C.primary, textTransform: "uppercase", letterSpacing: 0.5 }, children: "💵 Running Cash Collected" }),
                        S.jsx("div", { style: { fontSize: 20, fontWeight: 800, color: C.primary, marginTop: 2 }, children: un(cashToday) })
                      ]
                    }),
                    S.jsx("button", {
                      onClick: () => {
                        setSelectedDeliveryPerson(null);
                        localStorage.removeItem("kmart_delivery_person");
                      },
                      style: { background: "none", border: "none", color: C.red, fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                      children: "Logout"
                    })
                  ]
                }),

                S.jsx("div", { style: { fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 12 }, children: "Trip Delivery Stops" }),

                stops.length === 0 ? S.jsx("div", {
                  style: { textAlign: "center", color: C.muted, padding: "40px 0" },
                  children: "No stops assigned."
                }) : S.jsx("div", {
                  style: { display: "flex", flexDirection: "column", gap: 10 },
                  children: stops.map(stopObj => {
                    const stopRow = stopObj.stop;
                    const orderObj = stopObj.order;
                    const custObj = stopObj.custInfo;
                    const d = stopObj.distance;
                    const statusVal = stopRow.status;

                    let statusColor = C.muted;
                    let statusBg = C.bg;
                    let displayStatus = "Pending";
                    if (statusVal === "delivered") { statusColor = C.green; statusBg = C.greenBg; displayStatus = "Delivered"; }
                    else if (statusVal === "partial") { statusColor = C.accent; statusBg = C.accentLight; displayStatus = "Partial"; }
                    else if (statusVal === "failed") { statusColor = C.red; statusBg = C.redBg; displayStatus = "Failed"; }

                    const payModeText = stopRow.payment_mode ? \` | \${stopRow.payment_mode}\` : "";

                    return S.jsxs("div", {
                      onClick: () => {
                        setActiveStopOrder(stopRow);
                      },
                      style: { background: "#fff", border: \`1.5px solid \${C.border}\`, borderRadius: 14, padding: 14, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" },
                      children: [
                        S.jsxs("div", {
                          style: { display: "flex", flexDirection: "column", gap: 3, flex: 1, paddingRight: 10 },
                          children: [
                            S.jsxs("div", {
                              style: { display: "flex", alignItems: "center", gap: 6 },
                              children: [
                                S.jsx("span", { style: { fontWeight: 800, fontSize: 12, color: C.primary, background: C.bg, borderRadius: "50%", width: 22, height: 22, display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: [stopRow.stop_sequence] }),
                                S.jsx("span", { style: { fontWeight: 800, fontSize: 13.5, color: C.text }, children: custObj.name || "Unknown Shop" }),
                                S.jsx("span", {
                                  style: { fontSize: 10, fontWeight: 700, color: statusColor, background: statusBg, padding: "2px 6px", borderRadius: 4 },
                                  children: displayStatus
                                })
                              ]
                            }),
                            S.jsxs("div", {
                              style: { fontSize: 11.5, color: C.muted },
                              children: [
                                \`Beat: \${custObj.beat || "N/A"}\`,
                                stopObj.coords ? \` (\${stopObj.coords.lat.toFixed(5)}, \${stopObj.coords.lng.toFixed(5)})\` : " (No GPS)"
                              ]
                            }),
                            d !== null && S.jsxs("div", {
                              style: { fontSize: 11, fontWeight: 600, color: C.primary, marginTop: 2 },
                              children: [
                                "📍 ",
                                d < 1000 ? \`\${d.toFixed(0)}m away\` : \`\${(d/1000).toFixed(1)}km away\`
                              ]
                            })
                          ]
                        }),
                        S.jsxs("div", {
                          style: { textAlign: "right", flexShrink: 0 },
                          children: [
                            S.jsx("div", { style: { fontSize: 13.5, fontWeight: 800, color: C.primary }, children: un(orderObj.total_amount) }),
                            S.jsx("div", { style: { fontSize: 10, color: C.muted, marginTop: 2 }, children: displayStatus === "Pending" ? "Unpaid" : \`Paid\${payModeText}\` })
                          ]
                        })
                      ]
                    }, stopRow.id);
                  })
                })
              ]
            });
          })(),

          // 4. Per-Customer Stop Details / Execution View
          selectedDeliveryPerson && activeTrip && activeStopOrder && (() => {
            const o = activeStopOrder;
            const orderObj = o.order_id || {};
            const custInfo = orderObj.customer_id || {};
            const coords = parseGPS(custInfo.location);

            let distance = null;
            if (userCoords && coords) {
              distance = getDistance(userCoords.lat, userCoords.lng, coords.lat, coords.lng);
            }

            const isLocationMatch = distance !== null && distance <= 100;

            return S.jsxs("div", {
              children: [
                // Top Header Card
                S.jsxs("div", {
                  style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 14, padding: 14, marginBottom: 14 },
                  children: [
                    S.jsx("div", { style: { fontSize: 16, fontWeight: 800, color: C.text }, children: custInfo.name || "Unknown Shop" }),
                    S.jsxs("div", { style: { fontSize: 12, color: C.muted, marginTop: 4 }, children: ["Beat: ", custInfo.beat || "N/A", " | Phone: ", custInfo.phone ? S.jsx("a", { href: \`tel:\${custInfo.phone}\`, style: { color: C.primary, textDecoration: "none", fontWeight: 700 }, children: custInfo.phone }) : "N/A"] }),
                    
                    // Live proximity status
                    distance !== null ? S.jsxs("div", {
                      style: { display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, padding: "5px 10px", borderRadius: 8, background: isLocationMatch ? C.greenBg : C.redBg, border: isLocationMatch ? \`1px solid \${C.green}40\` : \`1px solid \${C.red}40\`, color: isLocationMatch ? C.green : C.red, fontSize: 11.5, fontWeight: 700 },
                      children: [
                        S.jsx("span", { children: isLocationMatch ? "✓ On Location" : "⚠️ Out of Range" }),
                        S.jsx("span", { style: { opacity: 0.8 }, children: \`(\${distance < 1000 ? \`\${distance.toFixed(0)}m\` : \`\${(distance/1000).toFixed(1)}km\`})\` })
                      ]
                    }) : S.jsx("div", {
                      style: { display: "inline-flex", alignItems: "center", gap: 5, marginTop: 10, padding: "5px 10px", borderRadius: 8, background: C.bg, border: \`1px solid \${C.border}\`, color: C.muted, fontSize: 11.5, fontWeight: 700 },
                      children: "📍 No GPS location tagged"
                    })
                  ]
                }),

                // Actions Selectors
                S.jsxs("div", {
                  style: { display: "flex", flexDirection: "column", gap: 14, background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 14, padding: 14, marginBottom: 14 },
                  children: [
                    S.jsxs("div", {
                      style: { display: "flex", flexDirection: "column", gap: 4 },
                      children: [
                        S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "DELIVERY STATUS" }),
                        S.jsxs("select", {
                          value: deliveryStatusOption,
                          onChange: e => {
                            setDeliveryStatusOption(e.target.value);
                            if (e.target.value === "Delivered") {
                              setDeliveredQties({});
                            }
                          },
                          style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", fontFamily: "'Outfit', sans-serif" },
                          children: [
                            S.jsx("option", { value: "Delivered", children: "Full Delivery" }),
                            S.jsx("option", { value: "Partial", children: "Partial Delivery" }),
                            S.jsx("option", { value: "Skipped", children: "Could Not Deliver" })
                          ]
                        })
                      ]
                    }),

                    // Non-delivery reasons
                    deliveryStatusOption === "Skipped" && S.jsxs("div", {
                      style: { display: "flex", flexDirection: "column", gap: 10 },
                      children: [
                        S.jsxs("div", {
                          style: { display: "flex", flexDirection: "column", gap: 4 },
                          children: [
                            S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "REASON FOR NON-DELIVERY" }),
                            S.jsxs("select", {
                              value: nonDeliveryReason,
                              onChange: e => setNonDeliveryReason(e.target.value),
                              style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", fontFamily: "'Outfit', sans-serif" },
                              children: [
                                S.jsx("option", { value: "Shop Closed", children: "Shop Closed" }),
                                S.jsx("option", { value: "Owner Not Available", children: "Owner Not Available" }),
                                S.jsx("option", { value: "Refused Delivery", children: "Refused Delivery" }),
                                S.jsx("option", { value: "Payment Issues", children: "Payment Issues" }),
                                S.jsx("option", { value: "Wrong Address", children: "Wrong Address" }),
                                S.jsx("option", { value: "Other", children: "Other (Specify)" })
                              ]
                            })
                          ]
                        }),
                        nonDeliveryReason === "Other" && S.jsx("input", {
                          type: "text",
                          value: otherReasonText,
                          onChange: e => setOtherReasonText(e.target.value),
                          placeholder: "Enter details...",
                          style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }
                        })
                      ]
                    })
                  ]
                }),

                // Items list for delivery
                deliveryStatusOption !== "Skipped" && S.jsxs("div", {
                  style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 14, padding: 14, marginBottom: 14 },
                  children: [
                    S.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: C.muted, marginBottom: 12 }, children: "ORDERED ITEMS" }),
                    S.jsx("div", {
                      style: { display: "flex", flexDirection: "column", gap: 12 },
                      children: orderObj.items.map(item => {
                        const rawVal = deliveredQties[item.id];
                        const dQty = rawVal === undefined ? item.qty : (parseInt(rawVal) || 0);
                        const isEditable = deliveryStatusOption === "Partial";

                        return S.jsxs("div", {
                          style: { display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1px solid \${C.border}50\`, paddingBottom: 8 },
                          children: [
                            S.jsxs("div", {
                              style: { flex: 1, paddingRight: 10 },
                              children: [
                                S.jsx("div", { style: { fontSize: 13, fontWeight: 600, color: C.text }, children: item.name }),
                                S.jsxs("div", { style: { fontSize: 11, color: C.muted, marginTop: 2 }, children: [\`Price: \${un(item.price)} | Ordered: \${item.qty}\`] })
                              ]
                            }),
                            isEditable ? S.jsxs("div", {
                              style: { display: "flex", alignItems: "center", gap: 6 },
                              children: [
                                S.jsx("button", {
                                  onClick: () => {
                                    setDeliveredQties(prev => ({ ...prev, [item.id]: Math.max(0, dQty - 1) }));
                                  },
                                  style: { width: 28, height: 28, borderRadius: 6, border: \`1.5px solid \${C.border}\`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, fontWeight: "bold" },
                                  children: "-"
                                }),
                                S.jsx("input", {
                                  type: "number",
                                  value: dQty,
                                  onChange: e => {
                                    const rawVal = e.target.value;
                                    if (rawVal === "") {
                                      setDeliveredQties(prev => ({ ...prev, [item.id]: "" }));
                                    } else {
                                      const val = parseInt(rawVal);
                                      if (!isNaN(val)) {
                                        setDeliveredQties(prev => ({ ...prev, [item.id]: Math.max(0, Math.min(item.qty, val)) }));
                                      }
                                    }
                                  },
                                  style: { width: 38, height: 26, borderRadius: 6, border: \`1.5px solid \${C.border}\`, textAlign: "center", fontSize: 13, fontWeight: 700, outline: "none", fontFamily: "'Outfit', sans-serif" }
                                }),
                                S.jsx("button", {
                                  onClick: () => {
                                    setDeliveredQties(prev => ({ ...prev, [item.id]: Math.min(item.qty, dQty + 1) }));
                                  },
                                  style: { width: 28, height: 28, borderRadius: 6, border: \`1.5px solid \${C.border}\`, background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontSize: 14, fontWeight: "bold" },
                                  children: "+"
                                })
                              ]
                            }) : S.jsx("span", {
                              style: { fontSize: 13.5, fontWeight: 700, color: C.text },
                              children: \`Delivered: \${dQty}\`
                            })
                          ]
                        }, item.id);
                      })
                    })
                  ]
                }),

                // Payment Collection Card
                deliveryStatusOption !== "Skipped" && S.jsxs("div", {
                  style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 14, padding: 14, marginBottom: 14, display: "flex", flexDirection: "column", gap: 12 },
                  children: [
                    S.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: C.muted }, children: "COLLECT PAYMENT" }),
                    S.jsxs("div", {
                      style: { display: "flex", gap: 8 },
                      children: ["Cash", "Cheque", "Credit"].map(mode => (
                        S.jsx("button", {
                          key: mode,
                          onClick: () => {
                            setPaymentMode(mode);
                            if (mode === "Credit") {
                              setCollectedAmount("0");
                            } else {
                              setCollectedAmount(String(Math.round(deliveredSubtotal)));
                            }
                          },
                          style: { flex: 1, padding: "8px 0", background: paymentMode === mode ? C.primary : C.bg, color: paymentMode === mode ? "#fff" : C.text, border: \`1px solid \${C.border}\`, borderRadius: 8, fontSize: 12.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                          children: mode
                        })
                      ))
                    }),

                    paymentMode !== "Credit" && S.jsxs("div", {
                      style: { display: "flex", flexDirection: "column", gap: 4 },
                      children: [
                        S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "AMOUNT COLLECTED (₹)" }),
                        S.jsx("input", {
                          type: "number",
                          value: collectedAmount,
                          onChange: e => setCollectedAmount(e.target.value),
                          style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 700, color: C.primary, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }
                        })
                      ]
                    }),

                    paymentMode === "Cheque" && S.jsxs("div", {
                      style: { display: "flex", flexDirection: "column", gap: 10 },
                      children: [
                        S.jsxs("div", {
                          style: { display: "flex", flexDirection: "column", gap: 4 },
                          children: [
                            S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "CHEQUE NUMBER" }),
                            S.jsx("input", {
                              type: "text",
                              value: chequeNo,
                              onChange: e => setChequeNo(e.target.value),
                              style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }
                            })
                          ]
                        }),
                        S.jsxs("div", {
                          style: { display: "flex", flexDirection: "column", gap: 4 },
                          children: [
                            S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "BANK NAME" }),
                            S.jsx("input", {
                              type: "text",
                              value: chequeBank,
                              onChange: e => setChequeBank(e.target.value),
                              style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                // Submit Button
                S.jsx("button", {
                  onClick: async () => {
                    const amt = Number(collectedAmount) || 0;
                    const finalStatus = deliveryStatusOption;
                    const finalReason = finalStatus === "Skipped" ? (nonDeliveryReason === "Other" ? otherReasonText : nonDeliveryReason) : "";
                    
                    const payload = {
                      delivery_status: finalStatus,
                      delivered_items: orderObj.items.map(item => ({
                        ...item,
                        delivered_qty: (() => {
                          const val = deliveredQties[item.id];
                          return val === undefined ? item.qty : (parseInt(val) || 0);
                        })()
                      })),
                      payment_mode: finalStatus !== "Skipped" ? paymentMode : null,
                      collected_amount: finalStatus !== "Skipped" ? amt : 0,
                      cheque_no: finalStatus !== "Skipped" && paymentMode === "Cheque" ? chequeNo : null,
                      cheque_bank: finalStatus !== "Skipped" && paymentMode === "Cheque" ? chequeBank : null,
                      non_delivery_reason: finalReason,
                      delivered_at: new Date().toISOString(),
                      status: finalStatus === "Skipped" ? "Cancelled" : "Delivered"
                    };

                    const stopStatusMap = {
                      "Delivered": "delivered",
                      "Partial": "partial",
                      "Skipped": "failed"
                    };
                    const stop_update = {
                      status: stopStatusMap[finalStatus] || "delivered",
                      payment_collected: finalStatus !== "Skipped" ? amt : 0,
                      payment_mode: finalStatus !== "Skipped" ? paymentMode : null,
                      notes: finalReason || null,
                      delivered_at: new Date().toISOString()
                    };

                    const actuallyOffline = !navigator.onLine;

                    if (actuallyOffline) {
                      const offlineSubmits = JSON.parse(localStorage.getItem("kmart_offline_delivery_submits") || "[]");
                      offlineSubmits.push({
                        stop_id: o.id,
                        parent_order_id: orderObj.id,
                        payload: payload,
                        stop_update: stop_update
                      });
                      localStorage.setItem("kmart_offline_delivery_submits", JSON.stringify(offlineSubmits));
                      
                      // Apply locally
                      setTripStops(prev => prev.map(s => s.id === o.id ? { ...s, status: stop_update.status, payment_collected: stop_update.payment_collected, payment_mode: stop_update.payment_mode, notes: stop_update.notes, delivered_at: stop_update.delivered_at } : s));

                      ye("💾 Saved offline! Will sync when connection restores.");
                      setActiveStopOrder(null);
                      return;
                    }

                    const { error } = await Or.from("orders").update(payload).eq("id", orderObj.id);
                    if (error) {
                      ye("Failed to update order. Try again.");
                      console.error(error);
                      return;
                    }

                    const { error: stopErr } = await Or.from("trip_orders").update(stop_update).eq("id", o.id);
                    if (stopErr) {
                      console.error("Stop update failed:", stopErr);
                    }

                    ye("Delivery processed successfully!");
                    setActiveStopOrder(null);
                    
                    // Refresh stops
                    if (activeTrip) {
                      const { data: stops } = await Or.from("trip_orders")
                        .select("*, order_id(*, customer_id(id,name,phone,beat,location), salesman_id(name))")
                        .eq("trip_id", activeTrip.id)
                        .order("stop_sequence");
                      if (stops) setTripStops(stops);
                    }
                  },
                  style: { width: "100%", padding: "12px 0", border: "none", borderRadius: 10, background: C.primary, color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer", fontFamily: "'Outfit', sans-serif", boxShadow: "0 2px 10px rgba(20,83,45,0.2)" },
                  children: "💾 Confirm & Submit Delivery"
                })
              ]
            });
          })()
        ]
      }),
`;

  const partBefore = content.substring(0, startIdx);
  const partAfter = content.substring(endIdx);
  content = partBefore + newDeliveryViewCode + partAfter;

  // 7. Inject Trips Tab button into Admin Tab Bar
  const targetAdminTabBar = `[["products", "📦 Products"], ["customers", "🏪 Customers"], ["salesmen", "💼 Salesmen"], ["orders", "📋 Orders"], ["brands", "🏷️ Brands"]]`;
  if (!content.includes(targetAdminTabBar)) {
    console.error(`Target Admin Tab Bar not found in ${file}`);
    return;
  }
  const newAdminTabBar = `[["products", "📦 Products"], ["customers", "🏪 Customers"], ["salesmen", "💼 Salesmen"], ["orders", "📋 Orders"], ["brands", "🏷️ Brands"], ["trips", "🚚 Trips"]]`;
  content = content.replace(targetAdminTabBar, newAdminTabBar);

  // 8. Inject Trips Tab render block inside Admin render blocks
  const targetAdminBrandsEnd = `              S.jsx("div", {
                children: Array.from(new Set([...s.map(p => p.brand).filter(Boolean), ...brandImages.map(bi => bi.brand)])).map(b => {
                  const foundLogo = brandImages.find(bi => bi.brand === b);
                  const logoUrl = foundLogo ? foundLogo.image_url : "";
                  return S.jsxs("div", {
                    style: { display: "flex", alignItems: "center", justifyContent: "space-between", background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 12, padding: "10px 14px", marginBottom: 10 },
                    children: [
                      S.jsxs("div", {
                        style: { display: "flex", alignItems: "center", gap: 12 },
                        children: [
                          logoUrl ? S.jsx("img", { src: logoUrl, style: { width: 36, height: 36, borderRadius: "50%", objectFit: "cover", border: \`1px solid \${C.border}\`} }) 
                                  : S.jsx("div", { style: { width: 36, height: 36, borderRadius: "50%", background: C.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: C.primary }, children: b.charAt(0).toUpperCase() }),
                          S.jsx("span", { style: { fontWeight: 700, color: C.text, fontSize: 13.5 }, children: b })
                        ]
                      }),
                      S.jsxs("div", {
                        style: { display: "flex", alignItems: "center", gap: 10 },
                        children: [
                          S.jsxs("label", {
                            style: { display: "inline-flex", alignItems: "center", gap: 4, background: C.primaryLight, color: C.primary, padding: "5px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                            children: [
                              S.jsx("span", { children: logoUrl ? "Change Logo" : "Upload Logo" }),
                              S.jsx("input", {
                                type: "file",
                                accept: "image/*",
                                onChange: async (e) => {
                                  if (e.target.files && e.target.files[0]) {
                                    const file = e.target.files[0];
                                    const ext = file.name.split(".").pop();
                                    const fileName = \`brand_\${Date.now()}.\${ext}\`;
                                    const { data: upData, error: upErr } = await Or.storage.from("product-images").upload(fileName, file, { cacheControl: "3600", upsert: false });
                                    if (upErr) { ye("Upload failed: " + upErr.message); return; }
                                    const { data: urlData } = Or.storage.from("product-images").getPublicUrl(fileName);
                                    const newLogoUrl = urlData.publicUrl;
                                    const { data: updated, error } = await Or.from("brand_images").upsert({ brand: b, image_url: newLogoUrl }).select().single();
                                    if (error) {
                                      ye("Failed to update logo: " + error.message);
                                    } else {
                                      setBrandImages(prev => {
                                        const filtered = prev.filter(x => x.brand !== b);
                                        return [...filtered, updated];
                                      });
                                      ye(\`Updated logo for "\${b}"!\`);
                                    }
                                  }
                                },
                                style: { display: "none" }
                              })
                            ]
                          }),
                          logoUrl && S.jsx("button", {
                            onClick: async () => {
                              const { error } = await Or.from("brand_images").delete().eq("brand", b);
                              if (error) {
                                ye("Failed to delete: " + error.message);
                              } else {
                                setBrandImages(prev => prev.filter(x => x.brand !== b));
                                ye(\`Deleted logo for "\${b}"\`);
                              }
                            },
                            style: { background: "none", border: "none", color: C.red, fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                            children: "Delete"
                          })
                        ]
                      })
                    ]
                  }, b);
                })
              })
            ]
          })`;

  const startBrandsIdx = content.indexOf(targetAdminBrandsEnd);
  if (startBrandsIdx === -1) {
    console.error(`Target Admin Brands End not found in ${file}`);
    return;
  }

  // We will insert our adminTab === "trips" block right after the Brands block
  const adminTripsBlock = `,
          adminTab === "trips" && S.jsxs("div", {
            children: [
              S.jsxs("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
                children: [
                  S.jsxs("div", {
                    children: [
                      S.jsx("div", { style: { fontSize: 16, fontWeight: 800, color: C.text }, children: "Delivery Dispatch & Trips" }),
                      S.jsxs("div", { style: { fontSize: 12, color: C.muted }, children: [tripsList.length + " trips created"] })
                    ]
                  }),
                  S.jsxs("div", {
                    style: { display: "flex", background: C.bg, padding: 3, borderRadius: 8, gap: 4 },
                    children: [
                      S.jsx("button", {
                        onClick: () => setActiveTripsTab("builder"),
                        style: {
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: activeTripsTab === "builder" ? "#fff" : "transparent",
                          color: activeTripsTab === "builder" ? C.primary : C.muted,
                          boxShadow: activeTripsTab === "builder" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                          fontFamily: "'Outfit', sans-serif"
                        },
                        children: "Trip Builder"
                      }),
                      S.jsx("button", {
                        onClick: () => setActiveTripsTab("list"),
                        style: {
                          padding: "5px 12px",
                          borderRadius: 6,
                          border: "none",
                          cursor: "pointer",
                          fontSize: 11.5,
                          fontWeight: 700,
                          background: activeTripsTab === "list" ? "#fff" : "transparent",
                          color: activeTripsTab === "list" ? C.primary : C.muted,
                          boxShadow: activeTripsTab === "list" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                          fontFamily: "'Outfit', sans-serif"
                        },
                        children: "Trips List"
                      })
                    ]
                  })
                ]
              }),

              activeTripsTab === "builder" ? S.jsxs("div", {
                style: { display: "flex", flexDirection: "column", gap: 14 },
                children: [
                  S.jsxs("div", {
                    style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 12, padding: 14, boxShadow: "0 1px 4px rgba(0,0,0,0.02)" },
                    children: [
                      S.jsx("div", { style: { fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 12 }, children: "Create New Delivery Trip" }),
                      S.jsxs("div", {
                        style: { display: "flex", flexDirection: "column", gap: 10 },
                        children: [
                          S.jsxs("div", {
                            style: { display: "flex", flexDirection: "column", gap: 4 },
                            children: [
                              S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "SELECT DELIVERY PERSON" }),
                              S.jsxs("select", {
                                value: selectedTripDeliveryPerson,
                                onChange: e => setSelectedTripDeliveryPerson(e.target.value),
                                style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", fontFamily: "'Outfit', sans-serif" },
                                children: [
                                  S.jsx("option", { value: "", children: "-- Select Delivery Person --" }),
                                  deliveryPersonsList.filter(dp => dp.active).map(dp => S.jsx("option", { value: String(dp.id), children: dp.name }, dp.id))
                                ]
                              })
                            ]
                          }),
                          S.jsxs("div", {
                            style: { display: "flex", flexDirection: "column", gap: 4 },
                            children: [
                              S.jsx("label", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: "VEHICLE NO" }),
                              S.jsx("input", {
                                type: "text",
                                value: tripVehicleNo,
                                onChange: e => setTripVehicleNo(e.target.value),
                                placeholder: "e.g. PB-02-AX-1234",
                                style: { width: "100%", padding: "8px 10px", borderRadius: 8, border: \`1.5px solid \${C.border}\`, fontSize: 13, fontWeight: 600, color: C.text, outline: "none", boxSizing: "border-box", fontFamily: "'Outfit', sans-serif" }
                              })
                            ]
                          }),
                          S.jsxs("div", {
                            style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8, paddingTop: 10, borderTop: \`1px solid \${C.border}60\` },
                            children: [
                              S.jsxs("div", {
                                children: [
                                  S.jsxs("div", { style: { fontSize: 11, fontWeight: 700, color: C.muted }, children: ["SELECTED STOPS: ", selectedUnassignedOrders.length] }),
                                  S.jsxs("div", { style: { fontSize: 14, fontWeight: 800, color: C.primary, marginTop: 1 }, children: ["Total Value: ", un(unassignedOrdersList.filter(o => selectedUnassignedOrders.includes(o.id)).reduce((sum, o) => sum + (o.total_amount || 0), 0))] })
                                ]
                              }),
                              S.jsx("button", {
                                onClick: handleCreateTrip,
                                disabled: isCreatingTrip || selectedUnassignedOrders.length === 0 || !selectedTripDeliveryPerson,
                                style: { padding: "9px 18px", background: C.primary, color: "#fff", border: "none", borderRadius: 9, fontSize: 12.5, fontWeight: 700, cursor: "pointer", opacity: (isCreatingTrip || selectedUnassignedOrders.length === 0 || !selectedTripDeliveryPerson) ? 0.6 : 1, fontFamily: "'Outfit', sans-serif" },
                                children: isCreatingTrip ? "Creating..." : "Create Trip Draft"
                              })
                            ]
                          })
                        ]
                      })
                    ]
                  }),

                  S.jsxs("div", {
                    children: [
                      S.jsxs("div", {
                        style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
                        children: [
                          S.jsx("div", { style: { fontSize: 14, fontWeight: 800, color: C.text }, children: "Confirmed Unassigned Orders" }),
                          S.jsxs("div", {
                            style: { display: "flex", background: C.bg, padding: 3, borderRadius: 6, gap: 4 },
                            children: [
                              S.jsx("button", {
                                onClick: () => setGroupType("beat"),
                                style: {
                                  padding: "3px 8px",
                                  borderRadius: 4,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  background: groupType === "beat" ? "#fff" : "transparent",
                                  color: groupType === "beat" ? C.primary : C.muted,
                                  fontFamily: "'Outfit', sans-serif"
                                },
                                children: "By Beat"
                              }),
                              S.jsx("button", {
                                onClick: () => setGroupType("salesman"),
                                style: {
                                  padding: "3px 8px",
                                  borderRadius: 4,
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: 10.5,
                                  fontWeight: 700,
                                  background: groupType === "salesman" ? "#fff" : "transparent",
                                  color: groupType === "salesman" ? C.primary : C.muted,
                                  fontFamily: "'Outfit', sans-serif"
                                },
                                children: "By Salesman"
                              })
                            ]
                          })
                        ]
                      }),

                      (() => {
                        const groups = {};
                        unassignedOrdersList.forEach(o => {
                          const key = groupType === "beat"
                            ? (o.customer_id?.beat || "Others")
                            : (o.salesman_id?.name || "Direct Customer");
                          if (!groups[key]) groups[key] = [];
                          groups[key].push(o);
                        });

                        const groupKeys = Object.keys(groups).sort();
                        if (groupKeys.length === 0) {
                          return S.jsx("div", { style: { textAlign: "center", padding: "30px 0", color: C.muted, fontSize: 13 }, children: "No unassigned orders available." });
                        }

                        return S.jsx("div", {
                          style: { display: "flex", flexDirection: "column", gap: 12 },
                          children: groupKeys.map(groupName => {
                            const groupOrders = groups[groupName];
                            const allGroupSelected = groupOrders.every(o => selectedUnassignedOrders.includes(o.id));
                            const groupTotalVal = groupOrders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

                            return S.jsxs("div", {
                              style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 12, overflow: "hidden" },
                              children: [
                                S.jsxs("div", {
                                  style: { background: C.bg, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: \`1px solid \${C.border}\` },
                                  children: [
                                    S.jsxs("div", {
                                      style: { display: "flex", alignItems: "center", gap: 8 },
                                      children: [
                                        S.jsx("input", {
                                          type: "checkbox",
                                          checked: allGroupSelected,
                                          onChange: () => {
                                            if (allGroupSelected) {
                                              setSelectedUnassignedOrders(prev => prev.filter(id => !groupOrders.map(o => o.id).includes(id)));
                                            } else {
                                              const orderIds = groupOrders.map(o => o.id);
                                              setSelectedUnassignedOrders(prev => Array.from(new Set([...prev, ...orderIds])));
                                            }
                                          },
                                          style: { cursor: "pointer" }
                                        }),
                                        S.jsxs("span", { style: { fontWeight: 800, fontSize: 13, color: C.text }, children: [groupName, " (", groupOrders.length, ")"] })
                                      ]
                                    }),
                                    S.jsx("span", { style: { fontWeight: 800, fontSize: 12.5, color: C.primary }, children: un(groupTotalVal) })
                                  ]
                                }),
                                S.jsx("div", {
                                  style: { padding: 10, display: "flex", flexDirection: "column", gap: 8 },
                                  children: groupOrders.map(o => {
                                    const isChecked = selectedUnassignedOrders.includes(o.id);
                                    const custName = o.customer_id?.name || "Unknown Shop";
                                    return S.jsxs("label", {
                                      style: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 8px", borderRadius: 8, background: isChecked ? C.primaryLight : "transparent", border: isChecked ? \`1px solid \${C.primary}30\` : \`1px solid transparent\`, cursor: "pointer", fontSize: 12.5 },
                                      children: [
                                        S.jsxs("div", {
                                          style: { display: "flex", alignItems: "center", gap: 8 },
                                          children: [
                                            S.jsx("input", {
                                              type: "checkbox",
                                              checked: isChecked,
                                              onChange: () => {
                                                if (isChecked) {
                                                  setSelectedUnassignedOrders(prev => prev.filter(id => id !== o.id));
                                                } else {
                                                  setSelectedUnassignedOrders(prev => [...prev, o.id]);
                                                }
                                              },
                                              style: { cursor: "pointer" }
                                            }),
                                            S.jsxs("div", {
                                              children: [
                                                S.jsx("div", { style: { fontWeight: 700, color: C.text }, children: custName }),
                                                S.jsxs("div", { style: { fontSize: 10.5, color: C.muted, marginTop: 1 }, children: [o.items.length, " items · ", o.salesman_id?.name || "Self", " · ", new Date(o.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })] })
                                              ]
                                            })
                                          ]
                                        }),
                                        S.jsx("div", { style: { fontWeight: 700, color: C.primary }, children: un(o.total_amount) })
                                      ]
                                    }, o.id);
                                  })
                                })
                              ]
                            }, groupName);
                          })
                        });
                      })()
                    ]
                  })
                ]
              }) : S.jsxs("div", {
                style: { display: "flex", flexDirection: "column", gap: 12 },
                children: [
                  tripsList.length === 0 ? S.jsx("div", { style: { textAlign: "center", padding: "40px 0", color: C.muted, fontSize: 13.5 }, children: "No trips found." }) : tripsList.map(t => {
                    const dpName = t.delivery_person_id?.name || "Unassigned";
                    const formattedDate = new Date(t.trip_date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
                    
                    let statusColor = C.muted;
                    let statusBg = C.bg;
                    if (t.status === "active") { statusColor = C.accent; statusBg = C.accentLight; }
                    else if (t.status === "completed") { statusColor = C.green; statusBg = C.greenBg; }

                    return S.jsxs("div", {
                      style: { background: "#fff", border: \`1px solid \${C.border}\`, borderRadius: 12, padding: 14, display: "flex", justifyContent: "space-between", alignItems: "center" },
                      children: [
                        S.jsxs("div", {
                          style: { display: "flex", flexDirection: "column", gap: 4 },
                          children: [
                            S.jsxs("div", {
                              style: { display: "flex", alignItems: "center", gap: 8 },
                              children: [
                                S.jsxs("span", { style: { fontWeight: 800, fontSize: 14, color: C.text }, children: ["Trip #", t.id] }),
                                S.jsx("span", {
                                  style: { fontSize: 10, fontWeight: 700, color: statusColor, background: statusBg, padding: "2px 6px", borderRadius: 4 },
                                  children: t.status.toUpperCase()
                                })
                              ]
                            }),
                            S.jsxs("div", { style: { fontSize: 12, color: C.muted }, children: ["Person: ", S.jsx("strong", { style: { color: C.text }, children: dpName }), " | Vehicle: ", t.vehicle_no || "N/A"] }),
                            S.jsxs("div", { style: { fontSize: 11, color: C.muted }, children: ["Created: ", formattedDate, t.activated_at ? \` · Active: \${new Date(t.activated_at).toLocaleDateString("en-IN", { hour: "2-digit", minute: "2-digit" })}\` : ""] })
                          ]
                        }),
                        t.status === "draft" ? S.jsx("button", {
                          onClick: () => handleActivateTrip(t.id),
                          style: { padding: "6px 12px", background: C.accent, color: "#fff", border: "none", borderRadius: 8, fontSize: 11.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                          children: "Activate"
                        }) : null
                      ]
                    }, t.id);
                  })
                ]
              })
            ]
          })`;

  const partBeforeBrands = content.substring(0, startBrandsIdx + targetAdminBrandsEnd.length);
  const partAfterBrands = content.substring(startBrandsIdx + targetAdminBrandsEnd.length);
  content = partBeforeBrands + adminTripsBlock + partAfterBrands;

  // Write changes
  fs.writeFileSync(file, content, 'utf8');
  console.log(`✅ Successfully patched Trips Dispatch Flow into ${file}`);
});
