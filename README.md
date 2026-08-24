# 🛒 Cashier App

Aplikasi kasir berbasis web untuk membantu pengelolaan produk, kasir, shift, dan transaksi.

Project ini memiliki sistem autentikasi dan role-based access untuk membedakan akses **Admin** dan **Cashier**.

---

## ✨ Features

### 🔐 Authentication
- User login menggunakan JWT
- Token disimpan di `localStorage`
- Authorization otomatis menggunakan Axios Interceptor
- Role-based access

### 👤 Cashier Management
- Melihat daftar kasir
- Search kasir berdasarkan nama atau email
- Menambahkan kasir
- Mengedit data kasir
- Menghapus kasir
- Pagination

### 📦 Product Management
- Melihat daftar produk
- Search produk
- Filter produk berdasarkan kategori
- Menambahkan produk
- Mengedit produk
- Menghapus produk
- Upload gambar produk
- Pagination

### 💰 Shift Management
- Memulai shift dengan uang awal
- Melihat shift yang sedang aktif
- Melihat informasi uang awal dan waktu shift dimulai
- Mengakhiri shift dengan memasukkan uang akhir
- Menghitung selisih kas

### 🧾 Transaction
- Membuat transaksi
- Menambahkan beberapa produk ke transaksi
- Mengatur jumlah produk
- Menghitung total pembayaran
- Pembayaran menggunakan Cash
- Pembayaran menggunakan Debit
- Menghitung uang kembalian
- Menyimpan transaksi

### 📜 Transaction History
- Melihat riwayat transaksi
- Melihat waktu transaksi
- Melihat metode pembayaran
- Melihat detail item transaksi
- Melihat total transaksi
- Melihat detail pembayaran Cash atau Debit

---

## 🛠 Tech Stack

### Frontend

- React
- TypeScript
- Vite
- React Router DOM
- Axios
- CSS

### Backend

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT
- Cloudinary

---

## 📁 Project Structure

```text
cashier-app/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   └── lib/
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   │
│   ├── src/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── routes/
│   │   ├── services/
│   │   └── utils/
│   │
│   └── package.json
│
└── README.md
```

---

# 🚀 Installation

## 1. Clone Repository

```bash
git clone <repository-url>
```

Masuk ke folder project:

```bash
cd cashier-app
```

---

# ⚙️ Backend Setup

Masuk ke folder backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Buat file `.env`:

```env
DATABASE_URL="your_database_url"
JWT_SECRET="your_jwt_secret"
PORT=5000

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"
```

Generate Prisma Client:

```bash
npx prisma generate
```

Jalankan migration:

```bash
npx prisma migrate dev
```

Jalankan server:

```bash
npm run dev
```

Backend akan berjalan di:

```text
http://localhost:5000
```

---

# 💻 Frontend Setup

Masuk ke folder frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Buat file `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Jalankan frontend:

```bash
npm run dev
```

Frontend biasanya berjalan di:

```text
http://localhost:5173
```

---

# 🔑 Authentication

Aplikasi menggunakan JWT untuk autentikasi.

Setelah login berhasil, token disimpan di browser:

```ts
localStorage.setItem("token", token);
```

Axios interceptor akan otomatis menambahkan token ke setiap request:

```ts
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
```

Contoh request:

```ts
const response = await api.get("/product");
```

Request tersebut secara otomatis akan mengirimkan:

```text
Authorization: Bearer <token>
```

---

# 📡 API Usage

Aplikasi frontend menggunakan Axios instance.

Contoh konfigurasi:

```ts
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
```

Contoh penggunaan:

### GET

```ts
api.get("/product");
```

### GET dengan Query Parameters

```ts
api.get("/product", {
  params: {
    page: 1,
    limit: 10,
    search: "indomie",
  },
});
```

### POST

```ts
api.post("/product", data);
```

### PATCH

```ts
api.patch(`/product/${id}`, data);
```

### DELETE

```ts
api.delete(`/product/${id}`);
```

---

# 👥 User Roles

## Admin

Admin memiliki akses untuk:

- Mengelola produk
- Mengelola kategori
- Mengelola kasir
- Melihat dan mengelola data aplikasi

## Cashier

Cashier memiliki akses untuk:

- Memulai shift
- Mengakhiri shift
- Membuat transaksi
- Melihat riwayat transaksi

---

# 🔄 Cashier Flow

```text
Login
  │
  ▼
Cashier Dashboard
  │
  ▼
Start Shift
  │
  ▼
Create Transaction
  │
  ▼
Process Payment
  │
  ▼
Transaction Saved
  │
  ▼
View Transaction History
  │
  ▼
End Shift
```

---

# 💳 Payment Methods

Saat ini aplikasi mendukung:

### CASH

Cashier memasukkan jumlah uang yang diterima.

```text
Cash Received - Total Transaction = Change
```

### DEBIT

Cashier dapat memasukkan informasi kartu, seperti empat digit terakhir kartu.

---

# 📸 Product Image

Upload gambar produk menggunakan Cloudinary.

Gambar dikirim menggunakan `FormData`:

```ts
const formData = new FormData();

formData.append("name", values.name);
formData.append("price", values.price);
formData.append("stock", values.stock);

if (image) {
  formData.append("image", image);
}

await api.post("/product", formData);
```

---

# 🎨 UI

UI aplikasi menggunakan custom CSS dengan desain minimal dan clean.

Font yang digunakan:

- Space Grotesk
- Inter
- IBM Plex Mono

Color palette utama:

| Purpose | Color |
|---|---|
| Background | `#f6f6f3` |
| Surface | `#ffffff` |
| Text | `#1c1e1b` |
| Muted Text | `#6b6f6a` |
| Primary | `#2f5d50` |
| Accent | `#c9a15a` |
| Danger | `#a8462f` |

---

# 🔮 Future Improvements

Beberapa pengembangan yang dapat ditambahkan:

- [ ] Logout confirmation
- [ ] Protected routes
- [ ] Refresh token
- [ ] Dashboard analytics
- [ ] Daily sales report
- [ ] Printable receipt
- [ ] Stock warning
- [ ] Low stock notification
- [ ] Transaction filtering
- [ ] Export transaction report
- [ ] Dark mode
- [ ] Better error handling

---

# 👩‍💻 Author

Developed by **Anggita Zahra Kamila**

---

## 📄 License

This project is created for educational and portfolio purposes.