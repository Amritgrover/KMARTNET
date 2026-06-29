      style:{
  background:C.primary,color:"#fff",border:"none",borderRadius:10,padding:"9px 16px",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"'Outfit', sans-serif",display:"flex",alignItems:"center",gap:6
},
                    children:[
  ct.plus," Add"
]
                  
})
                
]
              
}),
              S.jsx("div",{
style:{
marginBottom:14
},children:S.jsx(iy,{
value:B,onChange:Y,placeholder:"Search catalogue…"
})
}),S.jsx("div",{
style:{
marginBottom:14
},children:S.jsx(i_,{
categories:Pe,active:adminCatFilter,onChange:setAdminCatFilter
})
}),
              S.jsx("div",{

                style:{
display:"flex",gap:8,marginBottom:16
},
                children:[

                  {
label:"Total",value:s.length,color:C.primary,bg:C.primaryLight
},
                  {
label:"Categories",value:Pe.length-1,color:C.accent,bg:C.accentLight
},
                  {
label:"Avg Margin",value:s.length?`${
  (s.reduce((j,J)=>j+(J.mrp>0?(J.mrp-J.tp)/J.mrp*100:0),0)/s.length).toFixed(0)
}%`:"—"