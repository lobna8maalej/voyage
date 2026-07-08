export default function ImageCarousel({ images }: { images: string[] }) {
  return (
    <div style={{ display: "flex", overflowX: "auto", gap: 10 }}>
      {images?.map((img, i) => (
        <img
          key={i}
          src={img}
          style={{
            width: "100%",
            height: 300,
            objectFit: "cover",
            borderRadius: 10,
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}