# PYQPRO

Next.js App Router platform for engineering PYQs with MongoDB metadata and in-app Google Drive PDF proxy streaming.

## Project Structure

```text
src/
  app/
    api/
      papers/route.js
      pdf/route.js
      structure/route.js
    [branch]/[academicYear]/[pattern]/[subject]/pdf/[fileId]/page.jsx
    [branch]/[academicYear]/[pattern]/[subject]/page.jsx
    [branch]/[academicYear]/[pattern]/page.jsx
    [branch]/[academicYear]/page.jsx
    [branch]/page.jsx
    globals.css
    layout.jsx
    page.jsx
    robots.js
    sitemap.js
  components/
    analytics/
    json-ld/
    navigation/
    pdf/
    ui/
  lib/
    format.js
    google-drive.js
    site-config.js
    slug.js
  server/
    db/
    repositories/
data/
  catalog/
    master-catalog.csv
tools/
  database/
    seed-catalog.js
    verify-pdf-links.js
```

## Environment Variables

```bash
MONGODB_URI="mongodb+srv://..."
MONGODB_DB_NAME="pyqpro"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
GOOGLE_ANALYTICS_ID=""
```

## Commands

```bash
npm install
npm run db:seed
npm run db:verify-pdfs
npm run dev
```

## Catalog Format

`data/catalog/master-catalog.csv` columns:

```csv
branch,academicYear,pattern,subject,examType,paperMonth,paperYear,fileId
```
