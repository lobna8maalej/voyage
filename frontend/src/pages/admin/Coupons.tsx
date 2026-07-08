import { useEffect, useState } from "react";
import api from "./axios";

interface Coupon {
  _id: string;
  code: string;
  discount: number;
  expireDate: string;
  active: boolean;
}

const Coupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);

  // ================= FETCH COUPONS =================
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        setLoading(true);

        const res = await api.get("/coupons");

        // 🔥 SAFE ACCESS (évite crash si backend change)
        setCoupons(res.data?.coupons || []);
      } catch (err) {
        console.error("Error loading coupons:", err);
        setCoupons([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, []);

  // ================= LOADING =================
  if (loading) {
    return <h3 style={{ padding: 20 }}>Loading coupons...</h3>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>🎁 Coupons</h2>

      {/* EMPTY STATE */}
      {coupons.length === 0 && (
        <p>Aucun coupon trouvé.</p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {coupons.map((c) => {
          const isExpired = new Date(c.expireDate) < new Date();

          return (
            <div
              key={c._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: 15,
                background: !c.active || isExpired
                  ? "#ffecec"
                  : "#eaffea",
              }}
            >
              {/* CODE */}
              <h3>{c.code}</h3>

              {/* DISCOUNT */}
              <p>💸 Discount: {c.discount}%</p>

              {/* EXPIRATION */}
              <p>
                📅 Expire:{" "}
                {new Date(c.expireDate).toLocaleDateString()}
              </p>

              {/* STATUS */}
              <p>
                {c.active && !isExpired ? (
                  <span style={{ color: "green" }}>Active</span>
                ) : (
                  <span style={{ color: "red" }}>
                    Inactive / Expired
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Coupons;