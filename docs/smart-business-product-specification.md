# Smart Business — Complete Product & Business Specification

> **Document:** Smart Business — Product, Business & Technical Specification  
> **Status:** Canonical Product Definition  
> **Version:** 1.0  
> **Last Updated:** September 2026  
> **Product Type:** Multi-tenant SaaS + Physical-to-Digital Business Platform  
> **Primary Market:** Cafés, Restaurants, QSRs, Cloud Kitchens, Restaurant Groups & Franchises  
> **Initial Geography:** India  
> **Architecture:** Multi-tenant SaaS with DB-per-Business isolation  
> **Primary Database:** PostgreSQL / Neon  
> **Application:** Next.js + TypeScript  
> **ORM:** Prisma  
> **Infrastructure:** Neon + Infisical + Redis/Queue infrastructure as required

---

# 1. Executive Summary

**Smart Business** is an all-in-one operating system for cafés, restaurants, QSRs, cloud kitchens, restaurant groups, multi-outlet businesses, and franchises.

The platform is designed to connect the physical restaurant environment with a digital operating platform.

Smart Business starts with simple physical products such as:

- Google Review Cards
- Google Review Stands
- QR/NFC table products

and progressively introduces the business into a complete restaurant operating system:

```text
Physical Review Card
        ↓
Business discovers Smart Business
        ↓
SaaS Signup
        ↓
Digital Menu
        ↓
QR / NFC Ordering
        ↓
POS
        ↓
Kitchen Display System
        ↓
Inventory
        ↓
Recipe-Level Stock Management
        ↓
Customer Data
        ↓
CRM
        ↓
Retention & Win-Back
        ↓
Analytics
        ↓
More Orders
        ↓
More Outlets
        ↓
Multi-Brand
        ↓
Franchise Management
```

The long-term objective is not to build another digital menu or POS application.

The objective is to build a **restaurant business operating system** that connects:

```
Customers
    ↕
Ordering
    ↕
POS
    ↕
Kitchen
    ↕
Inventory
    ↕
Payments
    ↕
CRM
    ↕
Financials
    ↕
Analytics
    ↕
Multi-Outlet Management
    ↕
Franchise Management
```

---

# 2. Product Vision

## 2.1 Vision
Smart Business aims to become the operational infrastructure layer for restaurant businesses.

A restaurant should be able to manage:

- Businesses
- Brands
- Outlets
- Tables
- Menus
- Products
- Orders
- Kitchen operations
- Inventory
- Recipes
- Customers
- Payments
- Bills
- Aggregator orders
- Marketing
- Financial reconciliation
- Staff
- Franchises
- Royalties
- Analytics
from one platform.

---

# 3. Core Business Problem
Restaurants commonly operate with fragmented systems.

A typical restaurant may have:

```
Swiggy Tablet
Zomato Tablet
POS
Billing Software
Kitchen Display
WhatsApp
Google Reviews
Inventory Spreadsheet
Accounting Software
Customer Phone Numbers
Marketing Tools
Bank Statements
Manual Settlement Reconciliation
```

These systems often do not share a common operational data model.

This creates:

- fragmented order management
- duplicated work
- inconsistent menu availability
- manual inventory management
- poor customer data ownership
- difficult settlement reconciliation
- weak customer retention
- operational overhead
- poor visibility across outlets
- manual franchise calculations
Smart Business is designed to consolidate these operational workflows.

---

# 4. Target Market

## 4.1 Primary Customers

### Cafés
Examples:

- independent cafés
- specialty coffee shops
- dessert cafés
- bakery cafés

### Restaurants
Examples:

- casual dining
- fine dining
- family restaurants
- specialty restaurants

### QSRs
Examples:

- fast food
- burger chains
- pizza businesses
- beverage chains

### Cloud Kitchens
Businesses operating primarily through:

- Swiggy
- Zomato
- direct ordering
- delivery channels

### Restaurant Groups
Businesses operating multiple outlets.

### Multi-Brand Businesses
Businesses operating several brands from a common ownership structure.

### Franchises
Businesses with:

- franchise outlets
- centralized operations
- royalty structures
- multi-location reporting

---

# 5. Product Strategy
Smart Business follows a land-and-expand strategy.

## Stage 1 — Physical Acquisition
Start with low-friction physical products.

Examples:

- Google Review Cards
- Google Review Stands
- QR products
- NFC products

## Stage 2 — Digital Presence
Introduce:

- digital menus
- QR menus
- NFC menus
- business profiles
- table routing

## Stage 3 — Ordering
Introduce:

- customer ordering
- waiter ordering
- counter ordering
- order management

## Stage 4 — Operations
Introduce:

- POS
- KDS
- inventory
- recipes
- wastage
- food-cost tracking

## Stage 5 — Customer Intelligence
Introduce:

- customer profiles
- CRM
- WhatsApp
- win-back campaigns
- abandoned-cart recovery

## Stage 6 — Financial Intelligence
Introduce:

- payments
- billing
- aggregator settlement reconciliation
- financial reporting

## Stage 7 — Enterprise Expansion
Introduce:

- multi-brand management
- franchise management
- royalty management
- centralized reporting

---

# 6. Business Hierarchy
Smart Business uses a hierarchical business model.

```
Master User
    │
    ├── Business A
    │      │
    │      ├── Brand
    │      │
    │      ├── Outlet 1
    │      │      ├── Tables
    │      │      ├── Menu
    │      │      ├── Orders
    │      │      ├── POS
    │      │      └── Kitchen
    │      │
    │      └── Outlet 2
    │
    ├── Business B
    │      │
    │      └── Outlet(s)
    │
    └── Business C
```

A single master user may manage multiple distinct legal or operational businesses.

Example:

```
Palav Group
│
├── Palav Café
│   ├── Mumbai Outlet
│   └── Thane Outlet
│
├── Palav Foods
│   └── Cloud Kitchen
│
└── Palav Desserts
    ├── Mumbai Outlet
    └── Pune Outlet
```

The exact future distinction between:

- business
- legal entity
- brand
- franchise entity
remains extensible and should not be hard-coded prematurely.

---

# 7. Platform Architecture
Smart Business follows a **Control Plane + Tenant Database** architecture.

```
                         Smart Business
                              │
                ┌─────────────┴─────────────┐
                │                           │
          Control Plane                Tenant Plane
                │                           │
        Control PostgreSQL         Database per Business
                │                           │
        ┌───────┼────────┐          ┌────────┼────────┐
        │       │        │          │        │        │
       User   Business   RBAC     Outlet    Menu    Orders
        │       │        │          │        │        │
   Sessions   Plans   Permissions  Tables  Products Kitchen
```

---

# 8. Database Isolation Strategy

## 8.1 Control Database
One central PostgreSQL database stores platform-level information.

It contains:

- Users
- Businesses
- Memberships
- Roles
- Permissions
- Plans
- Entitlements
- Subscriptions
- Subscription events
- Purchase orders
- Payments
- Refunds
- Invoices
- Physical product information
- Review cards
- Card assignments
- Shipments
- Tenant database metadata
- Table routing
- Authentication sessions
- OTP challenges

---

# 9. Tenant Database
Each business receives its own tenant database.

Conceptually:

```
Control DB
    │
    ├── Business A
    │       └── Tenant DB A
    │
    ├── Business B
    │       └── Tenant DB B
    │
    └── Business C
            └── Tenant DB C
```

The tenant database stores operational business data.

Initial tenant models include:

- Location
- Table
- Menu
- Category
- Product
- ProductAvailability
- MenuCategory
- MenuProduct
- Order
- OrderItem
Future tenant modules include:

- Inventory
- Recipe
- Ingredient
- StockMovement
- Wastage
- Customer
- Payment
- Kitchen
- Staff
- Campaign
- Settlement
- Analytics data

---

# 10. Tenant Isolation Principles
The browser must never select the tenant database directly.

Correct flow:

```
Browser
   ↓
Authenticated User
   ↓
Business Membership
   ↓
Business
   ↓
TenantDatabase
   ↓
Secret Provider
   ↓
DATABASE_URL
   ↓
Tenant Prisma Client
```

The client must never receive:

- database URLs
- Neon credentials
- Infisical credentials
- database passwords
- provider API keys

---

# 11. Control Plane
The Control Plane is responsible for platform-level management.

## 11.1 User Management
The Control Plane manages:

- identity
- authentication
- memberships
- business access
- sessions

## 11.2 Business Management
The Control Plane manages:

- business creation
- business lifecycle
- membership
- subscription
- tenant database lifecycle

## 11.3 Subscription Management
The Control Plane manages:

- plans
- entitlements
- subscriptions
- subscription events

## 11.4 Physical Commerce
The Control Plane manages:

- physical product catalog
- purchase orders
- payments
- invoices
- review cards
- assignments
- shipments

---

# 12. Authentication
Smart Business uses application-managed authentication.

Current design:

```
Access JWT
≈ 15 minutes

DB-backed Session
≈ 30 days
```

Cookies:

```
smart_business_access
smart_business_refresh
```

Cookies are:

- HTTP-only
- server-managed
- not exposed to client JavaScript

---

# 13. Access Token
The access JWT contains:

- userId
- sessionId
- standard JWT claims
It intentionally does not contain:

- business ID
- role
- permissions
- tenant database URL
Business authorization is resolved server-side.

---

# 14. Refresh Token
Refresh tokens are:

- stored in the browser cookie as plaintext
- stored in the database only as SHA-256 hashes
Refresh flow:

```
Client
 ↓
Refresh Cookie
 ↓
Hash Token
 ↓
Find AuthSession
 ↓
Validate Session
 ↓
Rotate Token
 ↓
Issue New Access Token
```

Future hardening:

- full refresh-token family tracking
- token reuse detection
- stronger session risk controls

---

# 15. OTP Authentication
OTP currently uses:

- 6-digit OTP
- 10-minute TTL
- 60-second resend cooldown
- maximum 5 attempts
- SHA-256 hashing
- timing-safe comparison
Known error categories include:

```
INVALID_CHANNEL
RESEND_COOLDOWN
OTP_EXPIRED
OTP_INVALID
OTP_MAX_ATTEMPTS
OTP_NOT_FOUND
EMAIL_DELIVERY_FAILED
```

---

# 16. Password Security
Passwords are currently protected using Node.js `scrypt`.

Stored representation:

```
base64url(salt):base64url(hash)
```

Configuration:

- random 16-byte salt
- 64-byte derived key
Plaintext passwords are never stored.

---

# 17. Role-Based Access Control
Smart Business uses RBAC.

Core relationship:

```
User
  ↓
BusinessMembership
  ↓
Role
  ↓
RolePermission
  ↓
Permission
```

Initial roles:

```
OWNER
BRAND_MANAGER
OUTLET_CASHIER
KITCHEN_DISPLAY_OPERATOR
WAITER
```

Additional roles may be introduced later.

---

# 18. Permission Model
Permissions should be granular.

Example categories:

```
business.read
business.update

outlet.read
outlet.create
outlet.update

menu.read
menu.create
menu.update
menu.publish

product.read
product.create
product.update

order.read
order.create
order.update
order.cancel

inventory.read
inventory.update

customer.read
customer.update

analytics.read

staff.read
staff.manage
```

The exact permission catalog can expand as modules are implemented.

---

# 19. Business Onboarding
Business onboarding currently creates:

1. Business
2. Owner membership
3. Starter subscription
4. Subscription event
5. TenantDatabase record
6. Tenant PostgreSQL database
7. Tenant migrations
8. Tenant database secret
9. Tenant health verification
10. Initial location
Flow:

```
POST /api/businesses
        ↓
Create Business
        ↓
Create Owner Membership
        ↓
Create Starter Subscription
        ↓
Create TenantDatabase
        ↓
Provision Neon Database
        ↓
Run Tenant Migrations
        ↓
Store DATABASE_URL
        ↓
Health Check
        ↓
Tenant ACTIVE
        ↓
Create Initial Location
        ↓
Onboarding COMPLETE
```

Technical onboarding is currently complete without payment gating.

Commercial payment integration is a future concern.

---

# 20. Tenant Provisioning
Tenant provisioning uses infrastructure abstractions.

Components:

```
Tenant Resolver
      ↓
Tenant Provisioner
      ↓
Database Provider
      ↓
Migration Runner
      ↓
Secret Manager
      ↓
Health Verifier
```

Providers currently include:

```
Neon
Infisical
```

---

# 21. Tenant Provisioning Lease
Provisioning uses a lease mechanism to reduce concurrent provisioning.

The lease contains:

- lease ID
- lease expiration
Provisioning operations verify lease ownership before major external operations.

The system also supports:

- retry after failure
- deterministic project naming
- project-list reconciliation
- terminal-state lease cleanup
Known limitation:

Provider-level distributed fencing is not fully solved.

A lease cannot guarantee cancellation of an already-running external provider request after lease expiry.

---

# 22. Physical-to-Digital Acquisition
One of Smart Business's core differentiators is the physical-to-digital acquisition loop.

Initial products:

- Google Review Card
- Google Review Stand
These products connect a physical interaction with Smart Business.

---

# 23. Google Review Card
The card contains:

- QR code
- NFC tag
The tag should store a stable Smart Business URL/token.

Example:

```
Customer
   ↓
Tap NFC / Scan QR
   ↓
Smart Business Route
   ↓
Resolve Card
   ↓
Resolve Business
   ↓
Redirect to Google Review
```

The physical tag should not directly store the final Google destination.

This allows the destination to be changed later without replacing the physical card.

---

# 24. Review Card Management
Physical review cards should be treated as managed assets.

Core models:

```
ReviewCard
ReviewCardAssignment
CardShipment
```

ReviewCard represents the physical asset.

ReviewCardAssignment represents:

```
Business
    ↕
Review Card
```

CardShipment represents physical fulfillment.

---

# 25. Review Card Lifecycle
Conceptually:

```
CREATED
   ↓
IN_STOCK
   ↓
ASSIGNED
   ↓
ACTIVE
   ↓
REASSIGNED / REVOKED
```

Exact statuses can evolve with the physical commerce system.

---

# 26. QR/NFC Table Ordering
Each restaurant table can have a QR/NFC route.

Example:

```
/t/<token>
```

The token resolves through the Control Plane.

Flow:

```
Customer
 ↓
Scan QR / NFC
 ↓
/t/<token>
 ↓
Resolve TableRoute
 ↓
Resolve Business
 ↓
Resolve Tenant
 ↓
Load Menu
 ↓
Customer Orders
```

The token must not expose:

- tenant database credentials
- database IDs unnecessarily
- infrastructure secrets

---

# 27. TableRoute
Control Plane table routing contains:

- token
- businessId
- tenantKey
- tableId
- status
- timestamps
No cross-database foreign key is required.

The Control DB resolves the route and the application then accesses the tenant database.

---

# 28. Digital Menu
Smart Business provides digital menus for restaurants.

Core menu concepts:

```
Menu
Category
Product
MenuCategory
MenuProduct
ProductAvailability
```

A menu may contain:

```
Menu
 ├── Category
 │     ├── Product
 │     └── Product
 │
 ├── Category
 │     ├── Product
 │     └── Product
```

---

# 29. Menu Lifecycle
Menus support:

```
DRAFT
PUBLISHED
ARCHIVED
```

A business should be able to:

- create menu
- edit menu
- publish menu
- archive menu

---

# 30. Product Management
Products represent items sold by a restaurant.

A product contains business-facing information such as:

- name
- price
- description
- status
- availability
- category relationships
Product lifecycle:

```
ACTIVE
INACTIVE
ARCHIVED
```

---

# 31. Product Availability
Availability should be outlet-aware.

A product may be:

```
Available
Unavailable
Temporarily unavailable
```

Future availability dimensions may include:

- outlet
- time period
- menu
- inventory
- ingredient availability

---

# 32. Pricing
Pricing follows this precedence:

```
MenuProduct.priceOverrideMinor
        >
ProductAvailability.priceOverrideMinor
        >
Product.basePriceMinor
```

Prices should be stored in integer minor units.

Example:

```
₹199
→
19900 paise
```

This avoids floating-point financial errors.

---

# 33. Unified Ordering
Smart Business supports multiple order sources.

Initial sources:

```
CUSTOMER_TABLE
STAFF_MANUAL
```

Future sources:

```
COUNTER_POS
SWIGGY
ZOMATO
UBER_EATS
DIRECT_WEB
```

The long-term goal is a unified order stream.

---

# 34. Customer Self-Ordering
Customer flow:

```
Scan Table QR
    ↓
Digital Menu
    ↓
Select Products
    ↓
Cart
    ↓
Order
    ↓
Restaurant Receives Order
    ↓
Kitchen
    ↓
Preparation
    ↓
Serving
```

---

# 35. Waiter-Assisted Ordering
Waiters should be able to place orders on behalf of customers.

Source:

```
STAFF_MANUAL
```

The waiter can:

- select table
- browse menu
- add items
- modify quantities
- submit order
- monitor status
The order should still use the same backend order model as customer ordering.

---

# 36. Counter POS
The POS system is intended for:

- counter orders
- takeaway
- walk-in customers
- direct billing
Core capabilities:

- product selection
- quantity management
- discounts
- taxes
- payment
- billing
- order completion

---

# 37. Order Data Integrity
Order items must store immutable financial snapshots.

Example:

```
productName
unitPriceMinor
quantity
totalMinor
tax
discount
```

The historical order must not change when the product's current price changes.

Example:

```
Product today = ₹250

Old order:
Product = ₹200

Future product price changes
        ↓
Old order remains ₹200
```

---

# 38. Server-Side Pricing
Financial totals must be calculated server-side.

The client must not be trusted for:

- price
- tax
- discount
- total
- payable amount
The server validates the current product and pricing configuration before creating the order.

---

# 39. Order Lifecycle
Core lifecycle:

```
PENDING
   ↓
ACCEPTED
   ↓
PREPARING
   ↓
READY
   ↓
SERVED
   ↓
COMPLETED
```

Cancellation:

```
PENDING → CANCELED
ACCEPTED → CANCELED
```

Exact cancellation rules may become stricter depending on payment and kitchen state.

---

# 40. Kitchen Display System
The Kitchen Display System (KDS) provides kitchen staff with an operational order queue.

Kitchen operators should see:

- new orders
- order items
- quantities
- table/order information
- preparation state
- priority
- timestamps
Primary states:

```
NEW
PREPARING
READY
```

These should map cleanly to the central order lifecycle.

---

# 41. KDS Workflow

```
Order Created
      ↓
Kitchen Receives Order
      ↓
Accept
      ↓
Preparing
      ↓
Ready
      ↓
Service / Dispatch
```

KDS should optimize for:

- low interaction overhead
- large touch targets
- high visibility
- real-time updates

---

# 42. Omnichannel Aggregator Hub
One major product objective is to eliminate the "tablet circus."

Instead of:

```
Swiggy Tablet
Zomato Tablet
Uber Eats Tablet
POS
```

Smart Business should provide:

```
             Smart Business
                    │
      ┌─────────────┼─────────────┐
      ↓             ↓             ↓
   Swiggy        Zomato       Uber Eats
      │             │             │
      └─────────────┼─────────────┘
                    ↓
              Unified Orders
```

---

# 43. Aggregator Orders
Aggregator orders should enter the same operational order pipeline.

Long-term model:

```
External Order
      ↓
Normalize
      ↓
Smart Business Order
      ↓
Kitchen
      ↓
Ready
      ↓
Dispatch
      ↓
External Status Sync
```

---

# 44. Aggregator Status Synchronization
Smart Business should synchronize supported statuses back to aggregators.

Target statuses:

```
Preparing
Ready
Dispatched
```

Exact provider capabilities will depend on each aggregator's APIs and commercial integrations.

---

# 45. Global Menu Kill-Switch
One of the most important operational features is a global availability switch.

Example:

```
Chicken Biryani
      ↓
Ingredient unavailable
      ↓
Global Disable
      ↓
Website       ❌
QR Menu       ❌
POS            ❌
Swiggy         ❌
Zomato         ❌
Uber Eats      ❌
```

The objective is to avoid staff manually disabling the same item on multiple platforms.

---

# 46. Menu Availability Architecture
Availability should eventually support:

```
Global Availability
       ↓
Outlet Availability
       ↓
Channel Availability
```

Potential channels:

```
Dine-In
Website
POS
Swiggy
Zomato
Uber Eats
```

---

# 47. Smart Inventory
Smart Business should provide inventory management connected directly to sales.

Inventory should support:

- raw materials
- stock quantities
- units
- purchases
- adjustments
- wastage
- spoilage
- complimentary items
- recipe deductions

---

# 48. Recipe-Level Inventory
Each menu product may map to ingredients.

Example:

```
Chicken Burger
│
├── Bun        1 unit
├── Chicken    150 g
├── Cheese     1 slice
├── Sauce      20 g
└── Lettuce    30 g
```

When an order is completed:

```
Chicken Burger × 1
        ↓
Recipe
        ↓
Deduct:
Bun        -1
Chicken    -150g
Cheese     -1
Sauce      -20g
Lettuce    -30g
```

---

# 49. Inventory Deduction Trigger
The exact deduction trigger must be defined carefully.

The intended product behavior is:

```
Order completed
      ↓
Recipe resolved
      ↓
Raw materials deducted
      ↓
Stock movement recorded
```

The implementation must be idempotent so that duplicate order events do not double-deduct stock.

---

# 50. Inventory Stock Movements
Inventory should maintain a ledger.

Example:

```
PURCHASE
SALE_CONSUMPTION
WASTAGE
SPOILAGE
ADJUSTMENT
TRANSFER
RETURN
```

A stock ledger is preferable to silently mutating a quantity without historical context.

---

# 51. Wastage & Spoilage
Restaurants should be able to record:

- food wastage
- spoiled inventory
- damaged stock
- expired ingredients
- complimentary items
- staff meals
- operational loss
Example:

```
Chicken
Purchased: 50 kg
Sales Consumption: 43 kg
Wastage: 2 kg
Spoilage: 1 kg
Adjustment: 1 kg
Expected Remaining: 3 kg
```

The system should make unexplained stock variance visible.

---

# 52. Food Cost Analytics
Recipe and inventory data should eventually calculate:

```
Food Cost %
Gross Margin
Ingredient Cost
Product Margin
Wastage Cost
Theoretical Stock
Actual Stock
Stock Variance
```

Example:

```
Selling Price = ₹300
Recipe Cost = ₹105

Gross Product Margin
= ₹195
```

The exact accounting treatment may depend on the restaurant's financial configuration.

---

# 53. Procurement
Smart Business should eventually support procurement.

Capabilities:

- suppliers
- purchase orders
- purchase order items
- receiving
- purchase prices
- stock entry
Long-term flow:

```
Low Stock
   ↓
Purchase Recommendation
   ↓
Purchase Order
   ↓
Supplier
   ↓
Goods Received
   ↓
Inventory Updated
```

---

# 54. Customer CRM
Smart Business should own a customer relationship layer.

Customer data may include:

- customer identity
- phone
- email
- order history
- preferred products
- visit frequency
- average order value
- last order
- outlet activity
- campaign history

---

# 55. Customer 360
Customer 360 should provide a consolidated view.

Example:

```
Customer
│
├── Profile
├── Orders
├── Total Spend
├── Average Order Value
├── Last Visit
├── Favorite Items
├── Favorite Outlet
├── Coupons
├── Campaigns
├── WhatsApp Interactions
└── Retention Status
```

---

# 56. WhatsApp-First CRM
WhatsApp is intended to be a primary customer communication channel.

Potential workflows:

```
Order Completed
      ↓
Digital Bill
      ↓
WhatsApp
```

and:

```
Customer Inactive
      ↓
Win-Back Eligibility
      ↓
WhatsApp Campaign
```

and:

```
Cart Abandoned
      ↓
Recovery Workflow
      ↓
WhatsApp Message
```

Actual WhatsApp Business API integration remains a future implementation.

---

# 57. Digital Bills
After settlement, Smart Business should be able to send digital bills.

Example:

```
Order
 ↓
Payment
 ↓
Settlement
 ↓
Invoice / Bill
 ↓
WhatsApp
```

Potential delivery channels:

- WhatsApp
- email
- SMS
- web receipt
WhatsApp is the intended primary channel.

---

# 58. Win-Back Campaigns
Smart Business should identify inactive customers.

Example business rule:

```
No order for 30+ days
        ↓
Customer becomes eligible
        ↓
Campaign engine
        ↓
Personalized message
```

The 30-day threshold is a product target and should remain configurable.

---

# 59. Abandoned Cart Recovery
The platform should detect abandoned customer carts.

Potential flow:

```
Customer
 ↓
Opens Menu
 ↓
Adds Items
 ↓
Cart Created
 ↓
No Order
 ↓
Abandoned
 ↓
Recovery Eligibility
 ↓
WhatsApp / Other Channel
```

Recovery logic should avoid spam and should use configurable business rules.

---

# 60. Customer Segmentation
Future customer segments may include:

```
New Customer
Returning Customer
VIP
High Value
Inactive
At Risk
Frequent Customer
Occasional Customer
```

These are operational segmentation categories, not fixed assumptions.

---

# 61. Payments & Billing
Payment is a major future subsystem.

It must remain separate from:

```
Subscription
PurchaseOrder
Invoice
Payment
Refund
```

These are different financial concepts.

---

# 62. Payment Model
Conceptually:

```
Payment
├── amount
├── currency
├── status
├── provider
├── providerReference
├── paymentType
└── metadata
```

Possible statuses:

```
PENDING
AUTHORIZED
CAPTURED
FAILED
REFUNDED
PARTIALLY_REFUNDED
```

Exact states should be finalized with the payment architecture.

---

# 63. Payment Provider
No specific payment provider is currently considered the canonical implementation.

The platform must not assume:

```
Razorpay
Stripe
```

or any other provider until one is explicitly selected.

The architecture should use a payment-provider abstraction.

---

# 64. Subscription Billing
Subscription billing is distinct from physical product purchasing.

Example:

```
Subscription
     ↓
Billing Period
     ↓
Payment Attempt
     ↓
Payment
     ↓
Subscription Updated
```

Recurring billing should not be forced through the physical PurchaseOrder model.

---

# 65. Aggregator Settlement Reconciliation
Restaurants receive settlements from third-party aggregators.

Smart Business should compare:

```
Aggregator Report
       vs
Expected Settlement
       vs
Bank Deposit
```

Example:

```
Aggregator Gross Sales
        ↓
Commission
        ↓
Taxes / Adjustments
        ↓
Expected Payout
        ↓
Actual Bank Credit
```

The system should highlight:

- missing settlements
- delayed settlements
- commission discrepancies
- unexpected deductions
- payout mismatches

---

# 66. Settlement Reconciliation Workflow

```
Import Aggregator Data
        ↓
Normalize
        ↓
Match Orders
        ↓
Calculate Expected Payout
        ↓
Match Bank Transaction
        ↓
Reconciliation Result
```

Potential statuses:

```
MATCHED
PARTIAL
MISMATCH
MISSING
PENDING
```

---

# 67. Multi-Brand Management
A master business group may operate multiple brands.

Example:

```
Palav Group
│
├── Coffee Brand
├── Pizza Brand
├── Dessert Brand
└── Cloud Kitchen Brand
```

The platform should allow centralized management while maintaining brand-specific operational data.

---

# 68. Multi-Outlet Management
Each business may operate multiple physical locations.

Example:

```
Business
│
├── Mumbai
├── Thane
├── Pune
└── Navi Mumbai
```

Each location can have:

- tables
- menus
- products
- orders
- inventory
- staff
- kitchen
- customer activity

---

# 69. Franchise Management
Future franchise capabilities should support:

- franchise outlets
- franchise operators
- centralized brand management
- outlet-level reporting
- royalty calculation
Conceptually:

```
Brand Owner
      ↓
Franchise Agreement
      ↓
Franchise Outlet
      ↓
Sales
      ↓
Royalty
      ↓
Central Reporting
```

---

# 70. Royalty Management
Smart Business should eventually calculate franchise royalties automatically.

Example:

```
Outlet Sales
    ↓
Royalty Percentage
    ↓
Royalty Amount
```

Example only:

```
Monthly Sales = ₹10,00,000
Royalty = configured percentage
```

The percentage must be configurable per agreement and must not be hard-coded.

---

# 71. Centralized Financial Rollups
Business groups should see consolidated financial information.

Example:

```
Group
│
├── Brand A
│   ├── Outlet 1
│   └── Outlet 2
│
├── Brand B
│   ├── Outlet 3
│   └── Outlet 4
│
└── Cloud Kitchen
```

Dashboard:

```
Total Sales
Total Orders
Average Order Value
Food Cost
Gross Margin
Aggregator Sales
Direct Sales
Royalty
Outlet Performance
```

---

# 72. Analytics & Reporting
Analytics should exist at multiple levels.

## Outlet Level

```
Sales
Orders
AOV
Products
Peak Hours
Food Cost
Wastage
```

## Business Level

```
Outlet Comparison
Revenue
Profitability
Customers
Retention
Channels
```

## Group Level

```
Brand Performance
Outlet Performance
Revenue
Margins
Franchise Royalties
Aggregator Exposure
```

---

# 73. Core Analytics
The system should eventually provide:

```
Revenue
Orders
Average Order Value
Items Sold
Top Products
Low Performing Products
Peak Hours
Peak Days
Repeat Customers
New Customers
Customer Retention
Food Cost
Wastage
Aggregator Sales
Direct Sales
```

---

# 74. Operational Analytics
Restaurant operators should be able to understand:

```
How many orders are coming in?
Where are they coming from?
Which products sell the most?
Which products are unavailable?
Which ingredients are running low?
How much food is wasted?
Which outlets perform best?
Which customers are returning?
```

---

# 75. Subscription & Plans
Smart Business uses plan-based entitlements.

Core concepts:

```
Plan
PlanEntitlement
Subscription
SubscriptionEvent
```

Entitlements represent what a plan permits.

Example:

```
maxLocations
maxReviewCards
```

---

# 76. Starter Plan
The current seed contains a Starter plan.

Current seeded entitlements:

```
maxLocations = 3
maxReviewCards = 3
```

These are implementation seed values and may change with the commercial pricing strategy.

---

# 77. Entitlements vs Purchases
These concepts must remain separate.

### Entitlement
What the customer's plan allows.

Example:

```
maxLocations = 3
```

### Purchase Order
What the customer bought.

Example:

```
10 Review Cards
```

### Payment
A financial transaction.

### Subscription
The customer's current plan relationship.

These should not be conflated.

---

# 78. Subscription Lifecycle
Current subscription states include:

```
TRIAL
```

Future lifecycle states may include:

```
ACTIVE
PAUSED
PAST_DUE
CANCELED
EXPIRED
```

Current subscription events include:

```
CREATED
ACTIVATED
RENEWED
PLAN_CHANGED
PAYMENT_FAILED
PAUSED
RESUMED
CANCEL_REQUESTED
CANCELED
EXPIRED
```

---

# 79. Physical Product Commerce
Smart Business may sell physical products directly.

Potential products:

```
Google Review Card
Google Review Stand
Table QR Card
Table NFC Card
Ordering Stand
Future NFC / QR Products
```

The commerce layer should support:

- catalog
- pricing
- purchase orders
- payments
- invoices
- fulfillment
- shipment
- assignment

---

# 80. Physical Product Lifecycle
Example:

```
Product Catalog
      ↓
Customer Purchase
      ↓
Payment
      ↓
Purchase Order
      ↓
Fulfillment
      ↓
Shipment
      ↓
Delivery
      ↓
Assignment
      ↓
Activation
```

---

# 81. Security Architecture
Security is a first-class requirement.

Principles:

- tenant isolation
- server-side authorization
- least privilege
- secret isolation
- secure cookies
- password hashing
- OTP hashing
- database separation
- no client-side tenant selection
- auditability
- financial immutability

---

# 82. Secret Management
Production secrets should be managed through a secret manager.

Current infrastructure includes Infisical.

Tenant database secret pattern:

```
/tenants/{tenantKey}/DATABASE_URL
```

The application should never expose secret values through APIs.

---

# 83. Tenant Resolution
Tenant resolution should be deterministic.

Conceptually:

```
Authenticated User
       ↓
Business Membership
       ↓
Business
       ↓
TenantDatabase
       ↓
Tenant Secret
       ↓
Tenant Prisma Client
```

Tenant resolution must happen server-side.

---

# 84. API Security
APIs should validate:

- authentication
- session
- business membership
- role
- permission
- tenant availability
- request payload
- ownership/access boundaries
A valid authenticated user must not automatically gain access to every business.

---

# 85. Financial Data Integrity
Financial records should preserve historical truth.

Examples:

- order prices should be immutable
- invoices should preserve historical values
- payment references should remain traceable
- settlement records should preserve source data
- refunds should not overwrite original payments

---

# 86. Auditability
Future operational modules should generate audit events for sensitive operations.

Examples:

```
Menu Published
Product Disabled
Price Changed
Order Canceled
Inventory Adjusted
Wastage Recorded
Payment Refunded
Role Changed
Business Settings Changed
```

The audit system should retain:

- actor
- action
- entity
- timestamp
- relevant metadata

---

# 87. Infrastructure
Current infrastructure direction:

```
Next.js
TypeScript
Prisma
PostgreSQL
Neon
Infisical
Redis / Queue Infrastructure
```

---

# 88. Application Layer
The application is based on Next.js and TypeScript.

Responsibilities include:

- web application
- API routes
- authentication
- authorization
- tenant resolution
- business onboarding
- menu APIs
- ordering APIs
- future operational APIs

---

# 89. Prisma
Prisma is used as the ORM.

Current stable toolchain:

```
prisma = 7.10.0
@prisma/client = 7.10.0
@prisma/adapter-pg = 7.10.0
```

Both Control and Tenant schemas are generated separately.

---

# 90. PostgreSQL
PostgreSQL is the primary database.

The architecture uses:

```
Control PostgreSQL
        +
One PostgreSQL Tenant DB per Business
```

Neon is the current database provider.

---

# 91. Neon
The current tenant database provider is Neon.

Current architectural model:

```
One Business
      ↓
One Neon Project
      ↓
One Tenant Database
```

The implementation uses a provider abstraction so that the application is not permanently coupled to one infrastructure provider.

---

# 92. Infisical
Infisical is used for secret management.

Tenant database connection strings are stored in Infisical.

Example:

```
/tenants/tenant-xxxxx/DATABASE_URL
```

The API does not return this secret.

---

# 93. Redis and Background Processing
Redis/queue infrastructure is intended for asynchronous operations.

Potential workloads:

- audit events
- notifications
- CRM campaigns
- WhatsApp delivery
- settlement processing
- inventory processing
- analytics aggregation
- external integrations
The exact queue implementation should be introduced when required by the module.

---

# 94. Current Control Database Models
The current Control Plane contains conceptual models including:

```
User
Business
BusinessMembership
Role
Permission
RolePermission
Plan
PlanEntitlement
Subscription
SubscriptionEvent
TenantDatabase
AuthSession
```

Commerce and physical product models include:

```
CatalogProduct
ProductPrice
PurchaseOrder
PurchaseOrderItem
Payment
Refund
Invoice
ReviewCard
ReviewCardAssignment
CardShipment
```

Routing includes:

```
TableRoute
```

---

# 95. User Model
Current conceptual structure:

```
model User {
  id String
  email String
  phone String?
  passwordHash String?
  isEmailVerified Boolean
  isPhoneVerified Boolean
  status UserStatus
  createdAt DateTime
  updatedAt DateTime
}
```

A user can belong to multiple businesses.

---

# 96. Business Model
Current conceptual structure:

```
model Business {
  id String
  name String
  slug String
  status BusinessStatus
  createdAt DateTime
  updatedAt DateTime
}
```

A business has:

- memberships
- subscription
- tenant database
- physical product assignments
- table routes

---

# 97. Business Membership
A membership connects:

```
User
+
Business
+
Role
```

The relationship is unique per user/business combination.

This enables one user to manage multiple businesses.

---

# 98. Tenant Database Metadata
The Control Plane stores tenant infrastructure metadata.

Important fields include:

```
tenantKey
provider
neonProjectId
neonBranchId
databaseName
databaseHost
connectionSecretRef
status
schemaVersion
provisionedAt
lastMigrationAt
lastProvisioningError
```

---

# 99. Tenant Database States
Current lifecycle includes:

```
PROVISIONING
ACTIVE
FAILED
```

Additional states may be introduced later if operational requirements justify them.

---

# 100. Tenant Operational Schema
Current operational models:

```
Location
Table
Menu
Category
Product
ProductAvailability
MenuCategory
MenuProduct
Order
OrderItem
```

---

# 101. Location
A business can have multiple locations.

Location statuses:

```
ACTIVE
INACTIVE
ARCHIVED
```

Location is the primary operational boundary for:

- tables
- orders
- inventory
- kitchen
- staff

---

# 102. Table
Tables belong to locations.

Table statuses:

```
ACTIVE
INACTIVE
ARCHIVED
```

Tables can be associated with QR/NFC routes.

---

# 103. Menu
Menu statuses:

```
DRAFT
PUBLISHED
ARCHIVED
```

A location may expose one or more menus depending on future configuration.

---

# 104. Category
Category statuses:

```
ACTIVE
INACTIVE
ARCHIVED
```

Categories organize menu products.

---

# 105. Product
Product statuses:

```
ACTIVE
INACTIVE
ARCHIVED
```

Products are reusable business-level menu items inside the tenant operational database.

---

# 106. Product Availability
Availability controls whether a product can be ordered.

Availability may eventually depend on:

- outlet
- stock
- channel
- schedule
- manual disablement

---

# 107. Menu Relationships
Menu-to-category:

```
Menu
 ↓
MenuCategory
 ↓
Category
```

Menu-to-product:

```
Menu
 ↓
MenuProduct
 ↓
Product
```

This allows menus to be assembled independently of the product master.

---

# 108. Order Source
Current order sources:

```
CUSTOMER_TABLE
STAFF_MANUAL
```

Future sources may include:

```
COUNTER_POS
SWIGGY
ZOMATO
UBER_EATS
DIRECT_WEB
```

---

# 109. Order Status
Current statuses:

```
PENDING
ACCEPTED
PREPARING
READY
SERVED
COMPLETED
CANCELED
```

---

# 110. API Surface

## Authentication

```
POST /api/auth/register/start
POST /api/auth/register/verify
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET  /api/auth/me
```

## Business

```
POST /api/businesses
POST /api/businesses/<businessId>/provision
```

The provisioning endpoint supports retrying failed tenant provisioning.

---

# 111. API Security Rules
APIs must never expose:

```
DATABASE_URL
Infisical secret values
Neon API keys
Provider credentials
Password hashes
Internal infrastructure secrets
```

---

# 112. Current Technical State
The following components are currently implemented and working:

- user registration
- email OTP verification
- login
- logout
- session refresh
- RBAC foundation
- business creation
- owner membership
- starter plan
- trial subscription
- tenant database record
- Neon tenant provisioning
- tenant migrations
- Infisical database secret
- health verification
- provisioning retry
- provisioning lease
- initial location creation
- business onboarding API

---

# 113. Current Development State
The Business Onboarding API has been tested end-to-end.

Current successful flow:

```
Create Business
      ↓
Owner Membership
      ↓
Starter Subscription
      ↓
Tenant Provisioning
      ↓
Neon
      ↓
Tenant Migration
      ↓
Infisical
      ↓
Health Check
      ↓
ACTIVE Tenant
      ↓
Initial Location
```

---

# 114. Current Prisma State
The project was aligned from a development Prisma version to stable Prisma tooling.

Current versions:

```
Prisma 7.10.0
Prisma Client 7.10.0
Prisma PostgreSQL Adapter 7.10.0
```

The Control DB currently has the required migrations applied.

The provisioning lease migration was successfully applied.

---

# 115. Known Infrastructure Limitations
The following limitations are currently known.

## 115.1 External Provider Fencing
If a provisioning lease expires while an external Neon request is still running, a second process could potentially start provisioning.

## 115.2 Neon Create Race
List-then-create reconciliation is not provider-atomic.

A theoretical concurrent race could create duplicate projects.

## 115.3 Orphaned External Resources
If Neon creates a project but the Control DB fails before storing the metadata, deterministic project-name reconciliation reduces the orphan window but does not provide an absolute guarantee.

## 115.4 Migration Strategy
Tenant migrations are forward-only.

## 115.5 Payment Integration
No payment provider has been selected or integrated.

## 115.6 Automated Test Runner
A complete test runner is not currently configured.

---

# 116. Product Development Roadmap
The product should be developed incrementally.

---

## Phase 1 — Platform Foundation

### Completed / Current

- Authentication
- OTP
- Sessions
- Business creation
- RBAC foundation
- Plans
- Subscriptions
- Tenant database provisioning
- Neon integration
- Infisical integration
- Tenant resolution
- Initial location

---

## Phase 2 — Physical Product Acquisition
Build:

- Review Card
- Review Stand
- QR generation
- NFC routing
- Review Card assignment
- Card shipment
- Physical product management
Goal:

```
Physical Product
→ Smart Business Signup
```

---

## Phase 3 — Location & Table Management
Build:

- locations
- tables
- QR tokens
- NFC tokens
- table routes
- table management UI
Goal:

```
Physical Table
→ Digital Table
```

---

## Phase 4 — Menu Management
Build:

- menu CRUD
- categories
- products
- pricing
- availability
- publishing
- menu preview
Goal:

```
Restaurant
→ Digital Menu
```

---

## Phase 5 — Ordering
Build:

- customer menu
- cart
- customer ordering
- waiter ordering
- order lifecycle
- order management
Goal:

```
Digital Menu
→ Orders
```

---

## Phase 6 — POS
Build:

- counter ordering
- POS UI
- payment selection
- billing
- takeaway
- order settlement
Goal:

```
Counter
→ POS
```

---

## Phase 7 — Kitchen Display System
Build:

- KDS
- live orders
- preparation workflow
- ready queue
- kitchen timing
Goal:

```
Order
→ Kitchen
→ Ready
```

---

## Phase 8 — Inventory
Build:

- ingredients
- stock
- stock movements
- suppliers
- purchase orders
- receiving
- adjustments
Goal:

```
Orders
→ Inventory
```

---

## Phase 9 — Recipe Engine
Build:

- recipes
- recipe ingredients
- units
- quantity conversion
- recipe versioning if needed
- automated stock deduction
Goal:

```
Completed Order
→ Recipe
→ Stock Deduction
```

---

## Phase 10 — Wastage & Food Cost
Build:

- wastage
- spoilage
- complimentary items
- stock variance
- food-cost reporting
- product margin
Goal:

```
Inventory
→ Food Cost Intelligence
```

---

## Phase 11 — Customer CRM
Build:

- customer profiles
- order history
- customer 360
- segmentation
- customer analytics
Goal:

```
Orders
→ Customer Data
```

---

## Phase 12 — WhatsApp CRM
Build:

- WhatsApp integration
- digital bills
- campaigns
- win-back
- abandoned-cart recovery
Goal:

```
Customer Data
→ Retention
→ More Orders
```

---

## Phase 13 — Aggregator Integration
Build:

- Swiggy integration
- Zomato integration
- Uber Eats integration
- order normalization
- status synchronization
- menu availability synchronization
Goal:

```
Multiple Platforms
→ One Operational Inbox
```

---

## Phase 14 — Settlement Reconciliation
Build:

- aggregator reports
- settlement imports
- payout calculation
- bank reconciliation
- discrepancy detection
Goal:

```
Aggregator
→ Expected Payout
→ Bank
→ Reconciliation
```

---

## Phase 15 — Multi-Brand
Build:

- brand hierarchy
- group dashboards
- centralized controls
- brand-level analytics
Goal:

```
One Owner
→ Multiple Brands
```

---

## Phase 16 — Franchise Management
Build:

- franchise entities
- franchise agreements
- royalty configuration
- franchise reporting
- royalty calculations
- consolidated dashboards
Goal:

```
Brand
→ Franchise
→ Royalty
→ Centralized Reporting
```

---

# 117. Feature Matrix
FeatureStatusUser RegistrationImplementedEmail OTPImplementedLoginImplementedLogoutImplementedRefresh SessionsImplementedRBAC FoundationImplementedBusiness CreationImplementedOwner MembershipImplementedStarter PlanImplementedTrial SubscriptionImplementedTenant ProvisioningImplementedNeon IntegrationImplementedInfisical IntegrationImplementedTenant Health CheckImplementedProvisioning RetryImplementedProvisioning LeaseImplementedInitial LocationImplementedReview CardsPlannedReview StandsPlannedQR/NFC Review RoutingPlannedTable ManagementPlannedQR/NFC Table RoutingFoundation exists / Operational UI plannedDigital MenuPlannedMenu PublishingPlannedProduct ManagementPlannedCustomer OrderingPlannedWaiter OrderingPlannedCounter POSPlannedKDSPlannedSwiggy IntegrationPlannedZomato IntegrationPlannedUber Eats IntegrationPlannedGlobal Menu Kill-SwitchPlannedInventoryPlannedRecipe EnginePlannedAuto Stock DeductionPlannedWastage TrackingPlannedFood Cost AnalyticsPlannedCustomer CRMPlannedWhatsApp CRMPlannedDigital BillsPlannedWin-Back CampaignsPlannedAbandoned Cart RecoveryPlannedCustomer 360PlannedPayment IntegrationNot SelectedAggregator ReconciliationPlannedMulti-BrandPlannedFranchise ManagementPlannedRoyalty ManagementPlannedCentralized Financial RollupsPlannedAdvanced AnalyticsPlanned

---

# 118. Product Flywheel
The core Smart Business flywheel is:

```
                    ┌────────────────────┐
                    │ Physical Products  │
                    │ QR / NFC / Review  │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Business Acquired  │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Digital Menu       │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ QR / NFC Ordering  │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ POS + KDS          │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Inventory          │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Customer Data      │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ CRM / WhatsApp    │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Retention          │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ More Orders        │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ More Outlets       │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Multi-Brand        │
                    └─────────┬──────────┘
                              ↓
                    ┌────────────────────┐
                    │ Franchise          │
                    └────────────────────┘
```

---

# 119. Product Differentiation
Smart Business is intended to differentiate through the combination of several systems rather than through one isolated feature.

The platform combines:

```
Physical Products
+
Digital Menu
+
QR/NFC
+
Ordering
+
POS
+
KDS
+
Aggregator Integration
+
Inventory
+
Recipe Engine
+
CRM
+
WhatsApp
+
Financial Reconciliation
+
Multi-Brand
+
Franchise
```

The product therefore moves from:

```
Acquisition
```

to:

```
Operations
```

to:

```
Customer Intelligence
```

to:

```
Financial Intelligence
```

to:

```
Business Expansion
```

---

# 120. Anti-Tablet Circus Strategy
A core operational objective is reducing the number of separate systems restaurant staff must interact with.

Traditional:

```
Swiggy Tablet
Zomato Tablet
Uber Tablet
POS
Kitchen
Inventory
WhatsApp
Spreadsheet
```

Smart Business:

```
                    Smart Business
                         │
       ┌─────────────────┼─────────────────┐
       ↓                 ↓                 ↓
   Orders             Kitchen          Inventory
       │                 │                 │
       └─────────────────┼─────────────────┘
                         ↓
                       CRM
                         ↓
                    Analytics
```

The long-term goal is a unified operational workspace.

---

# 121. Global Operational Control
Smart Business should eventually allow operators to control restaurant operations centrally.

Example:

```
Chicken Biryani
        ↓
Ingredient Unavailable
        ↓
Disable Globally
        ↓
All Sales Channels Updated
```

This is particularly important for:

- multi-outlet businesses
- high-volume QSRs
- cloud kitchens
- franchise businesses

---

# 122. Data Ownership
The long-term platform should create a centralized operational data layer for each business.

Instead of:

```
Aggregator owns order data
POS owns billing data
WhatsApp owns customer communication
Spreadsheet owns inventory
```

Smart Business should become the operational system of record for the workflows it manages.

---

# 123. Source-of-Truth Principles
Potential source-of-truth model:

```
Identity
→ Smart Business Control Plane

Business
→ Smart Business Control Plane

Subscription
→ Smart Business Control Plane

Menu
→ Smart Business Tenant

Orders
→ Smart Business Tenant

Inventory
→ Smart Business Tenant

Customer
→ Smart Business Tenant

Payments
→ Financial subsystem

Aggregator Orders
→ Smart Business normalized operational record
```

External systems remain integration sources, not uncontrolled internal dependencies.

---

# 124. Idempotency
External integrations must be designed for idempotency.

Examples:

```
Aggregator Order
Payment Webhook
Settlement Import
Inventory Deduction
WhatsApp Delivery Event
```

Repeated delivery of the same event must not create duplicate business effects.

---

# 125. Event-Driven Expansion
As the platform grows, domain events can connect modules.

Example:

```
OrderCompleted
      ↓
 ┌────┼────────┬──────────┐
 ↓    ↓        ↓          ↓
Stock CRM    Analytics  Billing
```

Another example:

```
PaymentCaptured
      ↓
 ┌────┼──────────┐
 ↓    ↓          ↓
Order Invoice  Customer
```

Events should be introduced when module complexity justifies them.

---

# 126. Long-Term Platform Architecture
The mature architecture may evolve toward:

```
                         Smart Business
                              │
             ┌────────────────┼────────────────┐
             │                │                │
        Control Plane    Operational Plane   Intelligence
             │                │                │
        Identity            Orders          Analytics
        Businesses          POS             Reporting
        RBAC                KDS             Insights
        Plans               Inventory       Forecasting
        Billing             CRM
        Physical            Customers
        Products            Payments
                            Settlements
```

---

# 127. Operational Plane
The Operational Plane manages restaurant execution.

Core domains:

```
Location
Table
Menu
Product
Order
Kitchen
Inventory
Customer
Payment
```

---

# 128. Intelligence Plane
The Intelligence Plane eventually provides:

- analytics
- reporting
- customer segmentation
- product performance
- inventory insights
- food-cost analysis
- outlet comparison
- financial reconciliation
- operational alerts
Future machine-learning/AI capabilities may be added after reliable operational data exists.

---

# 129. AI Strategy
AI should not be the foundation of the platform.

The first requirement is high-quality structured operational data.

The sequence should be:

```
Operational System
        ↓
Reliable Data
        ↓
Analytics
        ↓
Automation
        ↓
AI Intelligence
```

Potential future AI applications:

- demand forecasting
- inventory prediction
- menu recommendations
- customer churn prediction
- campaign personalization
- anomaly detection
- settlement anomaly detection
- purchasing recommendations
These are future capabilities, not current MVP commitments.

---

# 130. Product Principles

## Principle 1 — Data Isolation
Every business must have strong tenant isolation.

## Principle 2 — Server Authority
The client must never be trusted for financial or authorization decisions.

## Principle 3 — Immutable Financial History
Historical orders, payments and invoices must preserve the values that existed at the time.

## Principle 4 — Operational Simplicity
Restaurant staff should perform common tasks with minimal interaction.

## Principle 5 — Unified Operations
Different sales channels should converge into one operational workflow.

## Principle 6 — Physical-to-Digital
Physical products should create a natural entry point into the SaaS platform.

## Principle 7 — Expand Without Rebuilding
A single outlet should be able to grow into:

```
Multi-Outlet
→ Multi-Brand
→ Franchise
```

without migrating to a completely different platform.

## Principle 8 — Provider Abstraction
External providers should be behind interfaces where practical.

Examples:

```
Payment Provider
Database Provider
Secret Provider
Messaging Provider
Aggregator Provider
```

## Principle 9 — Auditability
Important operational and financial actions should be traceable.

## Principle 10 — Idempotency
Distributed workflows must safely handle duplicate events.

---

# 131. Product Non-Goals
Smart Business should not attempt to become everything immediately.

The following should not be implemented prematurely:

- arbitrary accounting ERP
- full banking infrastructure
- custom payment network
- custom messaging network
- generalized e-commerce platform
- generalized HR platform
- generalized hospital/healthcare software
The platform should remain focused on restaurant and food-business operations.

---

# 132. Commercial Expansion
Potential revenue streams include:

```
SaaS Subscription
+
Physical Product Sales
+
Premium Modules
+
Multi-Outlet Plans
+
Enterprise Plans
+
Franchise Features
```

Exact pricing is intentionally not fixed in this specification.

---

# 133. Customer Expansion Path
A typical customer expansion path:

```
Single Café
   ↓
Digital Menu
   ↓
QR Ordering
   ↓
POS
   ↓
KDS
   ↓
Inventory
   ↓
CRM
   ↓
Second Outlet
   ↓
Multi-Outlet
   ↓
Multiple Brands
   ↓
Franchise
```

The product architecture should support this progression.

---

# 134. Example End-to-End Restaurant Workflow

```
Restaurant signs up
        ↓
Business created
        ↓
Tenant database provisioned
        ↓
Owner accesses dashboard
        ↓
Creates outlet
        ↓
Creates tables
        ↓
Creates menu
        ↓
Adds products
        ↓
Publishes menu
        ↓
Generates table QR/NFC
        ↓
Customer scans
        ↓
Customer browses menu
        ↓
Customer orders
        ↓
Order enters POS / Order Management
        ↓
KDS receives order
        ↓
Kitchen prepares order
        ↓
Order becomes READY
        ↓
Customer receives order
        ↓
Order becomes COMPLETED
        ↓
Inventory recipe deduction
        ↓
Customer profile updated
        ↓
Bill generated
        ↓
Bill delivered through WhatsApp
        ↓
Customer returns later
        ↓
CRM tracks activity
        ↓
Customer becomes inactive
        ↓
Win-back campaign
        ↓
Customer returns
```

---

# 135. Example Aggregator Workflow

```
Customer orders on Swiggy
        ↓
Swiggy Integration
        ↓
Smart Business
        ↓
Normalize Order
        ↓
Create Operational Order
        ↓
Kitchen
        ↓
Preparing
        ↓
Ready
        ↓
Dispatched
        ↓
Status synchronized
        ↓
Settlement later
        ↓
Reconciliation
```

---

# 136. Example Inventory Workflow

```
Ingredient Purchased
        ↓
Stock Received
        ↓
Inventory Updated
        ↓
Customer Orders Product
        ↓
Order Completed
        ↓
Recipe Resolved
        ↓
Ingredient Consumption
        ↓
Stock Deducted
        ↓
Stock Threshold Reached
        ↓
Low Stock Alert
        ↓
Purchase Recommendation
```

---

# 137. Example Franchise Workflow

```
Brand Owner
      ↓
Creates Franchise
      ↓
Franchise Outlet
      ↓
Outlet Sales
      ↓
Central System
      ↓
Royalty Calculation
      ↓
Financial Reporting
      ↓
Consolidated Dashboard
```

---

# 138. Example Customer Retention Workflow

```
Customer Visits
      ↓
Order Completed
      ↓
Customer Identified
      ↓
Bill Sent
      ↓
Customer Data Updated
      ↓
No Order for 30+ Days
      ↓
Win-Back Eligibility
      ↓
Campaign
      ↓
Customer Returns
      ↓
New Order
```

---

# 139. Future Integration Layer
Potential integrations:

```
Swiggy
Zomato
Uber Eats
Google Reviews
WhatsApp Business
Payment Providers
Banking / Financial Data
Email
SMS
Accounting Systems
```

Each integration should use a dedicated adapter/service layer rather than leaking provider-specific models throughout the core domain.

---

# 140. Integration Architecture
Preferred conceptual model:

```
External Provider
       ↓
Provider Adapter
       ↓
Integration Service
       ↓
Domain Model
       ↓
Operational System
```

Example:

```
Swiggy API
   ↓
Swiggy Adapter
   ↓
Aggregator Service
   ↓
Order Normalizer
   ↓
Order
```

---

# 141. Observability
The platform should eventually provide:

- structured logs
- metrics
- tracing
- provisioning diagnostics
- integration health
- queue health
- database health
Critical systems should expose operational status.

---

# 142. Reliability
Critical operations should be designed for:

- retries
- idempotency
- transaction boundaries
- failure recovery
- dead-letter handling where appropriate
- reconciliation
Particularly important:

```
Payments
Orders
Inventory
Provisioning
External Integrations
Settlement
```

---

# 143. Transaction Boundaries
Database transactions should be used for operations requiring atomicity.

Example business creation:

```
Business
+
Membership
+
Subscription
+
Subscription Event
+
TenantDatabase
```

should be created consistently within the Control DB transaction before external provisioning.

External provider operations cannot participate in the PostgreSQL transaction, so provisioning requires explicit state management and reconciliation.

---

# 144. Distributed Workflow Principle
External operations must be treated as distributed workflows.

Example:

```
Control DB
    ↓
Neon
    ↓
Migrations
    ↓
Infisical
    ↓
Health Check
```

Each stage can fail independently.

The system must therefore persist enough state to resume or reconcile safely.

---

# 145. Current Business Onboarding State Machine
Conceptually:

```
Business Created
       ↓
Tenant PROVISIONING
       ↓
Neon Project
       ↓
Tenant Migration
       ↓
Secret Stored
       ↓
Health Verified
       ↓
Tenant ACTIVE
       ↓
Initial Location
       ↓
Onboarding COMPLETE
```

Failure:

```
Any Stage
   ↓
FAILED
   ↓
Retry
```

---

# 146. API Response Principles
Public API responses should provide useful business state without leaking infrastructure details.

Good:

```
{
  "businessId": "...",
  "tenantDatabaseStatus": "ACTIVE",
  "onboardingStatus": "COMPLETE"
}
```

Bad:

```
{
  "databaseUrl": "...",
  "neonApiKey": "...",
  "infisicalSecret": "..."
}
```

---

# 147. Current Commercial State
Payment functionality is intentionally not implemented yet.

There is currently:

- no payment SDK integration
- no payment checkout
- no payment webhook
- no payment provider environment configuration
- no production payment provider selection
The existing subscription architecture should remain provider-neutral.

---

# 148. Future Billing Architecture
A mature billing system should separate:

```
Plan
Subscription
Invoice
Payment Attempt
Payment
Refund
Subscription Event
```

Potential relationship:

```
Subscription
    ↓
Invoice
    ↓
Payment Attempt
    ↓
Payment
    ↓
Subscription State
```

---

# 149. Future Analytics Architecture
Operational databases should not necessarily handle every analytical workload directly.

A future architecture may introduce:

```
Tenant Operational DB
        ↓
Events / CDC / ETL
        ↓
Analytics Store
        ↓
Dashboards
```

This should only be introduced when scale requires it.

---

# 150. Performance Principles
The platform should optimize for:

- small-business simplicity
- low latency
- predictable tenant isolation
- efficient indexes
- pagination
- caching where justified
- asynchronous heavy workloads
A small café should not become slow because another large restaurant group is generating high traffic.

This is one of the primary reasons for DB-per-business isolation.

---

# 151. Scaling Model
The intended scaling model is:

```
Business A
→ Tenant DB A

Business B
→ Tenant DB B

Business C
→ Tenant DB C
```

Traffic and data are naturally distributed across tenant databases.

The Control DB remains responsible for global platform metadata.

---

# 152. Small Business Performance
The system must remain usable for a small restaurant with:

- one location
- a few tables
- a small menu
- low order volume
without requiring enterprise-scale infrastructure.

The architecture should scale incrementally.

---

# 153. Enterprise Expansion
As a customer grows:

```
1 Outlet
    ↓
3 Outlets
    ↓
10 Outlets
    ↓
50 Outlets
    ↓
100+ Outlets
```

the platform should preserve the same core business model.

The architecture should support central management without sacrificing tenant isolation.

---

# 154. Data Governance
Important principles:

- minimize unnecessary personal data
- protect customer information
- restrict staff access
- maintain audit logs
- protect secrets
- preserve financial history
- avoid exposing infrastructure metadata
Specific regulatory requirements should be evaluated according to the jurisdictions and integrations eventually supported.

---

# 155. Product UI Structure
The eventual application can be organized around:

```
Dashboard
Businesses
Outlets
Tables
Menus
Products
Orders
POS
Kitchen
Inventory
Customers
CRM
Payments
Settlements
Analytics
Staff
Subscriptions
Physical Products
Settings
```

The exact navigation structure may evolve with UX testing.

---

# 156. Owner Dashboard
Potential owner dashboard:

```
Today's Sales
Today's Orders
Average Order Value
Active Orders
Kitchen Queue
Top Products
Low Stock
Customer Activity
Aggregator Sales
Settlement Alerts
```

For multi-outlet businesses:

```
Outlet Comparison
```

---

# 157. Outlet Dashboard
An outlet manager should see:

```
Today's Revenue
Orders
Tables
Kitchen
Inventory
Top Products
Low Stock
Customer Activity
```

---

# 158. Kitchen Dashboard
KDS should focus only on operational information.

Example:

```
NEW
────────────
Order #1023
Table 12
2 × Burger
1 × Fries

PREPARING
────────────
Order #1021

READY
────────────
Order #1018
```

---

# 159. POS Dashboard
POS should optimize for speed.

Typical workflow:

```
Select Table / Takeaway
        ↓
Select Product
        ↓
Quantity
        ↓
Discount / Tax
        ↓
Payment
        ↓
Complete
```

---

# 160. Inventory Dashboard
Inventory should expose:

```
Current Stock
Low Stock
Stock Movement
Wastage
Purchase Orders
Suppliers
Recipe Consumption
Food Cost
```

---

# 161. CRM Dashboard
CRM should expose:

```
Total Customers
New Customers
Returning Customers
Inactive Customers
High-Value Customers
Campaigns
Win-Back Opportunities
Abandoned Carts
```

---

# 162. Analytics Dashboard
Analytics should eventually support:

```
Today
Yesterday
7 Days
30 Days
Custom Range
```

with filters:

```
Business
Brand
Outlet
Channel
Product
Category
```

---

# 163. Multi-Outlet Reporting
A group owner should be able to compare:

```
Outlet A
Outlet B
Outlet C
```

against:

```
Revenue
Orders
AOV
Food Cost
Wastage
Customer Retention
Aggregator Share
```

---

# 164. Product Expansion Strategy
The platform should prioritize features that create a data or workflow dependency.

Example:

```
Menu
  ↓
Ordering
  ↓
Orders
  ↓
Customers
  ↓
CRM
```

Once the business depends on the platform operationally, additional modules become more valuable.

---

# 165. Core Data Network
The platform's long-term value increases as these datasets connect:

```
Menu
 ↓
Orders
 ↓
Customers
 ↓
Inventory
 ↓
Payments
 ↓
CRM
 ↓
Analytics
```

The connected data model is a key component of the product strategy.

---

# 166. Operational Intelligence
Eventually Smart Business should be able to answer questions such as:

```
Which product sells the most?
Which outlet has the highest AOV?
Which ingredients are being wasted?
Which products have low margins?
Which customers have not returned?
Which aggregator generates the most sales?
Which settlement is missing?
Which outlet is underperforming?
```

These should be backed by actual business data rather than assumptions.

---

# 167. Future Automation Engine
A future workflow engine can automate operational actions.

Example:

```
IF
ingredient stock < threshold

THEN
create purchase recommendation
```

Another:

```
IF
customer inactive > configured days

THEN
create win-back campaign candidate
```

Another:

```
IF
settlement mismatch detected

THEN
create reconciliation alert
```

---

# 168. Future Rules Engine
A rules engine may eventually centralize business rules.

Examples:

```
Inventory Rules
CRM Rules
Pricing Rules
Campaign Rules
Settlement Rules
Franchise Rules
```

This should be introduced only when multiple modules require reusable rules.

---

# 169. Future Search
As the system grows, global search could support:

```
Customer
Order
Product
Table
Outlet
Invoice
Payment
Settlement
Review Card
```

Search should remain tenant-scoped.

---

# 170. Future Notifications
Potential notification channels:

```
In-App
Email
WhatsApp
SMS
Push
```

Examples:

```
Low Stock
New Order
Payment Failure
Settlement Mismatch
Customer Win-Back
Subscription Event
Provisioning Failure
```

---

# 171. Physical Product Acquisition as a Moat
Physical products create a different acquisition channel than traditional SaaS.

Instead of:

```
Advertisement
→ Landing Page
→ Signup
```

Smart Business can also use:

```
Restaurant
→ Physical Review Card
→ Daily Usage
→ Smart Business Route
→ SaaS Discovery
```

The physical product becomes a persistent touchpoint.

---

# 172. Review Routing as a Platform Primitive
The routing infrastructure used for review cards can later support:

```
Review Routing
Table Routing
Menu Routing
Campaign Routing
Landing Page Routing
```

Conceptually:

```
Physical Token
      ↓
Smart Business Router
      ↓
Business Context
      ↓
Destination
```

This allows physical assets to become programmable.

---

# 173. NFC Strategy
NFC should not contain business-sensitive data.

It should contain a stable route.

Example:

```
https://smartbusiness.example/r/abc123
```

The server determines the final destination.

Benefits:

- destination can change
- asset can be revoked
- analytics can be added
- assignment can change
- security is centralized

---

# 174. QR Strategy
QR codes should follow the same principle.

QR:

```
Smart Business URL
        ↓
Resolver
        ↓
Business Context
        ↓
Destination
```

This avoids permanently encoding infrastructure details into printed materials.

---

# 175. Business Lifecycle
Business lifecycle should eventually support:

```
ACTIVE
SUSPENDED
ARCHIVED
```

Tenant lifecycle remains separate.

Example:

```
Business = ACTIVE
Tenant = PROVISIONING
```

This is valid during onboarding.

Business status and infrastructure status must not be conflated.

---

# 176. Subscription vs Business Lifecycle
A business may exist while its subscription changes.

Example:

```
Business
ACTIVE

Subscription
TRIAL
```

Later:

```
Business
ACTIVE

Subscription
ACTIVE
```

Or:

```
Business
ACTIVE

Subscription
PAST_DUE
```

Commercial enforcement should be handled separately from business identity.

---

# 177. Future Suspension Logic
Subscription state may eventually influence:

- feature access
- ordering
- dashboard access
- physical product purchases
However, destructive data deletion should not be tied directly to subscription expiration without explicit retention policies.

---

# 178. Data Retention
Historical records such as:

- orders
- payments
- invoices
- subscription events
- settlement records
- audit events
should generally remain available according to the platform's future retention policy.

Retention requirements should be finalized before implementing destructive deletion.

---

# 179. Backup & Recovery
Tenant databases should eventually have:

- automated backups
- recovery procedures
- migration rollback/recovery strategy
- tenant-level restoration strategy
The DB-per-tenant model makes tenant-level recovery more tractable.

---

# 180. Disaster Recovery
Future production architecture should define:

```
RPO
RTO
Backup Frequency
Recovery Testing
Tenant Restoration
Control DB Recovery
Secret Recovery
```

These are production requirements to be finalized before enterprise launch.

---

# 181. Testing Strategy
Testing should eventually cover:

## Unit Tests

- pricing
- permissions
- order transitions
- inventory calculations
- recipes
- royalty calculations

## Integration Tests

- authentication
- business creation
- tenant resolution
- tenant provisioning
- menu APIs
- order APIs

## End-to-End Tests

- signup
- onboarding
- menu creation
- customer ordering
- POS
- KDS
- payment
- billing

---

# 182. Security Testing
Production readiness should include:

- authentication testing
- authorization testing
- tenant isolation testing
- IDOR testing
- CSRF considerations
- cookie security
- rate limiting
- secret exposure testing
- webhook verification
- replay protection

---

# 183. Performance Testing
Important scenarios:

```
High Order Volume
Many Concurrent Customers
Large Menu
Many Outlets
Large Inventory
Large Customer Dataset
Aggregator Bursts
KDS Real-Time Updates
```

---

# 184. Migration Strategy
Tenant schema changes should be versioned.

Example:

```
Tenant Migration 001
Tenant Migration 002
Tenant Migration 003
```

Control and Tenant migrations should be managed independently.

The provisioning service should ensure a newly created tenant reaches the current schema version.

---

# 185. Tenant Schema Version
Control DB tracks:

```
schemaVersion
lastMigrationAt
```

This allows infrastructure tooling to understand tenant migration state.

Future tooling may detect:

```
Tenant A → v10
Tenant B → v10
Tenant C → v9
```

and migrate safely.

---

# 186. Platform Upgrade Strategy
Platform upgrades should avoid requiring downtime for every business.

Future approach:

```
Deploy Application
      ↓
Backward-Compatible Schema
      ↓
Migrate Tenants
      ↓
Remove Old Code
```

This is especially important for multi-tenant production systems.

---

# 187. API Versioning
As the API becomes public to integrations, versioning may become necessary.

Potential:

```
/api/v1
/api/v2
```

The decision should be made before external third-party integrations become deeply dependent on APIs.

---

# 188. Webhook Architecture
Future webhooks may be required for:

- payments
- aggregators
- WhatsApp
- shipping
- external integrations
Webhook processing should use:

```
Receive
 ↓
Authenticate
 ↓
Persist Event
 ↓
Deduplicate
 ↓
Process
 ↓
Acknowledge
```

---

# 189. External Integration Reliability
External APIs may:

- timeout
- return errors
- rate-limit
- send duplicate events
- change schemas
- become temporarily unavailable
Smart Business must isolate these failures from core restaurant operations wherever possible.

---

# 190. Integration Failure Example
If Swiggy API becomes unavailable:

```
Swiggy Integration
      ↓
FAILED
```

should not necessarily make:

```
Dine-In
POS
KDS
Inventory
```

unavailable.

The architecture should degrade gracefully.

---

# 191. Offline / Network Resilience
Restaurant environments may have unreliable internet.

Future POS/KDS systems may require resilience such as:

- local state
- retry queues
- optimistic UI where safe
- reconnect handling
Financial operations must never rely on unsafe client-only state.

---

# 192. Product Quality Standard
The product should be:

```
Secure
Reliable
Fast
Simple
Auditable
Scalable
Recoverable
```

The architecture should prioritize correctness over premature feature count.

---

# 193. Development Discipline
Before implementing a major module:

```
Requirement
 ↓
Domain Model
 ↓
Business Rules
 ↓
Authorization
 ↓
API Contract
 ↓
Database Schema
 ↓
Service Layer
 ↓
Tests
 ↓
UI
```

This avoids building UI first and discovering architectural problems later.

---

# 194. Module Development Pattern
Each domain should have:

```
Types
Schema
Repository
Service
Authorization
API
Validation
Events
Tests
UI
```

Not every module requires every component immediately, but the domain boundary should remain explicit.

---

# 195. Domain Boundaries
Important domains include:

```
Identity
Business
Authorization
Subscription
Physical Commerce
Routing
Menu
Ordering
POS
Kitchen
Inventory
CRM
Payments
Settlements
Franchise
Analytics
```

The system should avoid turning everything into one large service.

---

# 196. Core Architectural Rule
A feature should belong to the domain that owns its business meaning.

Example:

```
Price
→ Product/Menu domain

Payment
→ Payment domain

Stock
→ Inventory domain

Customer interaction
→ CRM domain

Royalty
→ Franchise domain
```

---

# 197. Product Evolution
The platform should evolve in this direction:

```
Tool
 ↓
Operating System
 ↓
Business Intelligence Platform
 ↓
Business Growth Platform
```

---

# 198. Final Product Definition
Smart Business is a:

> **Multi-tenant restaurant business operating system combining physical QR/NFC products, digital menus, omnichannel ordering, POS, kitchen operations, inventory, recipe-level stock management, customer CRM, WhatsApp engagement, financial reconciliation, multi-brand management and franchise operations.**
The core platform connects:

```
PHYSICAL
QR / NFC / Review Products
        ↓
DIGITAL
Menus / Tables / Ordering
        ↓
OPERATIONS
POS / KDS / Orders
        ↓
SUPPLY
Inventory / Recipes / Procurement
        ↓
CUSTOMER
CRM / WhatsApp / Retention
        ↓
FINANCE
Payments / Billing / Settlements
        ↓
INTELLIGENCE
Analytics / Reporting / Automation
        ↓
EXPANSION
Multi-Outlet / Multi-Brand / Franchise
```

---

# 199. Canonical Product Architecture
The complete long-term platform can be represented as:

```
                              SMART BUSINESS
                                     │
        ┌────────────────────────────┼────────────────────────────┐
        │                            │                            │
        ▼                            ▼                            ▼
  CONTROL PLANE                TENANT PLANE                INTELLIGENCE
        │                            │                            │
        ├── Users                    ├── Locations                ├── Analytics
        ├── Businesses               ├── Tables                   ├── Reporting
        ├── Memberships              ├── Menus                    ├── Insights
        ├── RBAC                     ├── Categories                ├── Forecasting
        ├── Plans                    ├── Products                  └── Automation
        ├── Subscriptions            ├── Orders
        ├── Physical Products        ├── POS
        ├── Review Cards             ├── KDS
        ├── Routing                  ├── Inventory
        └── Tenant Infrastructure    ├── Recipes
                                     ├── Customers
                                     ├── CRM
                                     ├── Payments
                                     └── Settlements

                                     │
                                     ▼
                              BUSINESS GROUP
                                     │
                      ┌──────────────┼──────────────┐
                      ▼              ▼              ▼
                    Brand          Outlet        Franchise
                      │              │              │
                      └──────────────┼──────────────┘
                                     ▼
                              CENTRAL CONTROL
```

---

# 200. Final Product Flywheel
The ultimate Smart Business flywheel is:

```
                 ┌───────────────────────┐
                 │ Physical Acquisition │
                 │ QR / NFC / Review    │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ Business Acquired  │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ Digital Menu         │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ QR / NFC Ordering    │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ POS + KDS             │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ Inventory + Recipes   │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ Customer Data         │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ CRM + WhatsApp        │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ Retention             │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ More Revenue          │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ More Outlets          │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ More Brands           │
                 └───────────┬───────────┘
                             ↓
                 ┌───────────────────────┐
                 │ Franchise Network     │
                 └───────────┬───────────┘
                             │
                             └───────────────┐
                                             ↓
                                  More Businesses
                                             ↓
                                  More Operational Data
                                             ↓
                                  Better Intelligence
                                             ↓
                                  Better Automation
                                             ↓
                                  Stronger Platform
                                             ↓
                                  More Business Value
```

---

# 201. Final Strategic Definition
Smart Business should ultimately become the **operating system for restaurant businesses**.

It is not limited to:

```
QR Menu
```

It is not limited to:

```
POS
```

It is not limited to:

```
Inventory
```

It is not limited to:

```
CRM
```

It is not limited to:

```
Restaurant Analytics
```

Instead, the product connects these systems into one operational platform:

```
                 SMART BUSINESS
                       │
      ┌────────────────┼────────────────┐
      │                │                │
  ACQUISITION      OPERATIONS       RETENTION
      │                │                │
 QR / NFC          POS / KDS        CRM / WhatsApp
 Reviews           Orders           Campaigns
 Menus             Inventory        Win-back
                   Recipes          Customer 360
      │                │                │
      └────────────────┼────────────────┘
                       │
                    FINANCE
                       │
             Payments / Billing
             Reconciliation
             Settlements
                       │
                       ▼
                 INTELLIGENCE
                       │
                Analytics
                Reporting
                Automation
                       │
                       ▼
                 EXPANSION
                       │
          Multi-Outlet / Multi-Brand
                       │
                       ▼
                  FRANCHISE
                       │
                       ▼
              BUSINESS OPERATING
                    SYSTEM
```

---

# 202. Canonical Product Goal
The ultimate goal is:

> **Give a restaurant owner one platform through which they can acquire customers, manage menus, receive orders, operate the kitchen, manage inventory, process payments, understand customers, retain customers, reconcile finances, operate multiple outlets, manage multiple brands and eventually manage franchise operations.**
The physical QR/NFC products are the acquisition layer.

The SaaS platform is the operational layer.

The data platform is the intelligence layer.

The CRM is the retention layer.

The financial system is the reconciliation layer.

The multi-brand/franchise layer is the expansion layer.

Together, these form **Smart Business**.

---

# 203. Document Status
This document represents the current canonical product/business direction.

### Implemented

- Authentication
- OTP verification
- Login/logout
- Session management
- RBAC foundation
- Business creation
- Owner membership
- Starter subscription
- Tenant database provisioning
- Neon integration
- Infisical integration
- Tenant migrations
- Tenant health verification
- Provisioning retry
- Provisioning lease
- Initial location creation
- Business onboarding API

### Planned

- Physical review products
- QR/NFC routing
- Table management
- Digital menus
- Product management
- Customer ordering
- Waiter ordering
- POS
- KDS
- Inventory
- Recipe engine
- Wastage
- Food-cost analytics
- CRM
- WhatsApp CRM
- Digital bills
- Win-back campaigns
- Abandoned-cart recovery
- Aggregator integrations
- Global menu kill-switch
- Settlement reconciliation
- Multi-brand management
- Franchise management
- Royalty management
- Advanced analytics

### Not Yet Selected / Defined

- Payment provider
- Final commercial pricing
- Final subscription packaging
- Final WhatsApp provider configuration
- Final aggregator integration contracts
- Final franchise agreement model
- Final accounting integration
- Final analytics infrastructure
These decisions should be made when the corresponding module reaches implementation.

---

# 204. One-Sentence Product Definition
**Smart Business is a multi-tenant restaurant operating system that starts with physical QR/NFC products and grows into a unified platform for menus, ordering, POS, kitchen operations, inventory, CRM, payments, financial reconciliation, analytics, multi-brand management and franchising.**