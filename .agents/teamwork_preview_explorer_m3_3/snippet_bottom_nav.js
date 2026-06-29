                      S.jsx("button", {
                        onClick: () => setEditingOrder(null),
                        style: { flex: 1, padding: "10px 0", background: C.bg, color: C.muted, border: "none", borderRadius: 8, fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'Outfit', sans-serif" },
                        children: "Cancel"
                      })
                    ]
                  })
                ]
              })
            ]
          })
        ]
      }),
      r !== "admin" && S.jsx("div", {
        className: "mobile-bottom-nav",
        style: {
          position: "fixed",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxWidth: 480,
          background: "#fff",
          borderTop: `1.5px solid ${C.border}`,
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          padding: "6px 0 10px",
          boxShadow: "0 -2px 12px rgba(0,0,0,0.08)",
          zIndex: 90
        },
        children: r === "customer" ? [
          S.jsxs("button", {
            onClick: () => {
              setShowCustProfile(false);
              setShowCustOrders(false);
              setEditingOrder(null);
              $(false);
            },
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: (!showCustProfile && !X && !showCustOrders) ? C.primary : C.muted,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              S.jsxs("svg", {
                width: "20",
                height: "20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                children: [
                  S.jsx("path", { d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
                  S.jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
                ]
              }),
              S.jsx("span", { children: "Home" })
            ]
          }),
          S.jsxs("button", {
            onClick: () => {
              setShowCustProfile(false);
              setShowCustOrders(false);
              setEditingOrder(null);
              $(false);
              setTimeout(() => {
                const searchInput = document.querySelector('input[placeholder="Search products…"]');
                if (searchInput) {
                  searchInput.focus();
                  searchInput.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }, 100);
            },
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: C.muted,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              ct.search,
              S.jsx("span", { children: "Search" })
            ]
          }),
          S.jsxs("button", {
            onClick: () => $(true),
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: X ? C.primary : C.muted,
              cursor: "pointer",
              position: "relative",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              ct.bag,
              Ot > 0 && S.jsx("span", {
                style: {
                  position: "absolute",
                  top: -4,
                  right: -6,
                  background: C.yellow,
                  color: C.primary,
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  fontSize: 9,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: Ot
              }),
              S.jsx("span", { children: "Cart" })
            ]
          }),
          S.jsxs("button", {
            onClick: () => setShowCustProfile(true),
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: showCustProfile ? C.primary : C.muted,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              ct.user,
              S.jsx("span", { children: "Profile" })
            ]
          })
        ] : r === "salesman" ? [
          S.jsxs("button", {
            onClick: () => {
              setSalesmanTab("catalogue");
              setShowCustProfile(false);
              setEditingOrder(null);
              $(false);
            },
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: (salesmanTab === "catalogue" && !X && !showCustProfile) ? C.primary : C.muted,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              S.jsxs("svg", {
                width: "20",
                height: "20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                children: [
                  S.jsx("path", { d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" }),
                  S.jsx("polyline", { points: "14 2 14 8 20 8" })
                ]
              }),
              S.jsx("span", { children: "Catalogue" })
            ]
          }),
          S.jsxs("button", {
            onClick: () => $(true),
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: X ? C.primary : C.muted,
              cursor: "pointer",
              position: "relative",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              ct.bag,
              Ot > 0 && S.jsx("span", {
                style: {
                  position: "absolute",
                  top: -4,
                  right: -6,
                  background: C.yellow,
                  color: C.primary,
                  borderRadius: "50%",
                  width: 16,
                  height: 16,
                  fontSize: 9,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                },
                children: Ot
              }),
              S.jsx("span", { children: "Cart" })
            ]
          }),
          S.jsxs("button", {
            onClick: () => {
              setSalesmanTab("orders");
              setShowCustProfile(false);
              setEditingOrder(null);
              $(false);
            },
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: (salesmanTab === "orders" && !X && !showCustProfile) ? C.primary : C.muted,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              S.jsxs("svg", {
                width: "20",
                height: "20",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2",
                viewBox: "0 0 24 24",
                children: [
                  S.jsx("path", { d: "M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" }),
                  S.jsx("polyline", { points: "3.27 6.96 12 12.01 20.73 6.96" }),
                  S.jsx("line", { x1: "12", y1: "22.08", x2: "12", y2: "12" })
                ]
              }),
              S.jsx("span", { children: "Orders" })
            ]
          }),
          S.jsxs("button", {
            onClick: () => setShowCustProfile(true),
            style: {
              background: "transparent",
              border: "none",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              color: showCustProfile ? C.primary : C.muted,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 700,
              fontFamily: "'Outfit', sans-serif"
            },
            children: [
              ct.user,
              S.jsx("span", { children: "Profile" })
            ]
          })
        ] : null
      })
    ]
  });
}
