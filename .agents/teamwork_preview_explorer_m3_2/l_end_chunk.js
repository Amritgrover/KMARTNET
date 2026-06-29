us:18,padding:"24px 22px",zIndex:120,boxShadow:"0 8px 40px rgba(0,0,0,0.22)",fontFamily:"'Outfit', sans-serif"},
            children:[
              S.jsxs("div",{
                style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},
                children:[
                  S.jsx("div",{style:{fontSize:17,fontWeight:800,color:C.text},children:"Past Orders"}),
                  S.jsx("button",{
                    onClick:()=>setShowCustOrders(!1),
                    style:{border:"none",background:C.bg,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted},
                    children:ct.close
                  })
                ]
              }),
              custOrders.length===0?S.jsx("div",{style:{textAlign:"center",color:C.muted,padding:"20px 0"},children:"No orders found."}):
              custOrders.map(o=>{
                const dateStr=new Date(o.created_at).toLocaleDateString("en-IN",{day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"});
                return S.jsxs("div",{
                  style:{padding:"12px 0",borderBottom:`1px solid ${C.border}`,fontSize:13},
                  children:[
                    S.jsxs("div",{
                      style:{display:"flex",justifyContent:"space-between",marginBottom:6},
                      children:[
                        S.jsx("span",{style:{color:C.muted},children:dateStr}),
                        S.jsx("span",{
                          style:{fontWeight:700,color:o.status==="Dispatched"?C.green:o.status==="Cancelled"?C.red:C.accent,background:o.status==="Dispatched"?C.greenBg:o.status==="Cancelled"?C.redBg:C.accentLight,padding:"2px 8px",borderRadius:6,fontSize:11},
                          children:o.status
                        })
                      ]
                    }),
                    S.jsxs("div", {
                      style: {
                        background: C.bg,
                        borderRadius: 8,
                        padding: "10px 12px",
                        marginBottom: 6
                      },
                      children: [
                        S.jsx("pre", {
                          style: { fontSize: 12, color: C.text, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 },
                          children: getOrderPreviewText(o)
                        })
                      ]
                    })
                  ]
                },o.id)
              })
            ]
          })
        ]
      }),
      ie&&S.jsx(s_,{msg:ie}),
      deleteConfirm && S.jsxs("div", {
        style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
        children: [
          S.jsxs("div", {
            style: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 360, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", textAlign: "center" },
            children: [
              S.jsx("div", { style: { fontSize: 40, marginBottom: 12 }, children: "⚠️" }),
              S.jsx("div", { style: { fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 8 }, children: "Confirm Deletion" }),
              S.jsxs("div", { 
                style: { fontSize: 13.5, color: C.muted, marginBottom: 20, lineHeight: 1.5 }, 
                children: ["Are you sure you want to delete the ", deleteConfirm.type, " ", S.jsx("strong", { style: { color: C.text }, children: deleteConfirm.name }), "? This action cannot be undone."] 
              }),
              S.jsxs("div", {
                style: { display: "flex", gap: 10 },
                children: [
                  S.jsx("button", {
                    onClick: () => {
                      deleteConfirm.onConfirm();
                      setDeleteConfirm(null);
                    },
                    style: { flex: 1, padding: "10px 0", background: C.red, color: "#fff", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                    children: "Delete"
                  }),
                  S.jsx("button", {
                    onClick: () => setDeleteConfirm(null),
                    style: { flex: 1, padding: "10px 0", background: C.bg, color: C.muted, border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                    children: "Cancel"
                  })
                ]
              })
            ]
          })
        ]
      }),
      editingOrder && S.jsxs("div", {
        style: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 },
        children: [
          S.jsxs("div", {
            style: { background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, maxHeight: "90vh", display: "flex", flexDirection: "column", padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", fontFamily: "'Outfit', sans-serif" },
            children: [
              S.jsxs("div", {
                style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
                children: [
                  S.jsxs("div", {
                    children: [
                      S.jsx("div", { style: { fontSize: 17, fontWeight: 800, color: C.text }, children: "Edit Order" }),
                      S.jsx("div", { style: { fontSize: 12, color: C.muted, marginTop: 2 }, children: `Shop: ${editingOrder.customer_id && typeof editingOrder.customer_id === "object" ? editingOrder.customer_id.name : "Unknown"}` })
                    ]
                  }),
                  S.jsx("button", {
                    onClic