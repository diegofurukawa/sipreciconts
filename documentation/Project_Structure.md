.
├── backend
│   ├── api
│   │   ├── admin
│   │   │   ├── asset_location_admin.py
│   │   │   ├── assets_admin.py
│   │   │   ├── base_admin.py
│   │   │   ├── company_admin.py
│   │   │   ├── customer_admin.py
│   │   │   ├── location_admin.py
│   │   │   ├── supply_admin.py
│   │   │   ├── tax_admin.py
│   │   │   ├── user_admin.py
│   │   │   └── usersession_admin.py
│   │   ├── apps.py
│   │   ├── auth_custom
│   │   │   ├── authentication_auth_custom.py
│   │   │   ├── backends_auth_custom.py
│   │   │   ├── handlers_auth_custom.py
│   │   │   ├── settings_auth_custom.py
│   │   │   └── views_auth_custom.py
│   │   ├── forms
│   │   │   └── company.py
│   │   ├── management
│   │   │   └── commands
│   │   │       ├── create_test_user.py
│   │   │       ├── setup_api_user_admin.py
│   │   │       ├── setup_api_user_co001.py
│   │   │       ├── setup_api_user_co002.py
│   │   │       ├── setup_api_user_co003.py
│   │   │       ├── setup_api_user_co004.py
│   │   │       ├── test_login_django.py
│   │   │       └── test_login.py
│   │   ├── middleware
│   │   │   └── usersession.py
│   │   ├── migrations
│   │   │   └── 0001_initial.py
│   │   ├── models
│   │   │   ├── asset_category_model.py
│   │   │   ├── asset_group_model.py
│   │   │   ├── asset_location_model.py
│   │   │   ├── asset_model.py
│   │   │   ├── asset_movement_model.py
│   │   │   ├── base_model.py
│   │   │   ├── company_model.py
│   │   │   ├── customer_model.py
│   │   │   ├── location_model.py
│   │   │   ├── managers_model.py
│   │   │   ├── supply_model.py
│   │   │   ├── tax_model.py
│   │   │   ├── types_model.py
│   │   │   ├── user_model.py
│   │   │   └── usersession_model.py
│   │   ├── serializers
│   │   │   ├── asset_category_serializer.py
│   │   │   ├── asset_group_serializer.py
│   │   │   ├── asset_movement_serializer.py
│   │   │   ├── asset_serializer.py
│   │   │   ├── auth_serializer.py
│   │   │   ├── base_serializer.py
│   │   │   ├── company_serializer.py
│   │   │   ├── customer_serializer.py
│   │   │   ├── supply_serializer.py
│   │   │   ├── tax_serializer.py
│   │   │   ├── user_serializer.py
│   │   │   └── usersession_serializer.py
│   │   ├── services
│   │   │   └── usersession_service.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views
│   │       ├── asset_category_view.py
│   │       ├── asset_group_view.py
│   │       ├── asset_movement_view.py
│   │       ├── asset_view.py
│   │       ├── authentication_view.py
│   │       ├── base_view.py
│   │       ├── company_view.py
│   │       ├── customer_view.py
│   │       ├── login_view.py
│   │       ├── supply_view.py
│   │       ├── tax_view.py
│   │       ├── usersession_view.py
│   │       └── user_view.py
│   ├── apps
│   ├── backend
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls copy.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── core
│   │   └── utils
│   │       ├── constants.py
│   │       └── mixins.py
│   ├── data
│   ├── manage.py
│   ├── requirements
│   │   ├── base.txt
│   │   ├── local.txt
│   │   ├── prod.txt
│   │   ├── scripts
│   │   │   ├── create_superuser.py
│   │   │   └── reset_db.py
│   │   └── test.txt
│   ├── templates
│   └── test_api.py
├── frontend
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   ├── src
│   │   ├── App.css
│   │   ├── App.test.tsx
│   │   ├── App.tsx
│   │   ├── assets
│   │   ├── auth
│   │   │   ├── components
│   │   │   │   └── PrivateRoute.tsx
│   │   │   ├── config
│   │   │   │   └── auth_config.ts
│   │   │   ├── context
│   │   │   │   ├── AuthContext.tsx
│   │   │   │   ├── AuthProvider.tsx
│   │   │   │   ├── CompanyContext.tsx
│   │   │   │   ├── CompanyStateInitializer.tsx
│   │   │   │   └── index.ts
│   │   │   ├── hooks
│   │   │   │   ├── useAuthState.ts
│   │   │   │   ├── useAuth.ts
│   │   │   │   ├── useCompany.ts
│   │   │   │   └── useLoginForm.ts
│   │   │   ├── index.ts
│   │   │   ├── providers
│   │   │   │   └── index.tsx
│   │   │   ├── routes
│   │   │   │   └── auth_routes.tsx
│   │   │   ├── services
│   │   │   │   ├── authService.ts
│   │   │   │   ├── companyService.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── TokenService.ts
│   │   │   │   └── UserSessionService.ts
│   │   │   ├── types
│   │   │   │   ├── auth_types.tsx
│   │   │   │   └── company_types.ts
│   │   │   └── utils
│   │   │       ├── authHelpers.ts
│   │   │       ├── authValidators.ts
│   │   │       └── index.ts
│   │   ├── components
│   │   │   ├── ErrorBoundary
│   │   │   │   ├── ApiErrorBoundary.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── LoadingFallback.tsx
│   │   │   ├── FeatureCard.tsx
│   │   │   ├── feedback
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   └── LoadingState.tsx
│   │   │   ├── LayoutWrapper
│   │   │   │   └── index.tsx
│   │   │   ├── LoadingSpinner
│   │   │   │   ├── index.tsx
│   │   │   │   └── LoadingFallback.tsx
│   │   │   ├── PageHeader
│   │   │   │   ├── index.ts
│   │   │   │   ├── PageHeaderActions.tsx
│   │   │   │   └── PageHeader.tsx
│   │   │   ├── PageStates
│   │   │   │   ├── index.ts
│   │   │   │   └── PageStates.tsx
│   │   │   ├── ProfileDropdownMenu
│   │   │   │   └── index.tsx
│   │   │   ├── RouteDebug.tsx
│   │   │   ├── ui
│   │   │   │   ├── accordion
│   │   │   │   │   ├── accordion.test.tsx
│   │   │   │   │   ├── accordion.tsx
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── alert-dialog
│   │   │   │   │   ├── alert-dialog.test.tsx
│   │   │   │   │   ├── alert-dialog.tsx
│   │   │   │   │   └── index.ts
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── button.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── date-formatters.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── form-field.tsx
│   │   │   │   ├── index.ts
│   │   │   │   ├── input.tsx
│   │   │   │   ├── label.tsx
│   │   │   │   ├── pagination.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── sheet.tsx
│   │   │   │   ├── simplealert
│   │   │   │   │   ├── index.ts
│   │   │   │   │   └── SimpleAlert.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── table-pagination
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── table-pagination.test.tsx
│   │   │   │   │   └── table-pagination.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   └── toast
│   │   │   │       ├── index.ts
│   │   │   │       ├── toast.test.tsx
│   │   │   │       └── toast.tsx
│   │   │   └── UserProfileDropdown
│   │   │       └── index.tsx
│   │   ├── config
│   │   │   ├── api_config.ts
│   │   │   ├── index.ts
│   │   │   ├── routes_config.ts
│   │   │   └── theme_config.ts
│   │   ├── contexts
│   │   │   ├── index.ts
│   │   │   └── ToastContext.tsx
│   │   ├── env.d.ts
│   │   ├── hooks
│   │   │   ├── api
│   │   │   │   ├── index.ts
│   │   │   │   └── useCustomerApi.ts
│   │   │   ├── useApi.ts
│   │   │   └── useToast.ts
│   │   ├── index.css
│   │   ├── index.tsx
│   │   ├── layouts
│   │   │   ├── AuthLayout
│   │   │   │   └── index.tsx
│   │   │   ├── CadastrosLayout
│   │   │   │   ├── components
│   │   │   │   │   └── CadastrosMenu.tsx
│   │   │   │   └── index.tsx
│   │   │   └── MainLayout
│   │   │       ├── components
│   │   │       │   ├── Footer.tsx
│   │   │       │   ├── Header.tsx
│   │   │       │   ├── index.ts
│   │   │       │   ├── Navbar.tsx
│   │   │       │   └── UserMenu.tsx
│   │   │       ├── index.tsx
│   │   │       └── teste.tsx
│   │   ├── lib
│   │   │   └── utils.ts
│   │   ├── main.tsx
│   │   ├── pages
│   │   │   ├── Auth
│   │   │   │   ├── components
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── LoginHeader.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   └── useLoginForm.ts
│   │   │   │   └── index.tsx
│   │   │   ├── Company
│   │   │   │   ├── components
│   │   │   │   │   ├── CompanyForm.tsx
│   │   │   │   │   ├── CompanyHeader.tsx
│   │   │   │   │   └── CompanyList.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   ├── useCompanyForm.ts
│   │   │   │   │   └── useCompanyList.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── routes.ts
│   │   │   │   ├── services
│   │   │   │   │   └── company.ts
│   │   │   │   ├── structure
│   │   │   │   │   └── company_structure.md
│   │   │   │   ├── types
│   │   │   │   │   ├── company_types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── utils
│   │   │   │       └── validators.ts
│   │   │   ├── Contract
│   │   │   │   ├── ContractForm
│   │   │   │   │   └── index.tsx
│   │   │   │   └── ContractList
│   │   │   │       └── index.tsx
│   │   │   ├── Customer
│   │   │   │   ├── components
│   │   │   │   │   ├── CustomerDetails.tsx
│   │   │   │   │   ├── CustomerForm.tsx
│   │   │   │   │   ├── CustomerHeader.tsx
│   │   │   │   │   ├── CustomerImport.tsx
│   │   │   │   │   ├── CustomerList.tsx
│   │   │   │   │   ├── CustomerToolbar.tsx
│   │   │   │   │   ├── DeleteConfirmation.tsx
│   │   │   │   │   ├── FeedbackMessage.tsx
│   │   │   │   │   └── ImportHelpDialog.tsx
│   │   │   │   ├── customer_tree.md
│   │   │   │   ├── hooks
│   │   │   │   │   ├── useCustomerForm.ts
│   │   │   │   │   └── useCustomerList.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── routes
│   │   │   │   │   └── index.tsx
│   │   │   │   ├── services
│   │   │   │   │   ├── customer.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── types
│   │   │   │   │   ├── customer_types.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── utils
│   │   │   │       └── validators.ts
│   │   │   ├── Help
│   │   │   │   └── index.tsx
│   │   │   ├── Home
│   │   │   │   ├── components
│   │   │   │   │   └── FeatureCard.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── Login
│   │   │   │   ├── types
│   │   │   │   │   └── index.ts
│   │   │   │   └── utils
│   │   │   │       └── validators.ts
│   │   │   ├── NotFound
│   │   │   │   ├── index.tsx
│   │   │   │   └── NotFound.tsx
│   │   │   ├── Quote
│   │   │   │   ├── QuoteForm
│   │   │   │   │   └── index.tsx
│   │   │   │   └── QuoteList
│   │   │   │       └── index.tsx
│   │   │   ├── Supplies
│   │   │   │   └── index.tsx
│   │   │   ├── Supply
│   │   │   │   ├── components
│   │   │   │   │   ├── SupplyForm.tsx
│   │   │   │   │   ├── SupplyHeader.tsx
│   │   │   │   │   └── SupplyList.tsx
│   │   │   │   ├── index.tsx
│   │   │   │   └── __tests__
│   │   │   │       └── SupplyList.test.tsx
│   │   │   ├── Tax
│   │   │   │   ├── components
│   │   │   │   │   ├── index.ts
│   │   │   │   │   ├── TaxForm.tsx
│   │   │   │   │   ├── TaxHeader.tsx
│   │   │   │   │   └── TaxList.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   └── useTaxList.ts
│   │   │   │   ├── index.tsx
│   │   │   │   ├── routes
│   │   │   │   │   └── index.ts
│   │   │   │   ├── services
│   │   │   │   │   └── TaxService.ts
│   │   │   │   └── types
│   │   │   │       ├── index.ts
│   │   │   │       └── tax_types.ts
│   │   │   └── UserProfile
│   │   │       ├── index.tsx
│   │   │       ├── routes.tsx
│   │   │       └── SessionInfoPage.tsx
│   │   ├── providers
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── routes
│   │   │   ├── components
│   │   │   │   ├── LayoutWrapper.tsx
│   │   │   │   └── PageLoader.tsx
│   │   │   ├── config
│   │   │   │   └── route-paths.ts
│   │   │   ├── index.tsx
│   │   │   └── modules
│   │   │       ├── cadastros.routes.tsx
│   │   │       ├── comercial.routes.tsx
│   │   │       ├── customer.routes.tsx
│   │   │       ├── index.ts
│   │   │       └── tax.routes.tsx
│   │   ├── services
│   │   │   ├── api
│   │   │   └── apiMainService
│   │   │       ├── ApiService.ts
│   │   │       ├── auth
│   │   │       │   ├── index.ts
│   │   │       │   └── tokenManager.ts
│   │   │       ├── config
│   │   │       │   ├── apiConfig.ts
│   │   │       │   └── index.ts
│   │   │       ├── headers
│   │   │       │   ├── headerManager.ts
│   │   │       │   └── index.ts
│   │   │       ├── index.ts
│   │   │       ├── interceptors
│   │   │       │   ├── index.ts
│   │   │       │   ├── requestInterceptor.ts
│   │   │       │   └── responseInterceptor.ts
│   │   │       ├── requests
│   │   │       │   ├── baseRequests.ts
│   │   │       │   ├── fileRequests.ts
│   │   │       │   ├── index.ts
│   │   │       │   └── paginatedRequests.ts
│   │   │       └── utils
│   │   │           ├── errorHandler.ts
│   │   │           ├── index.ts
│   │   │           ├── logger.ts
│   │   │           └── retryManager.ts
│   │   ├── setupTests.ts
│   │   ├── styles
│   │   │   └── globals.css
│   │   ├── types
│   │   │   ├── api_types.ts
│   │   │   ├── axios.types.ts
│   │   │   ├── index.ts
│   │   │   └── routes.types.ts
│   │   ├── utils
│   │   │   ├── date.ts
│   │   │   ├── lazyImport.ts
│   │   │   ├── logger copy.ts
│   │   │   └── logger.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── LICENSE
├── README.md
└── scripts

121 directories, 309 files