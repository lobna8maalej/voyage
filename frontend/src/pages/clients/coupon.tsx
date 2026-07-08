import { useEffect, useState } from "react";
import api from "../admin/axios";

type Coupon = {
  _id: string;
  code: string;
  discount: number;
  expireDate: string;
  active: boolean;
};

const CouponsPage = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);

        const res = await api.get("/coupons"); 
        // 🔥 IMPORTANT FIX ICI
        setCoupons(res.data.coupons);

      } catch (err) {
        console.error(err);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  /* ================= COPY ================= */
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Code ${code} copié !`);
  };

  /* ================= APPLY ================= */
  const applyCoupon = (code: string) => {
    alert(`Coupon appliqué : ${code}`);
  };

  if (loading) return <h3 style={{ padding: 20 }}>Loading coupons...</h3>;

  return (
    <div style={{ padding: 20, background: "#f5f6f8" }}>
      <h2>🎟️ Coupons</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
          marginTop: 20,
        }}
      >
        {coupons.map((c) => {
          const isExpired = new Date(c.expireDate) < new Date();

          return (
            <div
              key={c._id}
              style={{
                background: "#fff",
                borderRadius: 12,
                padding: 15,
                opacity: isExpired ? 0.5 : 1,
                border: "1px solid #eee",
              }}
            >
              <h3>{c.code}</h3>

              <p>💸 Discount: {c.discount}%</p>

              <p>
                📅 Expire:{" "}
                {new Date(c.expireDate).toLocaleDateString()}
              </p>

              <p>
                {c.active && !isExpired ? (
                  <span style={{ color: "green" }}>Active</span>
                ) : (
                  <span style={{ color: "red" }}>Inactive</span>
                )}
              </p>

              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => copyCode(c.code)}>
                  📋 Copy
                </button>

                <button
                  disabled={!c.active || isExpired}
                  onClick={() => applyCoupon(c.code)}
                >
                  ✅ Apply
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CouponsPage;