ximum retail price","number"
],[
"Cost Price ₹","cp","Your purchase price","number"
],[
"Case Size","cs","e.g. 24 or 12 units","text"
],[
"Customer Price (Base) ₹","customer_price","Default: MRP","number"
],[
"Tier 2 Min Qty","tier2_min_qty","e.g. 12 (0 to disable)","number"
],[
"Tier 2 Price ₹","tier2_price","Price for tier 2 qty","number"
],[
"Note / Offer","desc","Optional short note","text"
],[
"Vision Product ID","vision_product_id","e.g. 1045","number"
]
];


  // Open appropriate login modal if pathname doesn't match login status
  ge.useEffect(() => {

    const p = window.location.pathname.toLowerCase();

    
    // Redirect if they are on customer paths but have active login
    if (p === "/"  || 
 p === "/customers"  || 
 p === "/customer") {

      if (se) {
  
        a("admin");
  
        return;
  
      
}
      if (slAuth) {
  
        a("salesman");
  
        return;
  
      
}
    
}
    
    // Lock admin to admin path
    if (se  && 
 !p.startsWith("/admin")) {

      a("admin");

      return;

    
}

    if (p.startsWith("/admin")) {

      if (!se) {
  
        setAuthTarget("admin");
  
        tt("");
  
        pt(!1);
  
        Me(!0);
  
      
}
    
} else if (p.startsWith("/salesman")) {

      if (!slAuth) {
  
        setAuthTarget("salesman");
  
        setSalesmanSelId("");
  
        tt("");
  
        pt(!1);
  
        Me(!0);
  
      
}
    
}
  
}, [
r, se, slAuth
]);


  return S.jsxs("div",{

    style:{
fontFamily:"'Outfit', sans-serif",background:C.bg,minHeight:"100vh",width:"100%",maxWidth:480,margin:"0 auto",position:"relative",paddingBottom:80
},
    children:[

      S.jsx("div",{
  
        style:{
    background:C.primary,color:"#fff",padding:"16px",position:"sticky",top:0,zIndex:10,boxShadow:"0 2px 12px rgba(20,83,45,0.18)"
  },
        children:S.jsxs("div",{
    
          style:{
      display:"flex",justifyContent:"space-between",alignItems:"center"
    },
          children:[
      
            S.jsxs("div",{
        
              style:{
          display:"flex",alignItems:"center",gap:8,fontSize:22,fontWeight:800,letterSpacing:-.5
        },
              children:[
          
                S.jsx("img",{
            src:"/assets/logo.png",style:{
              width:28,height:28,borderRadius:6,objectFit:"contain"
            }
          }),
                S.jsxs("span",{
            children:[
              
                  "KM",
                  S.jsx("span",{
                style:{
                  color:C.yellow
                },children:"ART"
              })
                
            ]
          })
              
        ]
            
      }),
            S.jsxs("div",{
        
              style:{
          display:"flex",alignItems:"center",gap:6
        },
              children:[
          
                r==="salesman" && 
          S.jsxs("button",{
            
                  onClick:()=>{
              
                    localStorage.removeItem("kmart_salesman");
              
                    setSlAuth(!1);
              
                    setSelectedSalesman(null);
              
                    ye("Salesman logged out.");
              
                  
            },
                  style:{
              background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:12.5,fontWeight:700,fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",gap:5
            },
                  children:[
              "🔒","Logout"
            ]
                
          }),
                r==="customer" && 
          cust && 
          S.jsxs("button",{
            
                  onClick:()=>setShowCustProfile(!0),
                  style:{
              background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:12.5,fontWeight:700,fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",gap:6
            },
                  children:[
              ct.user,"Profile"
            ]
                
          }),
                (r==="salesman" || 
          r==="customer") && 
          S.jsxs("button",{
            
                  onClick:()=>$(!0),
                  style:{
              background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,color:"#fff",padding:"6px 12px",cursor:"pointer",fontSize:12.5,fontWeight:700,fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",gap:6
            },
                  children:[
              
                    ct.bag,
                    S.jsx("span",{
                children:"Cart"
              }),
                    Ot>0 && 
              S.jsx("span",{
                
                      style:{
                  background:C.yellow,color:C.primary,borderRadius:"50%",width:18,height:18,fontSize:10,fontWeight:800,display:"inline-flex",alignItems:"center",justifyContent:"center",marginLeft:2
                },
                      children:Ot
                    
              })
                  
            ]
                
          })
              
        ]
            
      })
          
    ]
        
  })
      
}),
      r!=="admin" && 
S.jsxs("div",{
  
        style:{
    padding:16
  },
        children:[
    
          r === "salesman"  && 
     S.jsxs("div", {
      
            style: {
         display: "flex", gap: 8, marginBottom: 14, background: C.bg, padding: 4, borderRadius: 10 
      },
            children: [
        
              S.jsx("button", {
          
                onClick: () => setSalesmanTab("catalogue"),
                style: {
            
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: salesmanTab === "catalogue" ? "#fff" : "transparent",
                  color: salesmanTab === "catalogue" ? C.primary : C.muted,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: salesmanTab === "catalogue" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  fontFamily: "'Outfit', sans-serif"
                
          },
                children: "📝 Place Order"
              
        }),
              S.jsx("button", {
          
                onClick: () => setSalesmanTab("orders"),
                style: {
            
                  flex: 1,
                  padding: "6px 12px",
                  borderRadius: 8,
                  border: "none",
                  background: salesmanTab === "orders" ? "#fff" : "transparent",
                  color: salesmanTab === "orders" ? C.primary : C.muted,
                  fontSize: 12,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: salesmanTab === "orders" ? "0 1px 4px rgba(0,0,0,0.06)" : "none",
                  fontFamily: "'Outfit', sans-serif"
                
          },
                children: `📦 My Orders (${
            salesmanOrders.length
          })`
              
        })
            
      ]
          
    }),
          r==="salesman" && 
    salesmanTab==="catalogue" && 
    S.jsxs("div",{
      
            style:{
        background:"#fff",border:`1px solid ${
          C.border
        }`,borderRadius:11,padding:"12px 14px",marginBottom:14,boxShadow:"0 1px 4px rgba(0,0,0,0.05)"
      },
            children:[
        
              S.jsxs("div",{
          
                style:{
            display:"flex",alignItems:"center",gap:8,marginBottom:10
          },
                children:[
            
                  S.jsx("span",{
              style:{
                fontSize:16
              },children:"📍"
            }),
                  S.jsx("span",{
              style:{
                fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.5
              },children:"Beat"
            }),
                  S.jsx("select",{
              
                    value:selectedBeat,
                    onChange:j=>{
                setSelectedBeat(j.target.value);
                setSelectedCustomerId("");
                H("");
                setNeErr(!1);
                
              },
                    style:{
                flex:1,padding:"7px 10px",borderRadius:8,border:`1.5px solid ${
                  C.border
                }`,fontSize:13.5,fontWeight:600,color:C.text,outline:"none",background:"#fff",fontFamily:"'Outfit', sans-serif",cursor:"pointer"
              }
                  ,children:dbBeats.map(b=>S.jsx("option",{
                value:b,children:b
              },b))
                  
            })
                
          ]
              
        }),
              S.jsxs("div",{
          
                style:{
            display:"flex",alignItems:"center",gap:8
          },
                children:[
            
                  S.jsx("span",{
              style:{
                fontSize:16
              },children:"🏪"
            }),
                  S.jsx("span",{
              style:{
                fontSize:12,fontWeight:700,color:C.muted,textTransform:"uppercase",letterSpacing:0.5
              },children:"Shop"
            }),
                  S.jsx("select",{
              
                    value:selectedCustomerId,
                    onChange:j=>{
                
                      setSelectedCustomerId(j.target.value);
                
                      if(j.target.value!=="" && 
                j.target.value!=="new"){
                  
                        const match=beatCustomers.find(c2=>String(c2.id)===j.target.value);
                  
                        if(match)H(match.name);
                  
                      
                }else if(j.target.value==="new"){
                  
                        H("");
                  
                      
                }else{
                  
                        H("");
                  
                      
                }
                      setNeErr(!1);
                
                    
              },
                    style:{
                flex:1,padding:"7px 10px",borderRadius:8,border:neErr?`1.5px solid ${
                  C.red
                }`:`1.5px solid ${
                  C.border
                }`,fontSize:13.5,fontWeight:600,color:selectedCustomerId?C.text:C.muted,outline:"none",background:neErr?C.redBg:"#fff",fontFamily:"'Outfit', sans-serif",cursor:"pointer"
              },
                    children:[
                
                      S.jsx("option",{
                  value:"",children:"-- Select Customer --"
                }),
                      ...beatCustomers.filter(c2=>{
                  if(selectedBeat==="Others"){
                    return c2.beat==="Others" || 
                    !c2.beat;
                    
                  }return c2.beat===selectedBeat;
                  
                }).map(c2=>S.jsx("option",{
                  value:String(c2.id),children:c2.name
                },c2.id)),
                      S.jsx("option",{
                  value:"new",children:"＋ New Customer"
                })
                    
              ]
                  
            }),
                  S.jsx("button",{
              
                    onClick:()=>ht(!0),
                    title:"New order — clear cart & customer name",
                    style:{
                flexShrink:0,width:34,height:34,borderRadius:9,border:`1.5px solid ${
                  C.border
                }`,background:Ot>0 || 
                z?C.redBg:C.bg,color:Ot>0 || 
                z?C.red:C.muted,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.2s"
              },
                    children:ct.refresh
                  
            })
                
          ]
              
        }),
              selectedCustomerId==="new" && 
        S.jsxs(S.Fragment,{
          
                children:[
            
                  S.jsx("input",{
              
                    value:z,
                    onChange:j=>{
                H(j.target.value);
                setNewCustomerName(j.target.value);
                setNeErr(!1);
                
              },
                    placeholder:"Enter new customer / shop name…",
                    style:{
                ...pl,marginTop:10,border:neErr  && 
                 !z.trim()?`1.5px solid ${
                  C.red
                }`:`1.5px solid ${
                  C.border
                }`,background:neErr  && 
                 !z.trim()?C.redBg:"#fff",padding:"8px 12px",borderRadius:8,width:"100%",fontSize:13.5,fontWeight:500,boxSizing:"border-box"
              }
                  
            }),
                  S.jsx("input",{
              
                    value:newCustomerPhone,
                    onChange:j=>{
                setNewCustomerPhone(j.target.value);
                setNeErr(!1);
                
              },
                    placeholder:"Enter new customer phone number…",
                    style:{
                ...pl,marginTop:8,border:neErr  && 
                 !newCustomerPhone.trim()?`1.5px solid ${
                  C.red
                }`:`1.5px solid ${
                  C.border
                }`,background:neErr  && 
                 !newCustomerPhone.trim()?C.redBg:"#fff",padding:"8px 12px",borderRadius:8,width:"100%",fontSize:13.5,fontWeight:500,boxSizing:"border-box"
              }
                  
            })
                
          ]
              
        })
            
      ]
          
    }),
          r==="customer" && 
    cust && 
    S.jsxs("div",{
      
            style:{
        background:"#fff",border:`1px solid ${
          C.border
        }`,borderRadius:11,padding:"10px 14px",marginBottom:14,display:"flex",alignItems:"center",justifyContent:"space-between",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"
      },
            children:[
        
              S.jsxs("div",{
          
                style:{
            display:"flex",alignItems:"center",gap:8
          },
                children:[
            
                  S.jsx("span",{
              style:{
                fontSize:16
              },children:"👋"
            }),
                  S.jsxs("span",{
              style:{
                fontSize:13.5,fontWeight:600,color:C.text
              },children:[
                "Hello, ",cust.name
              ]
            })
                
          ]
              
        }),
              S.jsx("button",{
          
                onClick:()=>{
            
                  localStorage.removeItem("kmart_customer");
            
                  setCust(null);
            
                  b({
              
            });
            
                  x({
              
            });
            
                  H("");
            
                  ye("Logged out successfully.");
            
                
          },
                style:{
            background:"transparent",border:"none",color:C.red,fontSize:12,fontWeight:700,cursor:"pointer"
          },
                children:"Logout"
              
        })
            
      ]
          
    }),
          (r!=="salesman" || 
    salesmanTab==="catalogue") && 
    S.jsx("div",{
      style:{
        marginBottom:13
      },children:S.jsx(iy,{
        value:f,onChange:y
      })
    }),
          (r!=="salesman" || 
    salesmanTab==="catalogue") && 
    S.jsx("div",{
      style:{
        marginBottom:12
      },children:S.jsx(i_,{
        categories:Pe,active:g,onChange:l=>{
          m(l),setSelectedBrand("All")
        }
      })
    }),
          (r!=="salesman" || 
    salesmanTab==="catalogue") && 
    S.jsxs("div", {
      
            style: {
         marginTop: 10, marginBottom: 12 
      },
            children: [
        
              S.jsx("div", {
          
                style: {
             fontSize: 10.5, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 
          },
                children: "SHOP BY BRAND"
              
        }),
              S.jsx("div", {
          
                style: {
             display: "flex", gap: 7, overflowX: "auto", paddingBottom: 4, scrollbarWidth: "none", WebkitOverflowScrolling: "touch" 
          },
                children: dbBrands.map(b => S.jsx("button", {
            
                  onClick: () => {
              
                    setSelectedBrand(b);
              
                    m("All");
              
                  
            },
                  style: {
              
                    padding: "6px 14px",
                    borderRadius: 20,
                    border: selectedBrand === b ? "2px solid #000" : `1.5px solid ${
                C.border
              }`,
                    background: selectedBrand === b ? "#000" : "#fff",
                    color: selectedBrand === b ? "#fff" : C.muted,
                    fontSize: 12,
                    fontWeight: selectedBrand === b ? 700 : 500,
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                    fontFamily: "'Outfit', sans-serif",
                    transition: "all 0.15s",
                    flexShrink: 0
                  
            },
                  children: b
                
          }, b))
              
        })
            
      ]
          
    }),
          (r!=="salesman" || 
    salesmanTab==="catalogue") && 
    S.jsxs("div",{
      
            style:{
        fontSize:12,color:C.muted,marginBottom:12,fontWeight:500
      },
            children:[
        
              Ue.length,
              " product",
              Ue.length!==1?"s":"",
              r==="salesman" && 
        Ot>0 && 
        S.jsxs("span",{
          
                style:{
            marginLeft:8,color:C.green,fontWeight:700
          },
                children:[
            "· ",Ot," in order · ",un(tn)," total"
          ]
              
        })
            
      ]
          
    }),
          (r!=="salesman" || 
    salesmanTab==="catalogue") && 
    (Ue.length===0?S.jsxs("div",{
      
            style:{
        textAlign:"center",color:C.muted,padding:"56px 0",fontSize:14
      },
            children:[
        
              S.jsx("div",{
          style:{
            fontSize:40,marginBottom:10
          },children:"🔍"
        }),
              "No products found",
              S.jsx("div",{
          style:{
            fontSize:12,marginTop:6
          },children:"Try a different search or category"
        })
            
      ]
          
    }):S.jsx("div",{
      
            className:r==="customer"?"product-grid":"",
            style:r==="customer"?{
        gap:12
      }:{
        display:"flex",flexDirection:"column",gap:12,width:"100%"
      },
            children:Ue.map(j=>r==="customer"?S.jsx(t_,{
        p:j,qty:v[
          j.id
        ] || 
        0,onAdd:()=>Nn(j.id,1),onInc:()=>Nn(j.id,1),onDec:()=>Nn(j.id,-1),onSet:J=>Nt(j.id,J)
      },j.id):S.jsx(n_,{
        p:j,cart:v,onInc:Nn,onDec:Nn,onSet:Nt,discMap:T,setDiscMap:x
      },j.id))
          
    })),
          r==="customer" && 
    (Ot>0?S.jsxs("button",{
      
            onClick:()=>$(!0),
            style:{
        marginTop:22,width:"100%",padding:"14px",background:C.primary,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 14px rgba(20,83,45,0.35)"
      },
            children:[
        ct.bag," View Order (",Ot," items · ",un(tn),")"
      ]
          
    }):S.jsxs("button",{
      
            onClick:()=>setShowCustOrders(!0),
            style:{
        marginTop:22,width:"100%",padding:"13px",background:C.wa,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 14px rgba(37,211,102,0.35)"
      },
            children:[
        ct.wa," View Past Orders"
      ]
          
    })),
          r==="salesman" && 
    salesmanTab==="catalogue" && 
    Ot>0 && 
    S.jsxs("button",{
      
            onClick:()=>$(!0),
            style:{
        marginTop:22,width:"100%",padding:"14px",background:C.primary,color:"#fff",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 14px rgba(20,83,45,0.35)"
      },
            children:[
        ct.bag," View Order (",Ot," items · ",un(tn),")"
      ]
          
    }),
          r==="salesman"  && 
     salesmanTab === "orders"  && 
     (() => {
      
            const filteredOrders = salesmanOrders.filter(x => {
        
              if (salesmanOrderDateFilter) {
          
                const d = new Date(x.created_at);
          
                const yyyymmdd = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
          
                return yyyymmdd === salesmanOrderDateFilter;
          
              
        }
              return true;
        
            
      });
      
            const totalSales = filteredOrders.reduce((sum, o) => sum + (parseFloat(o.total_amount)  || 
       0), 0);
      
            return S.jsxs("div", {
        
              children: [
          
                S.jsxs("div", {
            
                  style: {
               display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginBottom: 12 
            },
                  children: [
              
                    S.jsx("div", {
                
                      style: {
                   fontSize: 15, fontWeight: 800, color: C.text 
                },
                      children: "Your Submitted Orders"
                    
              }),
                    S.jsxs("div", {
                
                      style: {
                   display: "flex", alignItems: "center", gap: 6 
                },
                      children: [
                  
                        S.jsx("span", {
                     style: {
                       fontSize: 12, fontWeight: 700, color: C.muted 
                    }, children: "Date:" 
                  }),
                        S.jsx("input", {
                    
                          type: "date",
                          value: salesmanOrderDateFilter,
                          onChange: e => setSa