import { useEffect, useState } from "react";
import api from "./axios";

const Revenue = () => {
  const [payments, setPayments] = useState<any[]>([]);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await api.get("/admin/payments");
        setPayments(res.data);
      } catch (err) {
        console.log("ERROR:", err);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>💰 Revenue Dashboard</h1>

      {payments.map((p) => (
        <div
          key={p.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            margin: 10,
          }}
        >
          <p>💳 Amount: {p.amount / 100} USD</p>
          <p>📌 Status: {p.status}</p>
          <p>🆔 ID: {p.id}</p>
        </div>
      ))}
    </div>
  );
};

export default Revenue;