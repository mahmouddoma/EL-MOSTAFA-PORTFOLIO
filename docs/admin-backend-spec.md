# Backend Admin Dashboard Spec (.NET)

## 1. الهدف

هذا الملف يشرح المطلوب من الباك إند لبناء Dashboard كاملة فوق مشروع `EL-MOSTAFA-PORTFOLIO` الحالي.

الهدف:

- تسجيل دخول للإدمن بالإيميل + `verification code`.
- Dashboard فيها الأقسام:
  - `Dashboard`
  - `Products`
  - `Site Content`
  - `Visual Editor`
  - `Orders`
  - `Payments`
  - `Messages`
  - `Logout`
- دعم `live edit mode` بحيث الإدمن يفتح نسخة من الموقع نفسه، يعدل العناصر مباشرة، ثم يعمل حفظ فتنعكس على الموقع الأساسي.

## 2. ملاحظات على المشروع الحالي

الموقع الحالي Angular وبياناته الأساسية حالياً جاية من:

- `public/assets/data.json`
  - `products`
  - `origins`
- `src/app/core/services/language.service.ts`
  - نصوص `navbar`, `hero`, `about`, `products`, `origins`, `whyUs`, `footer`, `marquee`, `slice`

هذا يعني أن الباك إند الجديد لازم يخرج المحتوى من الملفات الثابتة إلى قاعدة بيانات و API.

## 3. Stack مقترح

- `ASP.NET Core Web API`
- `EF Core`
- `SQL Server`
- `JWT access token + refresh token`
- `SMTP / email provider` لإرسال كود التحقق
- تخزين صور في:
  - Local disk في البداية، أو
  - Azure Blob / S3 لاحقاً

## 4. النمط المعماري المطلوب

يفضل فصل البيانات إلى مستويين:

1. `Published`
   - هذا الذي يقرأ منه الموقع العام.
2. `Draft`
   - هذا الذي يعدل عليه الإدمن داخل `Site Content` و `Visual Editor`.

عند الضغط على `Save` يوجد خياران:

- إما الحفظ في `draft` فقط.
- أو الحفظ ثم `publish` فوراً ليظهر التعديل في الموقع الأساسي.

لو المطلوب أن زر الحفظ يغير الموقع الأساسي فوراً، اجعل الـ frontend ينفذ:

1. `save draft`
2. ثم `publish`

## 5. الجداول المطلوبة

## 5.1 AdminUsers

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `Email` | `nvarchar(256)` | unique |
| `FullName` | `nvarchar(150)` | |
| `IsActive` | `bit` | |
| `Role` | `nvarchar(50)` | `SuperAdmin`, `Editor` |
| `LastLoginAtUtc` | `datetime2` | nullable |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 5.2 AdminVerificationCodes

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `AdminUserId` | `uniqueidentifier` | FK |
| `CodeHash` | `nvarchar(500)` | لا نخزن الكود raw |
| `ExpiresAtUtc` | `datetime2` | صلاحية 5 إلى 10 دقائق |
| `ConsumedAtUtc` | `datetime2` | nullable |
| `AttemptsCount` | `int` | |
| `IpAddress` | `nvarchar(100)` | nullable |
| `CreatedAtUtc` | `datetime2` | |

## 5.3 AdminRefreshTokens

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `AdminUserId` | `uniqueidentifier` | FK |
| `TokenHash` | `nvarchar(500)` | |
| `ExpiresAtUtc` | `datetime2` | |
| `RevokedAtUtc` | `datetime2` | nullable |
| `CreatedAtUtc` | `datetime2` | |

## 5.4 MediaAssets

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `FileName` | `nvarchar(255)` | |
| `OriginalFileName` | `nvarchar(255)` | |
| `ContentType` | `nvarchar(100)` | |
| `SizeInBytes` | `bigint` | |
| `Url` | `nvarchar(1000)` | |
| `StorageProvider` | `nvarchar(50)` | `local`, `blob` |
| `Width` | `int` | nullable |
| `Height` | `int` | nullable |
| `AltText` | `nvarchar(300)` | nullable |
| `UploadedByAdminId` | `uniqueidentifier` | FK |
| `CreatedAtUtc` | `datetime2` | |

## 5.5 SitePages

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `PageKey` | `nvarchar(100)` | unique مثل `home` |
| `Name` | `nvarchar(150)` | |
| `Route` | `nvarchar(200)` | `/` |
| `IsActive` | `bit` | |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 5.6 SiteSections

كل section حالية في المشروع يجب تمثيلها هنا.

أمثلة:

- `navbar`
- `hero`
- `fruit-slice`
- `marquee`
- `about`
- `products-header`
- `origins-header`
- `why-us`
- `footer`

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `SitePageId` | `uniqueidentifier` | FK |
| `SectionKey` | `nvarchar(100)` | unique per page |
| `DisplayName` | `nvarchar(150)` | |
| `SortOrder` | `int` | |
| `IsVisible` | `bit` | |
| `SectionType` | `nvarchar(50)` | `content`, `collection`, `layout` |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 5.7 SiteSectionVersions

هذا الجدول هو قلب `Site Content` و `Visual Editor`.

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `SiteSectionId` | `uniqueidentifier` | FK |
| `VersionNumber` | `int` | |
| `Status` | `nvarchar(20)` | `draft`, `published`, `archived` |
| `Locale` | `nvarchar(10)` | `en`, `ar` |
| `ContentJson` | `nvarchar(max)` | النصوص, الصور, الروابط, style props |
| `EditorSchemaJson` | `nvarchar(max)` | nullable, metadata للـ visual editor |
| `CreatedByAdminId` | `uniqueidentifier` | FK |
| `CreatedAtUtc` | `datetime2` | |
| `PublishedAtUtc` | `datetime2` | nullable |

## 5.8 Products

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `Slug` | `nvarchar(150)` | unique |
| `NameEn` | `nvarchar(200)` | |
| `NameAr` | `nvarchar(200)` | |
| `DescriptionEn` | `nvarchar(max)` | |
| `DescriptionAr` | `nvarchar(max)` | |
| `ImageAssetId` | `uniqueidentifier` | FK nullable |
| `ImageUrl` | `nvarchar(1000)` | fallback |
| `ImageFilter` | `nvarchar(100)` | nullable |
| `CategoryKey` | `nvarchar(100)` | |
| `IsFeatured` | `bit` | |
| `IsPublished` | `bit` | |
| `SortOrder` | `int` | |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 5.9 ProductOrigins

| Column | Type |
|---|---|
| `Id` | `uniqueidentifier` |
| `ProductId` | `uniqueidentifier` |
| `OriginId` | `uniqueidentifier` |

## 5.10 ProductVarieties

| Column | Type |
|---|---|
| `Id` | `uniqueidentifier` |
| `ProductId` | `uniqueidentifier` |
| `NameEn` | `nvarchar(150)` |
| `NameAr` | `nvarchar(150)` |
| `SortOrder` | `int` |

## 5.11 Origins

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `CountryEn` | `nvarchar(150)` | |
| `CountryAr` | `nvarchar(150)` | |
| `FlagEmoji` | `nvarchar(20)` | |
| `SortOrder` | `int` | |
| `IsPublished` | `bit` | |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 5.12 ContactMessages

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `FullName` | `nvarchar(150)` | |
| `Email` | `nvarchar(256)` | |
| `Phone` | `nvarchar(50)` | nullable |
| `Subject` | `nvarchar(200)` | nullable |
| `Message` | `nvarchar(max)` | |
| `Status` | `nvarchar(20)` | `new`, `read`, `archived`, `replied` |
| `CreatedAtUtc` | `datetime2` | |
| `ReadAtUtc` | `datetime2` | nullable |

## 5.13 Orders

جاهز إذا أضفت ecommerce أو طلبات من الموقع.

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `OrderNumber` | `nvarchar(50)` | unique |
| `CustomerName` | `nvarchar(150)` | |
| `CustomerEmail` | `nvarchar(256)` | |
| `CustomerPhone` | `nvarchar(50)` | |
| `TotalAmount` | `decimal(18,2)` | |
| `Currency` | `nvarchar(10)` | `EGP` |
| `Status` | `nvarchar(20)` | `pending`, `confirmed`, `completed`, `cancelled` |
| `PaymentMethod` | `nvarchar(50)` | |
| `PaymentStatus` | `nvarchar(20)` | `pending`, `paid`, `failed`, `refunded` |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 5.14 OrderItems

| Column | Type |
|---|---|
| `Id` | `uniqueidentifier` |
| `OrderId` | `uniqueidentifier` |
| `ProductId` | `uniqueidentifier` |
| `ProductNameSnapshot` | `nvarchar(200)` |
| `Quantity` | `int` |
| `UnitPrice` | `decimal(18,2)` |
| `LineTotal` | `decimal(18,2)` |

## 5.15 Payments

| Column | Type | Notes |
|---|---|---|
| `Id` | `uniqueidentifier` | PK |
| `OrderId` | `uniqueidentifier` | FK |
| `Provider` | `nvarchar(50)` | `paymob`, `cod`, ... |
| `TransactionReference` | `nvarchar(200)` | nullable |
| `Amount` | `decimal(18,2)` | |
| `Currency` | `nvarchar(10)` | |
| `Status` | `nvarchar(20)` | `pending`, `paid`, `failed`, `refunded` |
| `RawResponseJson` | `nvarchar(max)` | nullable |
| `CreatedAtUtc` | `datetime2` | |
| `UpdatedAtUtc` | `datetime2` | |

## 6. محتوى الموقع المطلوب تخزينه

المحتوى الحالي يجب أن يتحول إلى schema واضح.

## 6.1 Home Page Sections

### `navbar`

```json
{
  "logoUrl": "/assets/logo.png",
  "links": [
    { "key": "about", "labelEn": "About", "labelAr": "عنا", "targetId": "about", "isVisible": true },
    { "key": "products", "labelEn": "Products", "labelAr": "منتجاتنا", "targetId": "products", "isVisible": true },
    { "key": "origins", "labelEn": "Origins", "labelAr": "المصادر", "targetId": "origins", "isVisible": true },
    { "key": "contact", "labelEn": "Contact", "labelAr": "تواصل معنا", "targetId": "contact", "isVisible": true }
  ]
}
```

### `hero`

```json
{
  "eyebrowEn": "PREMIUM FRUIT IMPORTERS",
  "eyebrowAr": "مستوردو كبار الفواكه الفاخرة",
  "titleEn": "EL MOSTAFA",
  "titleAr": "المصطفى",
  "subtitleEn": "Cairo's leading importer of premium tropical and exotic fruits.",
  "subtitleAr": "المستورد الرائد للفواكه الاستوائية الفاخرة في القاهرة.",
  "ctaLabelEn": "EXPLORE PRODUCTS",
  "ctaLabelAr": "استكشف منتجاتنا",
  "ctaTarget": "products",
  "backgroundImageUrl": null,
  "floatingAssets": [
    { "imageUrl": "/assets/real-orange.png", "size": 180 },
    { "imageUrl": "/assets/real-kiwi.png", "size": 140 }
  ]
}
```

### `fruit-slice`

```json
{
  "titleEn": "The Core of<br />Excellence",
  "titleAr": "لب<br />التميز",
  "subtitleEn": "Unveiling nature's finest selections, handpicked for perfection.",
  "subtitleAr": "نكتشف أرقى مختارات الطبيعة، منتقاة بعناية للوصول إلى المثالية.",
  "fruitImageTopUrl": "/assets/real-orange.png",
  "fruitImageBottomUrl": "/assets/real-orange.png"
}
```

### `marquee`

```json
{
  "itemsEn": ["PREMIUM QUALITY", "IMPORTED DAILY", "100% FRESH"],
  "itemsAr": ["جودة ممتازة", "مستورد يومياً", "طازج 100%"]
}
```

### `about`

```json
{
  "eyebrowEn": "OUR STORY",
  "eyebrowAr": "قصتنا",
  "titleEn": "The Journey",
  "titleAr": "الرحلة",
  "subtitleEn": "Scroll to trace the path of perfection.",
  "subtitleAr": "اسحب للأسفل لتتبع مسار المثالية.",
  "nodes": [
    {
      "order": 1,
      "titleEn": "The Origin",
      "titleAr": "الأصل",
      "descriptionEn": "Sourced from the world's most premium orchards.",
      "descriptionAr": "مستوردة من أفخم البساتين حول العالم."
    }
  ]
}
```

### `products-header`

```json
{
  "eyebrowEn": "EL MOSTAFA COLLECTION",
  "eyebrowAr": "مجموعة المصطفى",
  "titleEn": "Our Harvest",
  "titleAr": "حصادنا",
  "subtitleEn": "Explore our curated selection.",
  "subtitleAr": "استكشف تشكيلتنا المختارة."
}
```

### `origins-header`

```json
{
  "eyebrowEn": "OUR NETWORK",
  "eyebrowAr": "شبكتنا",
  "titleEn": "Global Origins",
  "titleAr": "مصادرنا العالمية",
  "subtitleEn": "We source only from renowned agricultural regions.",
  "subtitleAr": "نستورد فقط من أشهر المناطق الزراعية."
}
```

### `why-us`

```json
{
  "eyebrowEn": "OUR COMMITMENT",
  "eyebrowAr": "التزامنا",
  "titleEn": "Why El Mostafa",
  "titleAr": "لماذا المصطفى؟",
  "subtitleEn": "Excellence in every bite.",
  "subtitleAr": "التميز في كل قمة.",
  "pillars": [
    {
      "order": 1,
      "titleEn": "Global Network",
      "titleAr": "شبكة عالمية",
      "descriptionEn": "We source directly from premium farms.",
      "descriptionAr": "نستورد مباشرة من المزارع الفاخرة."
    }
  ]
}
```

### `footer`

```json
{
  "brandText": "EL MOSTAFA",
  "descriptionEn": "Premium quality fruit importers serving Cairo.",
  "descriptionAr": "مستوردو فواكه بجودة عالية نخدم القاهرة.",
  "addressEn": "Cairo, Egypt",
  "addressAr": "القاهرة، مصر",
  "email": "contact@elmostafafruits.com",
  "phone": "+20 100 000 0000",
  "privacyUrl": "/privacy",
  "termsUrl": "/terms"
}
```

## 7. Endpoints المطلوبة

## 7.1 Admin Auth

### `POST /api/admin/auth/request-code`

يستقبل الإيميل ويرسل verification code.

Request:

```json
{
  "email": "admin@example.com"
}
```

Response:

```json
{
  "success": true,
  "message": "Verification code sent.",
  "expiresInSeconds": 300
}
```

### `POST /api/admin/auth/verify-code`

Request:

```json
{
  "email": "admin@example.com",
  "code": "483921"
}
```

Response:

```json
{
  "accessToken": "jwt-access-token",
  "refreshToken": "refresh-token",
  "expiresInSeconds": 3600,
  "admin": {
    "id": "2fc04a0d-4f31-4e45-8c5b-8d2e0a5d1c10",
    "email": "admin@example.com",
    "fullName": "Main Admin",
    "role": "SuperAdmin"
  }
}
```

### `POST /api/admin/auth/refresh`

Request:

```json
{
  "refreshToken": "refresh-token"
}
```

### `POST /api/admin/auth/logout`

Request:

```json
{
  "refreshToken": "refresh-token"
}
```

### `GET /api/admin/auth/me`

Response:

```json
{
  "id": "2fc04a0d-4f31-4e45-8c5b-8d2e0a5d1c10",
  "email": "admin@example.com",
  "fullName": "Main Admin",
  "role": "SuperAdmin"
}
```

## 7.2 Dashboard

### `GET /api/admin/dashboard/summary`

Response:

```json
{
  "productsCount": 8,
  "originsCount": 7,
  "messagesCount": 12,
  "unreadMessagesCount": 3,
  "ordersCount": 4,
  "pendingOrdersCount": 2,
  "paymentsCount": 4,
  "paidAmount": 212.00,
  "currency": "EGP"
}
```

### `GET /api/admin/dashboard/recent-activity`

Response:

```json
[
  {
    "type": "content_publish",
    "title": "Hero section published",
    "createdAtUtc": "2026-04-20T08:15:00Z"
  },
  {
    "type": "message",
    "title": "New contact message from Ahmed",
    "createdAtUtc": "2026-04-20T07:55:00Z"
  }
]
```

## 7.3 Products

### `GET /api/admin/products`

### `GET /api/admin/products/{id}`

### `POST /api/admin/products`

Request:

```json
{
  "slug": "premium-apples",
  "nameEn": "Premium Apples",
  "nameAr": "تفاح فاخر",
  "descriptionEn": "Exquisite selection of crisp apples.",
  "descriptionAr": "تشكيلة رائعة من التفاح الفاخر.",
  "imageAssetId": "0c97f281-a68c-4b0e-a8d1-13cf6b7f9c17",
  "imageUrl": "/uploads/products/premium-apples.png",
  "imageFilter": "none",
  "categoryKey": "stone",
  "isFeatured": true,
  "isPublished": true,
  "sortOrder": 1,
  "originIds": [
    "c8fc3041-2a5a-4af7-b2c9-8a6a37265530",
    "49d3c0f8-9f7a-47d2-8ddd-e0f0d5982ce7"
  ],
  "varieties": [
    { "nameEn": "Gala", "nameAr": "جالا", "sortOrder": 1 },
    { "nameEn": "Golden", "nameAr": "جولدن", "sortOrder": 2 }
  ]
}
```

### `PUT /api/admin/products/{id}`

نفس payload الخاص بالإنشاء.

### `DELETE /api/admin/products/{id}`

## 7.4 Origins

### `GET /api/admin/origins`

### `POST /api/admin/origins`

```json
{
  "countryEn": "Italy",
  "countryAr": "إيطاليا",
  "flagEmoji": "🇮🇹",
  "sortOrder": 1,
  "isPublished": true
}
```

### `PUT /api/admin/origins/{id}`

### `DELETE /api/admin/origins/{id}`

## 7.5 Site Content

هذا الجزء structured editing.

### `GET /api/admin/site-content/pages`

Response:

```json
[
  {
    "pageKey": "home",
    "name": "Home",
    "route": "/",
    "sections": [
      { "sectionKey": "navbar", "displayName": "Navbar", "sortOrder": 1, "isVisible": true },
      { "sectionKey": "hero", "displayName": "Hero", "sortOrder": 2, "isVisible": true },
      { "sectionKey": "about", "displayName": "About", "sortOrder": 3, "isVisible": true }
    ]
  }
]
```

### `GET /api/admin/site-content/pages/{pageKey}/sections/{sectionKey}?locale=ar&status=draft`

Response:

```json
{
  "pageKey": "home",
  "sectionKey": "hero",
  "locale": "ar",
  "status": "draft",
  "versionNumber": 5,
  "content": {
    "eyebrowAr": "مستوردو كبار الفواكه الفاخرة",
    "titleAr": "المصطفى",
    "subtitleAr": "المستورد الرائد للفواكه الفاخرة في القاهرة.",
    "ctaLabelAr": "استكشف منتجاتنا"
  }
}
```

### `PUT /api/admin/site-content/pages/{pageKey}/sections/{sectionKey}`

Request:

```json
{
  "locale": "ar",
  "status": "draft",
  "content": {
    "titleAr": "المصطفى",
    "subtitleAr": "وصف جديد",
    "ctaLabelAr": "اعرف أكثر"
  }
}
```

Response:

```json
{
  "success": true,
  "versionNumber": 6
}
```

### `POST /api/admin/site-content/publish`

Request:

```json
{
  "pageKey": "home",
  "sectionKeys": ["hero", "footer"],
  "publishAllDrafts": false
}
```

### `POST /api/admin/site-content/reorder-sections`

```json
{
  "pageKey": "home",
  "sections": [
    { "sectionKey": "navbar", "sortOrder": 1 },
    { "sectionKey": "hero", "sortOrder": 2 },
    { "sectionKey": "products-header", "sortOrder": 3 }
  ]
}
```

### `PATCH /api/admin/site-content/sections/{sectionKey}/visibility`

```json
{
  "isVisible": true
}
```

## 7.6 Visual Editor

هذا الجزء مختلف عن `Site Content`.

`Site Content` = فورمات منظمة.

`Visual Editor` = فتح نسخة من الصفحة نفسها مع editable overlays.

### `GET /api/admin/visual-editor/page/home?locale=ar&status=draft`

يرجع كل ما يحتاجه الـ editor:

```json
{
  "pageKey": "home",
  "locale": "ar",
  "status": "draft",
  "publicRoute": "/",
  "versionStamp": "home-ar-draft-v12",
  "sections": [
    {
      "sectionKey": "hero",
      "componentKey": "hero",
      "editableNodes": [
        {
          "nodeId": "hero.title",
          "type": "text",
          "label": "Hero Title",
          "value": "المصطفى",
          "selectors": ["[data-edit-id='hero.title']"]
        },
        {
          "nodeId": "hero.subtitle",
          "type": "textarea",
          "label": "Hero Subtitle",
          "value": "المستورد الرائد...",
          "selectors": ["[data-edit-id='hero.subtitle']"]
        },
        {
          "nodeId": "hero.backgroundImageUrl",
          "type": "image",
          "label": "Hero Background",
          "value": "/uploads/site/hero-bg.webp",
          "selectors": ["[data-edit-id='hero.backgroundImage']"]
        }
      ]
    }
  ]
}
```

### `PATCH /api/admin/visual-editor/nodes/{nodeId}`

Request:

```json
{
  "pageKey": "home",
  "locale": "ar",
  "status": "draft",
  "value": "محتوى جديد"
}
```

### `PATCH /api/admin/visual-editor/styles/{nodeId}`

Request:

```json
{
  "pageKey": "home",
  "locale": "ar",
  "status": "draft",
  "styles": {
    "color": "#ffffff",
    "fontSize": "72px",
    "textAlign": "center"
  }
}
```

### `POST /api/admin/visual-editor/save-layout`

Request:

```json
{
  "pageKey": "home",
  "locale": "ar",
  "status": "draft",
  "nodes": [
    {
      "nodeId": "hero.title",
      "value": "محتوى جديد",
      "styles": {
        "color": "#ffffff"
      }
    }
  ]
}
```

### `POST /api/admin/visual-editor/publish`

Request:

```json
{
  "pageKey": "home",
  "locale": "ar"
}
```

## 7.7 Media Upload

### `POST /api/admin/media`

`multipart/form-data`

Fields:

- `file`
- `folder`
- `altText`

Response:

```json
{
  "id": "0c97f281-a68c-4b0e-a8d1-13cf6b7f9c17",
  "url": "/uploads/site-content/hero-bg.webp",
  "fileName": "hero-bg.webp",
  "contentType": "image/webp",
  "sizeInBytes": 452120,
  "width": 1920,
  "height": 1080
}
```

## 7.8 Messages

### `GET /api/admin/messages?status=new&page=1&pageSize=20`

### `GET /api/admin/messages/{id}`

### `PATCH /api/admin/messages/{id}/status`

```json
{
  "status": "read"
}
```

### `DELETE /api/admin/messages/{id}`

اختياري.

## 7.9 Orders

### `GET /api/admin/orders`

### `GET /api/admin/orders/{id}`

### `PATCH /api/admin/orders/{id}/status`

```json
{
  "status": "confirmed"
}
```

## 7.10 Payments

### `GET /api/admin/payments`

### `GET /api/admin/payments/{id}`

### `PATCH /api/admin/payments/{id}/status`

```json
{
  "status": "paid"
}
```

## 7.11 Public Endpoints للموقع الأساسي

الموقع العام يجب أن يقرأ فقط من `published`.

### `GET /api/public/site-content/home?locale=ar`

Response:

```json
{
  "pageKey": "home",
  "locale": "ar",
  "sections": [
    {
      "sectionKey": "hero",
      "content": {
        "titleAr": "المصطفى"
      }
    }
  ]
}
```

### `GET /api/public/products?locale=ar`

### `GET /api/public/origins?locale=ar`

### `POST /api/public/contact-messages`

```json
{
  "fullName": "Ahmed Mohamed",
  "email": "ahmed@example.com",
  "phone": "+201001234567",
  "subject": "Business Inquiry",
  "message": "I want to contact your sales team."
}
```

## 8. DTOs مقترحة في .NET

```csharp
public sealed record RequestAdminCodeRequest(string Email);

public sealed record VerifyAdminCodeRequest(string Email, string Code);

public sealed record AdminAuthResponse(
    string AccessToken,
    string RefreshToken,
    int ExpiresInSeconds,
    AdminUserDto Admin);

public sealed record AdminUserDto(
    Guid Id,
    string Email,
    string FullName,
    string Role);

public sealed record UpdateSiteSectionRequest(
    string Locale,
    string Status,
    JsonElement Content);

public sealed record PublishSiteContentRequest(
    string PageKey,
    IReadOnlyList<string> SectionKeys,
    bool PublishAllDrafts);

public sealed record CreateOrUpdateProductRequest(
    string Slug,
    string NameEn,
    string NameAr,
    string DescriptionEn,
    string DescriptionAr,
    Guid? ImageAssetId,
    string? ImageUrl,
    string? ImageFilter,
    string CategoryKey,
    bool IsFeatured,
    bool IsPublished,
    int SortOrder,
    IReadOnlyList<Guid> OriginIds,
    IReadOnlyList<ProductVarietyRequest> Varieties);

public sealed record ProductVarietyRequest(
    string NameEn,
    string NameAr,
    int SortOrder);

public sealed record UpdateVisualNodeRequest(
    string PageKey,
    string Locale,
    string Status,
    JsonElement Value);
```

## 9. Rules مهمة

- كل النصوص العربية والإنجليزية تحفظ UTF-8 / `nvarchar`.
- لا تعتمد على `data.json` بعد إطلاق الـ admin.
- كل API admin لازم تكون محمية بـ JWT.
- ضع `rate limiting` على `request-code` و `verify-code`.
- verification code لا يخزن plain text.
- الصور يجب أن ترجع URL ثابت يصلح للـ Angular frontend.
- `Visual Editor` لازم يقرأ ويكتب على نفس source of truth الخاصة بـ `SiteSectionVersions`.

## 10. السيناريو الكامل المطلوب

1. الإدمن يدخل الإيميل.
2. الباك يرسل verification code.
3. الإدمن يدخل الكود.
4. الباك يرجع `accessToken` و `refreshToken`.
5. dashboard تفتح.
6. الإدمن يدخل `Site Content` أو `Visual Editor`.
7. التعديلات تحفظ في `draft`.
8. عند `Publish` أو `Save & Publish` يتم نسخ draft إلى published.
9. الموقع الأساسي يقرأ آخر `published` version مباشرة.

## 11. أقل نسخة MVP

لو تريد البدء بسرعة:

- نفذ أولاً:
  - `AdminUsers`
  - `AdminVerificationCodes`
  - `AdminRefreshTokens`
  - `MediaAssets`
  - `SitePages`
  - `SiteSections`
  - `SiteSectionVersions`
  - `Products`
  - `Origins`
  - `ContactMessages`
- ثم endpoints:
  - auth
  - dashboard summary
  - products CRUD
  - origins CRUD
  - site-content read/update/publish
  - visual-editor page/nodes/publish
  - media upload
  - messages list/update

`Orders` و `Payments` يمكن تجهيزهم من البداية أو تأجيلهم إذا الموقع لا يبيع حالياً.
