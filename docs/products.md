Here’s a ready-to-use **`product-api-curls.md`** file documenting all CRUD operations (`GET`, `POST`, `PUT`, `DELETE`) for your `/api/product` endpoint.
It includes practical examples, formatted for easy Postman or terminal use.

---

## 🧾 **Product API - CURL Documentation**

### Base URL

```
http://localhost:3000/api/product
```

### Headers (for all requests)

```bash
--header 'Content-Type: application/json' \
```

---

## 🟩 **1. Create Product (POST)**

```bash
curl --location 'http://localhost:3000/api/product' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_SUPERADMIN_JWT_TOKEN>' \
--data-raw '{
    "product_name": "Natural Shampoo",
    "category": "PERSONAL_CARE",
    "type": "shampoo",
    "description": "Organic herbal shampoo for all hair types",
    "ingredients": "Aloe vera, coconut oil, essential oils",
    "imageUrl": ["https://example.com/image1.jpg"],
    "sizePrice": {
        "250ml": 299,
        "500ml": 499
    },
    "stock": true
}'
```

✅ **Response:**

```json
{
  "message": "Product created successfully",
  "product": {
    "id": "cmhl...xyz",
    "product_name": "Natural Shampoo",
    "category": "PERSONAL_CARE",
    "stock": true
  }
}
```

---

## 🟨 **2. Get All Products (GET)**

```bash
curl --location 'http://localhost:3000/api/product' \
--header 'Authorization: Bearer <YOUR_SUPERADMIN_JWT_TOKEN>'
```

### 🔍 Query Parameters

| Parameter  | Type    | Description                              |
| ---------- | ------- | ---------------------------------------- |
| `id`       | string  | Filter by product ID                     |
| `category` | string  | `PERSONAL_CARE` or `HOME_CARE`           |
| `type`     | string  | Filter by product type                   |
| `search`   | string  | Search in name, description, ingredients |
| `stock`    | boolean | `true` or `false`                        |
| `limit`    | number  | Default: 10                              |
| `page`     | number  | Default: 1                               |

Example:

```bash
curl --location 'http://localhost:3000/api/product?category=PERSONAL_CARE&page=1&limit=5' \
--header 'Authorization: Bearer <YOUR_SUPERADMIN_JWT_TOKEN>'
```

✅ **Response:**

```json
{
  "success": true,
  "message": "Products fetched successfully",
  "data": {
    "rows": [ { "product_name": "Natural Shampoo" } ],
    "total": 12,
    "page": 1,
    "limit": 5,
    "pages": 3
  }
}
```

---

## 🟦 **3. Get Single Product by ID (GET)**

```bash
curl --location 'http://localhost:3000/api/product?id=cmhlxyz123' \
--header 'Authorization: Bearer <YOUR_SUPERADMIN_JWT_TOKEN>'
```

✅ **Response:**

```json
{
  "success": true,
  "data": {
    "id": "cmhlxyz123",
    "product_name": "Natural Shampoo",
    "category": "PERSONAL_CARE"
  }
}
```

---

## 🟧 **4. Update Product (PUT)**

```bash
curl --location 'http://localhost:3000/api/product/cmhlxyz123' \
--header 'Content-Type: application/json' \
--header 'Authorization: Bearer <YOUR_SUPERADMIN_JWT_TOKEN>' \
--data-raw '{
    "product_name": "Natural Herbal Shampoo - Updated",
    "stock": false,
    "sizePrice": {
        "250ml": 279,
        "500ml": 469
    }
}'
```

✅ **Response:**

```json
{
  "message": "Product updated successfully",
  "data": {
    "id": "cmhlxyz123",
    "product_name": "Natural Herbal Shampoo - Updated",
    "stock": false
  }
}
```

---

## 🟥 **5. Soft Delete Product (DELETE)**

```bash
curl --location --request DELETE 'http://localhost:3000/api/product/cmhlxyz123' \
--header 'Authorization: Bearer <YOUR_SUPERADMIN_JWT_TOKEN>'
```

✅ **Response:**

```json
{
  "message": "Product deleted successfully"
}
```

---

## ⚙️ **Error Responses**

| Status | Message               | Description                        |
| ------ | --------------------- | ---------------------------------- |
| 400    | Invalid product data  | Validation failed (Zod)            |
| 401    | Unauthorized          | Invalid or missing JWT             |
| 404    | Product not found     | Product ID invalid or soft-deleted |
| 500    | Internal server error | Database or runtime issue          |

---

## 🧠 Notes

* All `DELETE` operations are **soft deletes** — they set `deletedAt` instead of removing the record.
* Pagination and filters can be combined (e.g., `?category=HOME_CARE&search=detergent&page=2`).
* Only **Super Admins** (validated via JWT) can `POST`, `PUT`, or `DELETE`.

---

Would you like me to include **example seed data** (like 10 sample product JSONs) for use with `POST` to populate your DB quickly?
