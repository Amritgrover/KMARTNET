                     
})
                    
})
                  
]
                
},o.id)
              
})
            
]
          
})
        
]
      
}),
      showCustOrders && 
S.jsxs(S.Fragment,{

        children:[

          S.jsx(xr,{
zIndex:110,onClick:()=>setShowCustOrders(!1)
}),
          S.jsxs("div",{

            style:{
position:"fixed",top:"50%",left:"50%",transform:"translate(-50%,-50%)",width:"calc(100% - 32px)",maxWidth:340,maxHeight:"80vh",overflowY:"auto",background:"#fff",borderRadius:18,padding:"24px 22px",zIndex:120,boxShadow:"0 8px 40px rgba(0,0,0,0.22)",fontFamily:"'Outfit', sans-serif"
},
            children:[

              S.jsxs("div",{

                style:{
display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16
},
                children:[

                  S.jsx("div",{
style:{
fontSize:17,fontWeight:800,color:C.text
},children:"Past Orders"
}),
                  S.jsx("button",{

                    onClick:()=>setShowCustOrders(!1),
                    style:{
border:"none",background:C.bg,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted
},
                    children:ct.close
                  
})
                
]
              
}),
              custOrders.length===0?S.jsx("div",{
style:{
textAlign:"center",color:C.muted,padding:"20px 0"
},children:"No orders found."
}):
              custOrders.map(o=>{

                const dateStr=new Date(o.created_at).toLocaleDateString("en-IN",{
day:"2-digit",month:"short",hour:"2-digit",minute:"2-digit"
});

                return S.jsxs("div",{

                  style:{
padding:"12px 0",borderBottom:`1px solid ${
C.border
}`,fontSize:13
},
                  children:[

                    S.jsxs("div",{

                      style:{
display:"flex",justifyContent:"space-between",marginBottom:6
},
                      children:[

                        S.jsx("span",{
  style:{
    color:C.muted
  },children:dateStr
}),
                        S.jsx("span",{
  
                          style:{
    fontWeight:700,color:o.status==="Dispatched"?C.green:o.status==="Cancelled"?C.red:C.accent,background:o.status==="Dispatched"?C.greenBg:o.status==="Cancelled"?C.redBg:C.accentLight,padding:"2px 8px",borderRadius:6,fontSize:11
  },
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
  
                          style: {
     fontSize: 12, color: C.text, whiteSpace: "pre-wrap", margin: 0, fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 
  },
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
      ie && 
S.jsx(s_,{
msg:ie
}),
      deleteConfirm  && 
 S.jsxs("div", {

        style: {
 position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 
},
        children: [

          S.jsxs("div", {

            style: {
 background: "#fff", borderRadius: 16, width: "100%", maxWidth: 360, padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", textAlign: "center" 
},
            children: [

              S.jsx("div", {
 style: {
 fontSize: 40, marginBottom: 12 
}, children: "⚠️" 
}),
              S.jsx("div", {
 style: {
 fontSize: 17, fontWeight: 800, color: C.text, marginBottom: 8 
}, children: "Confirm Deletion" 
}),
              S.jsxs("div", {
 
                style: {
 fontSize: 13.5, color: C.muted, marginBottom: 20, lineHeight: 1.5 
}, 
                children: [
"Are you sure you want to delete the ", deleteConfirm.type, " ", S.jsx("strong", {
 style: {
 color: C.text 
}, children: deleteConfirm.name 
}), "? This action cannot be undone."
] 
              
}),
              S.jsxs("div", {

                style: {
 display: "flex", gap: 10 
},
                children: [

                  S.jsx("button", {

                    onClick: () => {

                      deleteConfirm.onConfirm();

                      setDeleteConfirm(null);

                    
},
                    style: {
 flex: 1, padding: "10px 0", background: C.red, color: "#fff", border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" 
},
                    children: "Delete"
                  
}),
                  S.jsx("button", {

                    onClick: () => setDeleteConfirm(null),
                    style: {
 flex: 1, padding: "10px 0", background: C.bg, color: C.muted, border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" 
},
                    children: "Cancel"
                  
})
                
]
              
})
            
]
          
})
        
]
      
}),
      editingOrder  && 
 S.jsxs("div", {

        style: {
 position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.45)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 
},
        children: [

          S.jsxs("div", {

            style: {
 background: "#fff", borderRadius: 16, width: "100%", maxWidth: 480, maxHeight: "90vh", display: "flex", flexDirection: "column", padding: 20, boxShadow: "0 10px 25px rgba(0,0,0,0.15)", fontFamily: "'Outfit', sans-serif" 
},
            children: [

              S.jsxs("div", {

                style: {
 display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 
},
                children: [

                  S.jsxs("div", {

                    children: [

                      S.jsx("div", {
 style: {
   fontSize: 17, fontWeight: 800, color: C.text 
}, children: "Edit Order" 
}),
                      S.jsx("div", {
 style: {
   fontSize: 12, color: C.muted, marginTop: 2 
}, children: `Shop: ${
  editingOrder.customer_id  && 
   typeof editingOrder.customer_id === "object" ? editingOrder.customer_id.name : "Unknown"
}` 
})
                    
]
                  
}),
                  S.jsx("button", {

                    onClick: () => setEditingOrder(null),
                    style: {
 border: "none", background: C.bg, borderRadius: 8, width: 30, height: 30, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", color: C.muted 
},
                    children: ct.close
                  
})
                
]
              
}),
              S.jsxs("div", {

                style: {
 flex: 1, overflowY: "auto", margin: "10px 0", paddingRight: 4 
},
                children: [

                  editingOrder.items.length === 0 ? S.jsx("div", {
 style: {
 textAlign: "center", color: C.muted, padding: "20px 0", fontSize: 13 
}, children: "No items in this order." 
}) :
                  editingOrder.items.map((item, index) => {

                    const p = s.find(prod => prod.id === item.id);

                    let displayPrice = item.price;

                    if (p) {

                      if (editingOrder.source === "customer") {

                        const base = p.customer_price > 0 ? p.customer_price : p.mrp;

                        displayPrice = (p.tier2_min_qty > 0  && 
 item.qty >= p.tier2_min_qty) ? p.tier2_price : base;

                      
} else {

                        const disc = parseFloat(item.discount)  || 
 0;

                        let batchTp=p.tp;
if(item.bchcode>0 && 
p.product_batches){
  const batch=p.product_batches.find(b=>b.bchcode===item.bchcode);
  if(batch && 
  batch.tp>0)batchTp=parseFloat(batch.tp)
}displayPrice = batchTp * (1 - disc / 100);

                      
}
                    
}
                    displayPrice = Math.round(displayPrice * 100) / 100;


                    return S.jsxs("div", {

                      style: {
 padding: "10px 0", borderBottom: `1px solid ${
  C.border
}`, fontSize: 13 
},
                      children: [

                        S.jsxs("div", {
  
                          style: {
     display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 
  },
                          children: [
    
                            S.jsx("div", {
       style: {
         fontWeight: 600, color: C.text, flex: 1, paddingRight: 8 
      }, children: item.name 
    }),
                            S.jsx("button", {
      
                              onClick: () => {
        
                                setEditingOrder(prev => ({
          
                                  ...prev,
                                  items: prev.items.filter((_, i) => i !== index)
                                
        }));
        
                              
      },
                              style: {
         border: "none", background: "none", color: C.red, cursor: "pointer", fontSize: 12, fontWeight: 600 
      },
                              children: "Remove"
                            
    })
                          
  ]
                        
}),
                        S.jsxs("div", {
  
                          style: {
     display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 
  },
                          children: [
    
                            S.jsxs("div", {
      
                              style: {
         display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" 
      },
                              children: [
        
                                S.jsxs("label", {
          
                                  style: {
             display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted 
          },
                                  children: [
            
                                    "Qty (PCS):",
                                    S.jsx("input", {
              
                                      type: "number",
                                      min: "1",
                                      value: item.qty,
                                      onChange: e => {
                
                                        const newQty = parseInt(e.target.value)  || 
                 1;
                
                                        setEditingOrder(prev => {
                  
                                          const nextItems = [
                    ...prev.items
                  ];
                  
                                          nextItems[
                    index
                  ] = {
                     ...nextItems[
                      index
                    ], qty: newQty 
                  };
                  
                                          return {
                     ...prev, items: nextItems 
                  };
                  
                                        
                });
                
                                      
              },
                                      style: {
                 width: 55, padding: "4px 6px", borderRadius: 6, border: `1px solid ${
                  C.border
                }`, outline: "none", fontSize: 12, textAlign: "center" 
              }
                                    
            })
                                  
          ]
                                
        }),
                                (() => {
          
                                  const cs = p ? (parseInt(p.cs)  || 
           0) : 0;
          
                                  return cs > 0  && 
           S.jsxs(S.Fragment, {
            
                                    children: [
              
                                      S.jsxs("label", {
                
                                        style: {
                   display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted 
                },
                                        children: [
                  
                                          "Cases:",
                                          S.jsx("input", {
                    
                                            type: "number",
                                            min: "0",
                                            value: Math.floor(item.qty / cs),
                                            onChange: e => {
                      
                                              const newCases = parseInt(e.target.value)  || 
                       0;
                      
                                              const loose = item.qty % cs;
                      
                                              const newQty = (newCases * cs) + loose;
                      
                                              setEditingOrder(prev => {
                        
                                                const nextItems = [
                          ...prev.items
                        ];
                        
                                                nextItems[
                          index
                        ] = {
                           ...nextItems[
                            index
                          ], qty: newQty > 0 ? newQty : 1 
                        };
                        
                                                return {
                           ...prev, items: nextItems 
                        };
                        
                                              
                      });
                      
                                            
                    },
                                            style: {
                       width: 45, padding: "4px 6px", borderRadius: 6, border: `1px solid ${
                        C.border
                      }`, outline: "none", fontSize: 12, textAlign: "center" 
                    }
                                          
                  })
                                        
                ]
                                      
              }),
                                      S.jsxs("label", {
                
                                        style: {
                   display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: C.muted 
                },
                                        children: [
                  
                                          "Loose:",
                                          S.jsx("input", {
                    
                                            type: "number",
                                            min: "0",
                                            value: item.qty % cs,
                                            onChange: e => {
                      
                                              const newLoose = parseInt(e.target.value) 