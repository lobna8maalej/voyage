import { useState } from "react";
import api from "./axios";

const CreateService = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleCreateService = async () => {
    try {
      const formData = new FormData();

      files.forEach((file) => {
        formData.append("images", file);
      });

      // 1️⃣ upload images
      const uploadRes = await api.post("/uploads", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const images = uploadRes.data.images;

      // 2️⃣ create service
      await api.post(
        "/services",
        {
          name,
          type,
          city,
          country,
          images,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      alert("Service created");
    } catch (err) {
      console.log("ERROR:", err);
    }
  };

  return (
    <div>
      <input placeholder="name" onChange={(e) => setName(e.target.value)} />
      <input placeholder="type (hotel, restaurant...)" onChange={(e) => setType(e.target.value)} />
      <input placeholder="city" onChange={(e) => setCity(e.target.value)} />
      <input placeholder="country" onChange={(e) => setCountry(e.target.value)} />

      <input type="file" multiple onChange={handleFileChange} />

      <button onClick={handleCreateService}>
        Create Service
      </button>
    </div>
  );
};

export default CreateService;