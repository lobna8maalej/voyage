import { useEffect, useState } from "react";
import api from "./axios";

interface Review {
  _id: string;
  rating: number;
  comment: string;
  user?: {
    name: string;
  };
}

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  // ================= FETCH REVIEWS =================
  useEffect(() => {
    api.get("/reviews").then((res) => {
      setReviews(res.data);
    });
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>⭐ Reviews</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: 20,
        }}
      >
        {reviews.map((r) => (
          <div
            key={r._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 15,
              background: "#fff",
            }}
          >
            {/* USER */}
            <h3>👤 {r.user?.name || "User"}</h3>

            {/* RATING */}
            <p>⭐ Rating: {r.rating}/5</p>

            {/* COMMENT */}
            <p>💬 {r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;