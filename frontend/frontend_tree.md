.
├── error_frontend.log
├── eslint.config.js
├── find_in_files.sh
├── frontend_tree.md
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── favicon.ico
│   ├── index.html
│   ├── logo192.png
│   ├── logo512.png
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── assets
│   │   └── react.svg
│   ├── components
│   │   ├── ErrorBoundary
│   │   │   ├── ApiErrorBoundary.tsx
│   │   │   └── LoadingFallback.tsx
│   │   ├── FeatureCard.tsx
│   │   ├── feedback
│   │   │   ├── EmptyState.tsx
│   │   │   ├── ErrorState.tsx
│   │   │   └── LoadingState.tsx
│   │   ├── LayoutWrapper
│   │   │   └── index.tsx
│   │   ├── LoadingSpinner
│   │   │   ├── index.tsx
│   │   │   └── LoadingFallback.tsx
│   │   ├── PrivateRoute
│   │   │   └── index.tsx
│   │   ├── PrivateRoute.tsx
│   │   ├── RouteDebug.tsx
│   │   └── ui
│   │       ├── accordion
│   │       │   ├── accordion.test.tsx
│   │       │   ├── accordion.tsx
│   │       │   └── index.tsx
│   │       ├── alert-dialog
│   │       │   ├── alert-dialog.test.tsx
│   │       │   ├── alert-dialog.tsx
│   │       │   └── index.ts
│   │       ├── avatar.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── date-formatters.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── form-field.tsx
│   │       ├── index.ts
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── progress.tsx
│   │       ├── sheet.tsx
│   │       ├── simplealert
│   │       │   ├── index.ts
│   │       │   └── SimpleAlert.tsx
│   │       ├── skeleton.tsx
│   │       ├── switch.tsx
│   │       ├── table-pagination
│   │       │   ├── index.ts
│   │       │   ├── table-pagination.test.tsx
│   │       │   └── table-pagination.tsx
│   │       ├── table.tsx
│   │       └── toast
│   │           ├── index.ts
│   │           ├── toast.test.tsx
│   │           └── toast.tsx
│   ├── config
│   │   └── api.ts
│   ├── contexts
│   │   ├── CompanyContext.tsx
│   │   └── ToastContext.tsx
│   ├── core
│   │   └── auth
│   │       ├── context
│   │       │   ├── AuthContext.tsx
│   │       │   └── index.ts
│   │       ├── index.ts
│   │       ├── services
│   │       │   ├── index.ts
│   │       │   ├── TokenService.ts
│   │       │   └── UserSessionService.ts
│   │       └── types
│   │           ├── auth.types.ts
│   │           └── index.ts
│   ├── env.d.ts
│   ├── hooks
│   │   ├── api
│   │   │   ├── index.ts
│   │   │   └── useCustomerApi.ts
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   └── useToast.ts
│   ├── index.css
│   ├── index.tsx
│   ├── layouts
│   │   ├── AuthLayout
│   │   │   └── index.tsx
│   │   ├── CadastrosLayout
│   │   │   ├── components
│   │   │   │   └── CadastrosMenu.tsx
│   │   │   └── index.tsx
│   │   └── MainLayout
│   │       ├── components
│   │       │   ├── Footer.tsx
│   │       │   ├── Header.tsx
│   │       │   ├── index.ts
│   │       │   ├── Navbar.tsx
│   │       │   └── UserMenu.tsx
│   │       ├── index.tsx
│   │       └── teste.tsx
│   ├── logo.svg
│   ├── main.tsx
│   ├── pages
│   │   ├── Company
│   │   │   ├── components
│   │   │   │   ├── CompanyForm.tsx
│   │   │   │   ├── CompanyHeader.tsx
│   │   │   │   └── CompanyList.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useCompanyForm.ts
│   │   │   │   └── useCompanyList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes.ts
│   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   └── utils
│   │   │       └── validators.ts
│   │   ├── Contract
│   │   │   ├── ContractForm
│   │   │   │   └── index.tsx
│   │   │   └── ContractList
│   │   │       └── index.tsx
│   │   ├── Customer
│   │   │   ├── components
│   │   │   │   ├── CustomerDetails.tsx
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   ├── CustomerHeader.tsx
│   │   │   │   ├── CustomerImport.tsx
│   │   │   │   ├── CustomerList.tsx
│   │   │   │   ├── CustomerToolbar.tsx
│   │   │   │   ├── DeleteConfirmation.tsx
│   │   │   │   ├── FeedbackMessage.tsx
│   │   │   │   └── ImportHelpDialog.tsx
│   │   │   ├── hooks
│   │   │   │   ├── useCustomerForm.ts
│   │   │   │   └── useCustomerList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   └── index.tsx
│   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   └── utils
│   │   │       └── validators.ts
│   │   ├── Help
│   │   │   └── index.tsx
│   │   ├── Home
│   │   │   ├── components
│   │   │   │   └── FeatureCard.tsx
│   │   │   └── index.tsx
│   │   ├── Login
│   │   │   ├── components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── LoginHeader.tsx
│   │   │   ├── hooks
│   │   │   │   └── useLoginForm.ts
│   │   │   ├── index.tsx
│   │   │   ├── types
│   │   │   │   └── index.ts
│   │   │   └── utils
│   │   │       └── validators.ts
│   │   ├── NotFound
│   │   │   ├── index.tsx
│   │   │   └── NotFound.tsx
│   │   ├── Quote
│   │   │   ├── QuoteForm
│   │   │   │   └── index.tsx
│   │   │   └── QuoteList
│   │   │       └── index.tsx
│   │   ├── Supplies
│   │   │   └── index.tsx
│   │   ├── Supply
│   │   │   ├── index.tsx
│   │   │   ├── SupplyForm.tsx
│   │   │   ├── SupplyHeader.tsx
│   │   │   ├── SupplyList.tsx
│   │   │   └── __tests__
│   │   │       └── SupplyList.test.tsx
│   │   └── Tax
│   │       ├── TaxForm.tsx
│   │       └── TaxList.tsx
│   ├── providers
│   │   └── index.tsx
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── routes
│   │   ├── components
│   │   │   ├── LayoutWrapper.tsx
│   │   │   ├── PageLoader.tsx
│   │   │   └── PrivateRoute.tsx
│   │   ├── config
│   │   │   └── route-paths.ts
│   │   ├── index.tsx
│   │   ├── modules
│   │   │   ├── cadastros.routes.tsx
│   │   │   ├── comercial.routes.tsx
│   │   │   ├── customer.routes.tsx
│   │   │   └── index.ts
│   │   └── types.ts
│   ├── services
│   │   ├── api
│   │   │   ├── ApiService.ts
│   │   │   ├── base.ts
│   │   │   ├── config.ts
│   │   │   ├── constants.ts
│   │   │   ├── index.ts
│   │   │   ├── instance.ts
│   │   │   ├── interceptors.ts
│   │   │   ├── modules
│   │   │   │   ├── auth.ts
│   │   │   │   ├── company.ts
│   │   │   │   ├── customer.ts
│   │   │   │   └── tax.ts
│   │   │   ├── supply.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts
│   │   └── other
│   ├── setupTests.ts
│   ├── styles
│   │   └── globals.css
│   ├── types
│   │   ├── auth.types.ts
│   │   ├── company.ts
│   │   ├── customer.ts
│   │   ├── index.ts
│   │   ├── supply.ts
│   │   └── tax.ts
│   ├── utils
│   │   └── date.ts
│   └── vite-env.d.ts
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts