        
}),
              S.jsx("button",{

                onClick:handleCustomerLogin,
                style:{
  width:"100%",padding:"12px",background:C.primary,color:"#fff",border:"none",borderRadius:10,fontSize:15,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif",boxShadow:"0 4px 12px rgba(20,83,45,0.25)"
},
                children:"Enter Catalogue"
              
})
            
]
          
})
        
]
      
}),
      showCustProfile && 
S.jsxs(S.Fragment,{

        children:[

          S.jsx(xr,{
zIndex:110,onClick:()=>setShowCustProfile(!1)
}),
          S.jsxs("div",{

            style:{
position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:480,background:"#fff",borderRadius:"20px 20px 0 0",zIndex:120,padding:"20px 20px 36px",maxHeight:"82vh",overflowY:"auto",boxShadow:"0 -8px 32px rgba(0,0,0,0.18)",fontFamily:"'Outfit', sans-serif"
},
            children:[

              S.jsx("div",{
style:{
  width:40,height:4,background:C.border,borderRadius:2,margin:"0 auto 18px"
}
}),
              S.jsxs("div",{

                style:{
  display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20
},
                children:[
  
                  S.jsx("div",{
    style:{
      fontSize:17,fontWeight:800,color:C.text
    },children:"Your Profile"
  }),
                  S.jsx("button",{
    
                    onClick:()=>setShowCustProfile(!1),
                    style:{
      border:"none",background:C.bg,borderRadius:8,width:30,height:30,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:C.muted
    },
                    children:ct.close
                  
  })
                
]
              
}),
              S.jsxs("div",{

                style:{
  background:C.bg,borderRadius:12,padding:16,marginBottom:20,display:"flex",justifyContent:"space-between",alignItems:"center"
},
                children:[
  
                  S.jsxs("div",{
    
                    children:[
      
                      S.jsx("div",{
        style:{
          fontSize:18,fontWeight:800,color:C.text
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
      
 