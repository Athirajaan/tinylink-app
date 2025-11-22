TinyLink - Professional URL Shortener

A production-ready URL shortener built with Node.js, Express, EJS, Tailwind CSS, and PostgreSQL (Neon).

tinylink-app/
├── src/
│   ├── server.js                 # Application entry point
│   ├── app.js                    # Express configuration
│   ├── config/
│   │   ├── db.js                 # Database connection pool
│   │   └── constants.js          # HTTP status codes & enums
│   ├── models/
│   │   └── Link.js               # Link model with queries
│   ├── controllers/
│   │   ├── LinksController.js    # API endpoints
│   │   ├── RedirectController.js # Redirect logic
│   │   └── PagesController.js    # Page rendering
│   ├── routes/
│   │   ├── api.js                # API routes
│   │   └── web.js                # Web routes (ORDERED)
│   └── middleware/
│       ├── validators.js         # Input validation
│       └── errorHandler.js       # Error handling
├── views/
│   ├── dashboard.ejs             # Main dashboard
│   └── stats.ejs                 # Link statistics
├── package.json
├── .env.example
└── schema.sql

🎯 Key Features

✅ Code Validation: 6-8 alphanumeric characters
✅ HTTP Status Enums: No hardcoded status codes
✅ Atomic Click Tracking: Increment + update in one query
✅ Proper Error Handling: Global error handler with AppError class
✅ Route Ordering: Critical order in web.js to prevent conflicts
✅ PostgreSQL Constraints: Database-level validation
✅ Connection Pooling: Efficient database connections