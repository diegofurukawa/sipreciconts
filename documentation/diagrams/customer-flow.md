graph TD
    A[Customer Page] --> B[CustomerList]
    B --> C[useCustomerList Hook]
    C --> D[customerService]
    D --> E[ApiService]
    
    B --> F[CustomerToolbar]
    B --> G[Table Components]
    
    subgraph "Data Flow"
        C --> H[customers State]
        C --> I[loading State]
        C --> J[pagination State]
    end
    
    subgraph "API Calls"
        D --> K[list]
        D --> L[create]
        D --> M[update]
        D --> N[delete]
    end