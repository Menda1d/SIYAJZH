Here's the frontend web files structure for your SIYAJZH fragrance e-commerce site:


apps/web/src/
├── index.css                    # Global styles (white/black/gold theme)
├── App.jsx                      # Main app router & layout
├── lib/
│   ├── config.js               # Configuration (WhatsApp: 2347062022875, Currency: ₦)
│   └── CartContext.jsx         # Shopping cart state management
├── pages/
│   ├── HomePage.jsx            # Main storefront
│   │   ├── Hero section (with your custom image)
│   │   ├── Featured products grid
│   │   ├── Category filter (All, Perfume, Body Spray, Oud, Diffuser, Other)
│   │   └── Product cards with add-to-cart
│   └── AdminPage.jsx           # Admin dashboard
│       ├── Product creation form
│       ├── Product list with edit/delete
│       └── Authentication (admin@siyajzh.com / siyajzhadmin)
└── components/
    └── (Cart & checkout UI integrated in HomePage)

