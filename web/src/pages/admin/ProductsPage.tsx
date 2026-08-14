import { useEffect, useState } from "react";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  price: string | number;
  stock: number;
  image?: string | null;
  category: Category;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [form, setForm] = useState({name: "", price: "", stock: "", categoryId: ""});
  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const fetchProducts = async () => {
    try {
      const params = new URLSearchParams();

      params.append("page", String(page));
      params.append("limit", String(limit));

      if (search) {
        params.append("search", search);
      }

      if (categoryId) {
        params.append("categoryId", categoryId);
      }

      const token = localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/products?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message);
      }

      setProducts(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error(error);
    }
  };
  const fetchCategories = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/category",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    setCategories(result.data);
  } catch (error) {
    console.error(error);
  }
};

const createProduct = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(
      "http://localhost:5000/api/products",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          stock: Number(form.stock),
          categoryId: Number(form.categoryId),
        }),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    alert("Produk berhasil dibuat");

    setForm({
      name: "",
      price: "",
      stock: "",
      categoryId: "",
    });

    setShowCreateForm(false);

    setPage(1);
    fetchProducts();
  } catch (error) {
    console.error(error);

    alert(
      error instanceof Error
        ? error.message
        : "Gagal membuat produk"
    );
  }
};
  useEffect(() => {
    fetchProducts();
  }, [page, categoryId]);

  useEffect(() => {
  fetchCategories();
}, []);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  return (
    <div>
      <h1>Products</h1>

      <div>
        <input
          type="text"
          placeholder="Cari produk..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={handleSearch}>
          Search
        </button>
        <button onClick={() => setShowCreateForm(true)}>  + Add Product </button>
        {showCreateForm && (
        <div>
    <h2>Tambah Produk</h2>

    <div>
      <label>Nama Produk</label>

      <input
        type="text"
        value={form.name}
        onChange={(e) =>
          setForm({
            ...form,
            name: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label>Harga</label>

      <input
        type="number"
        min="0"
        value={form.price}
        onChange={(e) =>
          setForm({
            ...form,
            price: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label>Stock</label>

      <input
        type="number"
        min="0"
        value={form.stock}
        onChange={(e) =>
          setForm({
            ...form,
            stock: e.target.value,
          })
        }
      />
    </div>

    <div>
      <label>Category</label>

      <select
        value={form.categoryId}
        onChange={(e) =>
          setForm({
            ...form,
            categoryId: e.target.value,
          })
        }
      >
        <option value="">
          Pilih kategori
        </option>

        {categories.map((category) => (
          <option
            key={category.id}
            value={category.id}
          >
            {category.name}
          </option>
        ))}
      </select>
    </div>

    <button onClick={createProduct}>
      Simpan
    </button>

    <button
      onClick={() => setShowCreateForm(false)}
    >
      Batal
    </button>
  </div>
)}
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(1);
          }}
        >
          <option value="">Semua kategori</option>
           {categories.map((category) => (
               <option
                    key={category.id}
                    value={category.id}
            >
           {category.name}
           </option>
          ))}
        </select>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stock</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>

              <td>{product.name}</td>

              <td>{product.category.name}</td>

              <td>
                Rp {Number(product.price).toLocaleString("id-ID")}
              </td>

              <td>{product.stock}</td>

              <td>
                <button>
                  Edit
                </button>

                <button>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && (
        <div>
          <button
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <button
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}