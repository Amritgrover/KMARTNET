t:800,color:C.text
},children:cust.name
}),
                      S.jsxs("div",{
style:{
fontSize:12.5,color:C.muted,marginTop:4,display:"flex",alignItems:"center",gap:4
},children:[
"📞 ",cust.phone
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

                      setShowCustProfile(!1);

                      ye("Logged out successfully.");

                    
},
                    style:{
background:C.redBg,color:C.red,border:"none",borderRadius:8,padding:"8px 14px",fontSize:12,fontWeight:700,cursor:"pointer"
},
                    children:"Logout"
                  
})
                
]
              
}),
              S.jsx("div",{
style:{
fontSize:14,fontWeight:700,color:C.text,marginBottom:12
},children:"Order History"
}),
              custOrders.length===0?S.jsx("div",{
style:{
textAlign:"center",color:C.muted,padding:"32px 0",fontSize:13.5
},children:"No orders placed yet."
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
                    S.jsx("div",{

                      style:{
background:C.bg,borderRadius:8,padding:"10px 12px"
},
                      children:S.jsx("pre",{

                        style:{
fontSize:11.5,color:C.text,whiteSpace:"pre-wrap",margin:0,fontFamily:"'Outfit', sans-serif",lineHeight:1.6
},
                        children:getOrderPreviewText(o)
 