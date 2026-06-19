import Link from "next/link";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export default function JoinLayout({
  title,
  subtitle,
  children,
}: AuthLayoutProps) {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "2rem",
      }}
    >
      <div
        className="animate-fade-in"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "16px",
            padding: "2.5rem",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
            maxHeight: "85vh",
            overflowY: "auto",
          }}
        >
          <h2
            style={{
              color: "#ff477e",
              fontSize: "1.8rem",
              marginBottom: "0.2rem",
            }}
          >
            {title}
          </h2>
          <p
            style={{
              color: "#94a3b8",
              fontSize: "0.9rem",
              marginBottom: "1.5rem",
            }}
          >
            {subtitle}
          </p>

          {children}
        </div>
      </div>
    </main>
  );
}
