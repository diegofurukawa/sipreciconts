.
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── index.html
│   ├── manifest.json
│   └── robots.txt
├── README.md
├── src
│   ├── App.css
│   ├── App.test.tsx
│   ├── App.tsx
│   ├── assets
│   ├── auth
│   │   ├── components
│   │   │   └── PrivateRoute.tsx
│   │   ├── config
│   │   │   └── auth_config.ts
│   │   ├── context
│   │   │   ├── AuthContext.tsx
│   │   │   ├── AuthProvider.tsx
│   │   │   ├── CompanyContext.tsx
│   │   │   ├── CompanyStateInitializer.tsx
│   │   │   └── index.ts
│   │   ├── hooks
│   │   │   ├── useAuthState.ts
│   │   │   ├── useAuth.ts
│   │   │   ├── useCompany.ts
│   │   │   └── useLoginForm.ts
│   │   ├── index.ts
│   │   ├── providers
│   │   │   └── index.tsx
│   │   ├── routes
│   │   │   └── auth_routes.tsx
│   │   ├── services
│   │   │   ├── authService.ts
│   │   │   ├── companyService.ts
│   │   │   ├── index.ts
│   │   │   ├── TokenService.ts
│   │   │   └── UserSessionService.ts
│   │   ├── types
│   │   │   ├── auth_types.tsx
│   │   │   └── company_types.ts
│   │   └── utils
│   │       ├── authHelpers.ts
│   │       ├── authValidators.ts
│   │       └── index.ts
│   ├── components
│   │   ├── CardHeader
│   │   │   ├── CardHeader.tsx
│   │   │   └── index.ts
│   │   ├── ErrorBoundary
│   │   │   ├── ApiErrorBoundary.tsx
│   │   │   ├── index.tsx
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
│   │   ├── PageHeader
│   │   │   ├── index.ts
│   │   │   ├── PageHeaderActions.tsx
│   │   │   └── PageHeader.tsx
│   │   ├── PageStates
│   │   │   ├── index.ts
│   │   │   └── PageStates.tsx
│   │   ├── RouteDebug.tsx
│   │   ├── ScrollToTop
│   │   │   └── index.tsx
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
│   │       ├── badge.tsx
│   │       ├── breadcrumb.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── date-formatters.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── file-input.tsx
│   │       ├── form-field.tsx
│   │       ├── index.ts
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── progress.tsx
│   │       ├── select.tsx
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
│   │   ├── api_config.ts
│   │   ├── index.ts
│   │   ├── routes_config.ts
│   │   └── theme_config.ts
│   ├── contexts
│   │   ├── index.ts
│   │   └── ToastContext.tsx
│   ├── env.d.ts
│   ├── hooks
│   │   ├── api
│   │   │   ├── index.ts
│   │   │   └── useCustomerApi.ts
│   │   ├── useApi.ts
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
│   │       ├── index.ts
│   │       ├── MainLayout.tsx
│   │       └── teste.tsx
│   ├── lib
│   │   └── utils.ts
│   ├── main.tsx
│   ├── pages
│   │   ├── Auth
│   │   │   ├── components
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   └── LoginHeader.tsx
│   │   │   ├── hooks
│   │   │   │   └── useLoginForm.ts
│   │   │   └── index.tsx
│   │   ├── Company
│   │   │   ├── components
│   │   │   │   ├── CompanyForm.tsx
│   │   │   │   ├── CompanyHeader.tsx
│   │   │   │   ├── CompanyList.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── useCompanyForm.ts
│   │   │   │   └── useCompanyList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   ├── CompanyRoutes.tsx
│   │   │   │   └── index.ts
│   │   │   ├── services
│   │   │   │   ├── CompanyService.ts
│   │   │   │   └── index.ts
│   │   │   ├── structure
│   │   │   │   └── CompanyStructure.md
│   │   │   ├── types
│   │   │   │   ├── CompanyTypes.ts
│   │   │   │   └── index.ts
│   │   │   └── utils
│   │   │       ├── CompanyValidators.ts
│   │   │       └── index.ts
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
│   │   │   │   ├── ImportHelpDialog.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   ├── useCustomerForm.ts
│   │   │   │   └── useCustomerList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   ├── CustomerRoutes.tsx
│   │   │   │   └── index.ts
│   │   │   ├── services
│   │   │   │   ├── CustomerService.ts
│   │   │   │   └── index.ts
│   │   │   ├── structure
│   │   │   │   └── CustomerStructure.md
│   │   │   ├── types
│   │   │   │   ├── CustomerTypes.ts
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
│   │   ├── SuppliesPriceList
│   │   │   ├── components
│   │   │   │   ├── index.ts
│   │   │   │   ├── SuppliesPriceListForm.tsx
│   │   │   │   ├── SuppliesPriceListHeader.tsx
│   │   │   │   └── SuppliesPriceListList.tsx
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── useSuppliesPriceListForm.ts
│   │   │   │   └── useSuppliesPriceListList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   ├── index.ts
│   │   │   │   └── SuppliesPriceListRoutes.tsx
│   │   │   ├── services
│   │   │   │   ├── index.ts
│   │   │   │   └── SuppliesPriceListService.ts
│   │   │   ├── structure
│   │   │   │   └── SuppliesPriceListStructure.md
│   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── SuppliesPriceListTypes.ts
│   │   │   └── utils
│   │   │       ├── index.ts
│   │   │       └── SuppliesPriceListValidators.ts
│   │   ├── Supply
│   │   │   ├── components
│   │   │   │   ├── index.ts
│   │   │   │   ├── SupplyForm.tsx
│   │   │   │   ├── SupplyHeader.tsx
│   │   │   │   ├── SupplyImport.tsx
│   │   │   │   └── SupplyList.tsx
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── useSupplyForm.ts
│   │   │   │   └── useSupplyList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   ├── index.ts
│   │   │   │   └── SupplyRoutes.tsx
│   │   │   ├── services
│   │   │   │   ├── index.ts
│   │   │   │   └── SupplyService.ts
│   │   │   ├── structure
│   │   │   │   └── SupplyStructure.md
│   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── SupplyTypes.ts
│   │   │   └── utils
│   │   │       ├── index.ts
│   │   │       ├── SupplyErrorHandling.ts
│   │   │       └── SupplyValidators.ts
│   │   ├── Tax
│   │   │   ├── components
│   │   │   │   ├── index.ts
│   │   │   │   ├── TaxForm.tsx
│   │   │   │   ├── TaxHeader.tsx
│   │   │   │   └── TaxList.tsx
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   └── useTaxList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   ├── index.ts
│   │   │   │   └── TaxRoutes.tsx
│   │   │   ├── services
│   │   │   │   ├── index.ts
│   │   │   │   └── TaxService.ts
│   │   │   ├── structure
│   │   │   │   └── TaxStructure.md
│   │   │   └── types
│   │   │       ├── index.ts
│   │   │       └── TaxTypes.ts
│   │   ├── User
│   │   │   ├── components
│   │   │   │   ├── index.ts
│   │   │   │   ├── UserForm.tsx
│   │   │   │   ├── UserHeader.tsx
│   │   │   │   └── UserList.tsx
│   │   │   ├── hooks
│   │   │   │   ├── index.ts
│   │   │   │   ├── useUserForm.ts
│   │   │   │   └── useUserList.ts
│   │   │   ├── index.tsx
│   │   │   ├── routes
│   │   │   │   ├── index.ts
│   │   │   │   └── UserRoutes.tsx
│   │   │   ├── services
│   │   │   │   ├── index.ts
│   │   │   │   └── UserService.ts
│   │   │   ├── structure
│   │   │   │   └── UserStructure.md
│   │   │   ├── types
│   │   │   │   ├── index.ts
│   │   │   │   └── UserTypes.ts
│   │   │   └── utils
│   │   │       ├── index.ts
│   │   │       └── UserValidators.ts
│   │   └── UserProfile
│   │       ├── components
│   │       │   ├── ProfileDropdownMenu.tsx
│   │       │   └── UserProfileDropdown.tsx
│   │       ├── index.tsx
│   │       ├── routes
│   │       │   └── UserProfile_routes.tsx
│   │       └── SessionInfoPage.tsx
│   ├── providers
│   ├── react-app-env.d.ts
│   ├── reportWebVitals.ts
│   ├── routes
│   │   ├── components
│   │   │   ├── LayoutWrapper.tsx
│   │   │   └── PageLoader.tsx
│   │   ├── config
│   │   │   └── route-paths.ts
│   │   ├── index.tsx
│   │   └── modules
│   │       ├── cadastros.routes.tsx
│   │       ├── comercial.routes.tsx
│   │       └── index.ts
│   ├── services
│   │   ├── api
│   │   └── apiMainService
│   │       ├── apiClient.ts
│   │       ├── ApiService.ts
│   │       ├── auth
│   │       │   ├── index.ts
│   │       │   └── tokenManager.ts
│   │       ├── config
│   │       │   ├── apiConfig.ts
│   │       │   └── index.ts
│   │       ├── headers
│   │       │   ├── headerManager.ts
│   │       │   └── index.ts
│   │       ├── index.ts
│   │       ├── interceptors
│   │       │   ├── index.ts
│   │       │   ├── requestInterceptor.ts
│   │       │   └── responseInterceptor.ts
│   │       ├── requests
│   │       │   ├── baseRequests.ts
│   │       │   ├── fileRequests.ts
│   │       │   ├── index.ts
│   │       │   └── paginatedRequests.ts
│   │       └── utils
│   │           ├── errorHandler.ts
│   │           ├── index.ts
│   │           ├── logger.ts
│   │           └── retryManager.ts
│   ├── setupTests.ts
│   ├── styles
│   │   └── globals.css
│   ├── types
│   │   ├── api_types.ts
│   │   ├── axios.types.ts
│   │   ├── index.ts
│   │   ├── react-helmet-async.d.ts
│   │   └── routes.types.ts
│   ├── utils
│   │   ├── date.ts
│   │   ├── lazyImport.ts
│   │   ├── logger copy.ts
│   │   └── logger.ts
│   └── vite-env.d.ts
├── structure
│   └── FrontendStructure.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

125 directories, 288 files