

# Playwright TypeScript Automation Framework

## Framework Structure
```
├── config/                     # Configuration files
│   └── environment.config.ts   # Environment-specific configurations
├── pages/                      # Page Object Models
│   └── base.page.ts           # Base page with common methods
├── tests/                      # Test files
│   ├── e2e/                   # End-to-end tests
│   └── api/                   # API tests
├── fixtures/                   # Test fixtures and data
│   └── test-data/             # Test data files
├── utils/                     # Utility functions and helpers
│   ├── logger.ts             # Logging utility
│   └── helpers.ts            # Common helper functions
├── reports/                   # Test reports and screenshots
├── playwright.config.ts       # Playwright configuration
├── tsconfig.json             # TypeScript configuration
└── package.json              # Project dependencies
```

## Setup Instructions
1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Playwright browsers:
   ```bash
   npx playwright install
   ```

3. Run tests:
   - All tests: `npm test`
   - Headed mode: `npm run test:headed`
   - Specific test: `npm test tests/example.spec.ts`

## Key Features
- Page Object Model design pattern
- Multi-environment support
- Custom reporting
- Logging mechanism
- Reusable utilities
- Type safety with TypeScript 

