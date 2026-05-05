# CESAR/CRM – Application Architecture

## 1. Technology Stack

- **Frontend:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Database:** Bolt Database (PostgreSQL)
- **Auth:** Bolt Database Auth
- **Storage:** Bolt Database Storage (documents, photos)
- **Real-time:** Bolt Database real-time subscriptions
- **API:** Bolt Database REST API with Row Level Security (RLS)

---

## 2. Application Structure (Routes)

### Public Area

- `/` – Landing Page
- `/login` – Property manager login
- `/signup` – Property manager registration
- `/forgot-password` – Password reset
- `/tenant-login` – Tenant portal login

### Authenticated Manager Area

- `/dashboard`
  - KPIs, metrics, recent activity
  - Quick actions (add property, add tenant, etc.)
  - Notifications center

- `/properties`
  - List view + filters
  - `/properties/new`
  - `/properties/:id`
    - Overview
    - Units
    - Tenants
    - Financials
    - Maintenance
    - Documents
    - Property settings

- `/units`
  - Units list, vacancy management
  - `/units/new`
  - `/units/:id`

- `/tenants`
  - All / Active / Past tenants
  - `/tenants/leads`
  - `/tenants/applications`
  - `/tenants/new`
  - `/tenants/:id`
    - Personal info
    - Lease details
    - Payment history
    - Maintenance requests
    - Documents
    - Communication log

- `/screening`
  - Pending / Completed
  - `/screening/new`
  - `/screening/:id`

- `/leases`
  - Active / Expiring soon / Expired
  - `/leases/new`
  - `/leases/:id`

- `/payments`
  - Rent roll
  - Payment history
  - Overdue payments
  - Schedules
  - `/payments/new`
  - `/payments/:id`

- `/maintenance`
  - All / Open / In progress / Completed
  - `/maintenance/new`
  - `/maintenance/:id`

- `/communications`
  - Inbox
  - Sent
  - Templates
  - Automated notifications
  - `/communications/new`

- `/reports`
  - Financial, occupancy, maintenance, tenant reports
  - Custom reports
  - Data export

- `/documents`
  - All documents
  - Leases, inspections, insurance
  - `/documents/upload`

- `/settings`
  - Account settings
  - Company profile
  - User management
  - Roles & permissions
  - Payment gateway setup
  - Email templates
  - Notification preferences
  - Integration settings (API, Zapier, webhooks)

### Tenant Portal

- `/tenant-portal`
  - Tenant dashboard
  - My lease
  - Pay rent (integration ready)
  - Payment history
  - Submit maintenance request
  - My requests
  - Documents
  - Messages

---

## 3. Database Schema (Core Tables)

### `users` (Bolt Auth extended)

- `id`
- `email`
- `role` (`admin`, `manager`, `tenant`)
- `full_name`
- `phone`
- `avatar_url`
- `created_at`, `updated_at`

### `organizations`

- `id`
- `name`
- `logo_url`
- `address`
- `phone`
- `email`
- `website`
- `settings` (JSONB)
- `created_at`

### `properties`

- `id`
- `organization_id`
- `name`
- `address`
- `property_type`
- `units_count`
- `description`
- `images` (array or JSONB)
- `created_at`

### `units`

- `id`
- `property_id`
- `unit_number`
- `bedrooms`
- `bathrooms`
- `sqft`
- `rent_amount`
- `status` (vacant, occupied, offline, etc.)
- `created_at`

### `tenants`

- `id`
- `organization_id`
- `user_id` (link to `users`)
- `first_name`
- `last_name`
- `email`
- `phone`
- `status` (lead, active, past, evicted)
- `emergency_contact`
- `created_at`

### `leads`

- `id`
- `organization_id`
- `name`
- `email`
- `phone`
- `status`
- `source`
- `notes`
- `interested_unit_id`
- `created_at`

### `applications`

- `id`
- `lead_id`
- `unit_id`
- `status`
- `submitted_at`
- `employment_info`
- `references`
- `income`
- `created_at`

### `screenings`

- `id`
- `application_id`
- `credit_score`
- `background_check`
- `eviction_history`
- `status`
- `report_data` (JSONB)
- `created_at`

### `leases`

- `id`
- `unit_id`
- `tenant_id`
- `start_date`
- `end_date`
- `rent_amount`
- `deposit_amount`
- `status`
- `terms`
- `document_url`
- `created_at`

### `payments`

- `id`
- `lease_id`
- `tenant_id`
- `amount`
- `due_date`
- `paid_date`
- `status`
- `payment_method`
- `transaction_id`
- `created_at`

### `maintenance_requests`

- `id`
- `unit_id`
- `tenant_id`
- `title`
- `description`
- `priority`
- `status`
- `category`
- `images` (JSONB)
- `assigned_to`
- `created_at`

### `communications`

- `id`
- `from_user_id`
- `to_user_id`
- `subject`
- `message`
- `type`
- `status`
- `read_at`
- `created_at`

### `documents`

- `id`
- `related_type` (property, unit, tenant, lease, etc.)
- `related_id`
- `title`
- `file_url`
- `file_type`
- `uploaded_by`
- `created_at`

### `notifications`

- `id`
- `user_id`
- `type`
- `title`
- `message`
- `read`
- `action_url`
- `created_at`

### `audit_logs`

- `id`
- `user_id`
- `action`
- `table_name`
- `record_id`
- `changes` (JSONB)
- `created_at`

---

## 4. Implementation Phases (High Level)

1. **Foundation & Auth**
2. **Dashboard & Properties**
3. **Tenants & Leads**
4. **Screening**
5. **Leases**
6. **Payments & Rent Collection**
7. **Maintenance Requests**
8. **Communications & Notifications**
9. **Tenant Portal**
10. **Reporting & Analytics**
11. **Document Management**
12. **Security & Compliance**
13. **Automation & Workflows**
14. **Integrations & API**
15. **SEO & Performance**
16. **Mobile & PWA**
17. **Testing & QA**
18. **Deployment & Launch**

Each phase can be shipped iteratively as a milestone.

---

## 5. Wireframe Concepts

### Dashboard Layout

- Left sidebar navigation
- Header with logo, search, notifications, user menu
- Quick stats cards (Total Properties, Active Leases, Vacant Units, Overdue Payments)
- Sections:
  - Recent activity timeline
  - Upcoming tasks (lease expirations, payments due)
  - Open maintenance requests list

### Tenant Profile Layout

- Header with avatar, name, status, actions
- Tabs:
  - Info
  - Lease
  - Payments
  - Maintenance
  - Documents
- Two-column layout:
  - Left: personal information, contact details
  - Right: current lease summary, recent activity

---

## 6. SEO & Performance Strategy (Public Pages)

- SSR/SSG for landing and marketing pages
- Semantic HTML, mobile-first responsive design
- Image optimization (WebP, alt text)
- `sitemap.xml`, `robots.txt`, canonical URLs
- Unique titles and meta descriptions per page
- Schema.org structured data
- Open Graph tags for social sharing
- Code splitting, lazy loading, minified JS/CSS
- CDN + caching + compression (gzip/brotli)

---

CESAR/CRM is designed as a modular, multi-tenant, enterprise-ready property management platform that can scale from a single landlord to large portfolios with thousands of units.
