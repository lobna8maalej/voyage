import LogoutButton from "./LogoutButton";

export default function Navbar() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: 15,
        borderBottom: "1px solid #ddd",
      }}
    >
      <h2>Travel App</h2>

      <LogoutButton />
    </div>
  );
}