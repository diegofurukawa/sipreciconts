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
│   │   │   ├── authentication.py
│   │   │   ├── backends.py
│   │   │   ├── handlers.py
│   │   │   ├── settings.py
│   │   │   └── views.py
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
│   │   │   ├── asset_category.py
│   │   │   ├── asset_group.py
│   │   │   ├── asset_location.py
│   │   │   ├── asset_movement.py
│   │   │   ├── asset.py
│   │   │   ├── base.py
│   │   │   ├── company.py
│   │   │   ├── customer.py
│   │   │   ├── location.py
│   │   │   ├── managers.py
│   │   │   ├── supply.py
│   │   │   ├── tax.py
│   │   │   ├── types.py
│   │   │   ├── user.py
│   │   │   └── usersession.py
│   │   ├── serializers
│   │   │   ├── asset_category.py
│   │   │   ├── asset_group.py
│   │   │   ├── asset_movement.py
│   │   │   ├── asset.py
│   │   │   ├── auth.py
│   │   │   ├── base.py
│   │   │   ├── company.py
│   │   │   ├── customer.py
│   │   │   ├── supply.py
│   │   │   ├── tax.py
│   │   │   ├── user.py
│   │   │   └── usersession.py
│   │   ├── services
│   │   │   └── usersession.py
│   │   ├── tests.py
│   │   ├── urls.py
│   │   └── views
│   │       ├── asset_category.py
│   │       ├── asset_group.py
│   │       ├── asset_movement.py
│   │       ├── asset.py
│   │       ├── authentication.py
│   │       ├── base.py
│   │       ├── company.py
│   │       ├── customer.py
│   │       ├── login.py
│   │       ├── supply.py
│   │       ├── tax.py
│   │       ├── user.py
│   │       └── usersession.py
│   ├── apps
│   ├── backend
│   │   ├── asgi.py
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── wsgi.py
│   ├── BackEnd_tree.md
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
│   │   │   └── api.ts
│   │   ├── contexts
│   │   │   ├── CompanyContext.tsx
│   │   │   └── ToastContext.tsx
│   │   ├── core
│   │   │   └── auth
│   │   │       ├── context
│   │   │       │   ├── AuthContext.tsx
│   │   │       │   └── index.ts
│   │   │       ├── index.ts
│   │   │       └── services
│   │   │           ├── index.ts
│   │   │           ├── TokenService.ts
│   │   │           └── UserSessionService.ts
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
│   │   │   │   ├── components
│   │   │   │   │   ├── LoginForm.tsx
│   │   │   │   │   └── LoginHeader.tsx
│   │   │   │   ├── hooks
│   │   │   │   │   └── useLoginForm.ts
│   │   │   │   ├── index.tsx
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
│   │   │   │   ├── index.tsx
│   │   │   │   ├── SupplyForm.tsx
│   │   │   │   ├── SupplyHeader.tsx
│   │   │   │   ├── SupplyList.tsx
│   │   │   │   └── __tests__
│   │   │   │       └── SupplyList.test.tsx
│   │   │   └── Tax
│   │   │       ├── TaxForm.tsx
│   │   │       └── TaxList.tsx
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
│   │   │   └── api
│   │   │       ├── ApiService.ts
│   │   │       ├── base.ts
│   │   │       ├── config.ts
│   │   │       ├── constants.ts
│   │   │       ├── index.ts
│   │   │       ├── instance.ts
│   │   │       ├── interceptors.ts
│   │   │       ├── modules
│   │   │       │   ├── auth.ts
│   │   │       │   ├── company.ts
│   │   │       │   ├── customer.ts
│   │   │       │   └── tax.ts
│   │   │       ├── supply.ts
│   │   │       └── utils.ts
│   │   ├── setupTests.ts
│   │   ├── styles
│   │   │   └── globals.css
│   │   ├── types
│   │   │   ├── api.types.ts
│   │   │   ├── auth.types.ts
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
└── README.md

94 directories, 263 files