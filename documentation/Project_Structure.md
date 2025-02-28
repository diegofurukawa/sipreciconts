.
├── backend
│   ├── api
│   │   ├── admin
│   │   │   ├── asset_location.py
│   │   │   ├── assets.py
│   │   │   ├── base.py
│   │   │   ├── company.py
│   │   │   ├── customer.py
│   │   │   ├── location.py
│   │   │   ├── supply.py
│   │   │   ├── tax.py
│   │   │   ├── user.py
│   │   │   └── usersession.py
│   │   ├── apps.py
│   │   ├── auth_custom
│   │   │   ├── authentication_admin.py
│   │   │   ├── backends_admin.py
│   │   │   ├── handlers_admin.py
│   │   │   ├── settings_admin.py
│   │   │   └── views_admin.py
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
├── DEV_DIARY.md
├── frontend
│   ├── eslint.config.js
│   ├── frontend_tree.md
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
│   │   ├── components
│   │   │   ├── ErrorBoundary
│   │   │   │   ├── ApiErrorBoundary.tsx
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
│   │   │   ├── PrivateRoute
│   │   │   │   └── index.tsx
│   │   │   ├── PrivateRoute.tsx
│   │   │   ├── RouteDebug.tsx
│   │   │   └── ui
│   │   │       ├── accordion
│   │   │       │   ├── accordion.test.tsx
│   │   │       │   ├── accordion.tsx
│   │   │       │   └── index.tsx
│   │   │       ├── alert-dialog
│   │   │       │   ├── alert-dialog.test.tsx
│   │   │       │   ├── alert-dialog.tsx
│   │   │       │   └── index.ts
│   │   │       ├── avatar.tsx
│   │   │       ├── button.tsx
│   │   │       ├── card.tsx
│   │   │       ├── date-formatters.tsx
│   │   │       ├── dialog.tsx
│   │   │       ├── dropdown-menu.tsx
│   │   │       ├── form-field.tsx
│   │   │       ├── index.ts
│   │   │       ├── input.tsx
│   │   │       ├── label.tsx
│   │   │       ├── pagination.tsx
│   │   │       ├── progress.tsx
│   │   │       ├── select.tsx
│   │   │       ├── sheet.tsx
│   │   │       ├── simplealert
│   │   │       │   ├── index.ts
│   │   │       │   └── SimpleAlert.tsx
│   │   │       ├── skeleton.tsx
│   │   │       ├── switch.tsx
│   │   │       ├── table-pagination
│   │   │       │   ├── index.ts
│   │   │       │   ├── table-pagination.test.tsx
│   │   │       │   └── table-pagination.tsx
│   │   │       ├── table.tsx
│   │   │       └── toast
│   │   │           ├── index.ts
│   │   │           ├── toast.test.tsx
│   │   │           └── toast.tsx
│   │   ├── config
│   │   │   ├── api_config.ts
│   │   │   ├── auth_config.ts
│   │   │   ├── index.ts
│   │   │   ├── routes_config.ts
│   │   │   └── theme_config.ts
│   │   ├── contexts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── CompanyContext.tsx
│   │   │   ├── index.ts
│   │   │   └── ToastContext.tsx
│   │   ├── env.d.ts
│   │   ├── hooks
│   │   │   ├── api
│   │   │   │   ├── index.ts
│   │   │   │   └── useCustomerApi.ts
│   │   │   ├── useApi.ts
│   │   │   ├── useAuth.ts
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
│   │   │   │   ├── types
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
│   │   │   │   ├── types
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
│   │   │   └── Tax
│   │   │       ├── components
│   │   │       │   ├── index.ts
│   │   │       │   ├── TaxForm.tsx
│   │   │       │   └── TaxList.tsx
│   │   │       ├── hooks
│   │   │       │   └── useTaxList.ts
│   │   │       ├── index.tsx
│   │   │       ├── routes
│   │   │       │   └── index.ts
│   │   │       ├── services
│   │   │       │   └── TaxService.ts
│   │   │       └── types
│   │   │           ├── index.ts
│   │   │           └── tax_types.ts
│   │   ├── providers
│   │   │   └── index.tsx
│   │   ├── react-app-env.d.ts
│   │   ├── reportWebVitals.ts
│   │   ├── routes
│   │   │   ├── components
│   │   │   │   ├── LayoutWrapper.tsx
│   │   │   │   ├── PageLoader.tsx
│   │   │   │   └── PrivateRoute.tsx
│   │   │   ├── config
│   │   │   │   └── route-paths.ts
│   │   │   ├── index.tsx
│   │   │   └── modules
│   │   │       ├── cadastros.routes.tsx
│   │   │       ├── comercial.routes.tsx
│   │   │       ├── customer.routes.tsx
│   │   │       └── index.ts
│   │   ├── services
│   │   │   ├── api
│   │   │   │   ├── ApiService.ts
│   │   │   │   ├── base.ts
│   │   │   │   ├── config.ts
│   │   │   │   ├── constants.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── instance.ts
│   │   │   │   ├── interceptors.ts
│   │   │   │   ├── supply.ts
│   │   │   │   ├── TokenService.ts
│   │   │   │   ├── UserSessionService.ts
│   │   │   │   └── utils.ts
│   │   │   └── modules
│   │   │       ├── auth.ts
│   │   │       ├── company copy.ts
│   │   │       ├── company.ts
│   │   │       ├── customer.ts
│   │   │       └── Tax
│   │   │           ├── index.ts
│   │   │           └── tax copy.ts
│   │   ├── setupTests.ts
│   │   ├── styles
│   │   │   └── globals.css
│   │   ├── types
│   │   │   ├── api.types.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── axios.types.ts
│   │   │   ├── bkp
│   │   │   │   ├── company.ts
│   │   │   │   ├── customer.ts
│   │   │   │   ├── index.ts
│   │   │   │   ├── supply.ts
│   │   │   │   └── tax.ts
│   │   │   ├── index.ts
│   │   │   └── routes.types.ts
│   │   ├── utils
│   │   │   └── date.ts
│   │   └── vite-env.d.ts
│   ├── tailwind.config.js
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
├── LICENSE
├── README.md
└── scripts

99 directories, 274 files