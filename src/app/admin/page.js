"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import styles from "./admin.module.css";
import AddProductModal from "@/components/AddProductModal/AddProductModal";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("orders");
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
const [showAddProduct, setShowAddProduct] = useState(false);
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session && session.user.role !== "admin") router.push("/");
  }, [session, status]);

  useEffect(() => {
    if (session?.user?.role === "admin") fetchData();
  }, [tab, session]);

  async function fetchData() {
    setLoading(true);
    if (tab === "orders") {
      const res = await fetch("/api/orders");
      setOrders(await res.json());
    }
    if (tab === "users") {
      const res = await fetch("/api/admin/users");
      setUsers(await res.json());
    }
    if (tab === "products") {
      const res = await fetch("/api/products");
      setProducts(await res.json());
    }
    setLoading(false);
  }

  async function toggleUser(id, isActive) {
    await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    fetchData();
  }

  async function deleteProduct(id) {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
    fetchData();
  }

  if (status === "loading") return <p className={styles.loading}>Loading...</p>;
  if (!session || session.user.role !== "admin") return null;

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin Panel</h1>

      <div className={styles.tabs}>
        {["orders", "users", "products"].map((t) => (
          <button
            key={t}
            className={`${styles.tab} ${tab === t ? styles.activeTab : ""}`}
            onClick={() => setTab(t)}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {loading ? (
        <p className={styles.loading}>Loading...</p>
      ) : (
        <>
          {tab === "orders" && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id}>
                      <td className={styles.id}>{o._id.slice(-8)}</td>
                      <td>{o.user?.name || o.guestEmail || "Guest"}</td>
                      <td>${o.total?.toFixed(2)}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[o.paymentStatus]}`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td>
                        <span className={`${styles.badge} ${styles[o.orderStatus]}`}>
                          {o.orderStatus}
                        </span>
                      </td>
                      <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "users" && (
            <div className={styles.tableWrapper}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id}>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.role}</td>
                      <td>
                        <span className={`${styles.badge} ${u.isActive ? styles.paid : styles.failed}`}>
                          {u.isActive ? "Active" : "Restricted"}
                        </span>
                      </td>
                      <td>
                        <button
                          className={`${styles.actionBtn} ${u.isActive ? styles.restrictBtn : styles.approveBtn}`}
                          onClick={() => toggleUser(u._id, u.isActive)}
                        >
                          {u.isActive ? "Restrict" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {tab === "products" && (
  <div className={styles.tableWrapper}>
    <div className={styles.tableHeader}>
      <span>{products.length} products</span>
      <button
        className={styles.addBtn}
        onClick={() => setShowAddProduct(true)}
      >
        + Add Product
      </button>
    </div>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Brand</th>
          <th>Category</th>
          <th>Price</th>
          <th>Stock</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {products.map((p) => (
          <tr key={p._id}>
            <td>{p.name}</td>
            <td>{p.brand || "—"}</td>
            <td>{p.category}</td>
            <td>${p.price}</td>
            <td>{p.stock}</td>
            <td>
              <button
                className={`${styles.actionBtn} ${styles.restrictBtn}`}
                onClick={() => deleteProduct(p._id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>

    {showAddProduct && (
      <AddProductModal
        onClose={() => setShowAddProduct(false)}
        onAdded={fetchData}
      />
    )}
  </div>
)}
        </>
      )}
    </div>
  );
}