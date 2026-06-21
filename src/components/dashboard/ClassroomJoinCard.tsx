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
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .join-layout-main {
          padding: 1rem;
        }
        .join-layout-card {
          padding: 1.5rem;
        }
        @media (min-width: 768px) {
          .join-layout-main {
            padding: 2rem;
          }
          .join-layout-card {
            padding: 2.5rem;
          }
        }
      `}} />
      <main
        className="join-layout-main"
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          boxSizing: "border-box",
          width: "100%",
        }}
      >
        <div
          className="animate-fade-in"
          style={{ width: "100%", maxWidth: "400px", boxSizing: "border-box" }}
        >
          <div
            className="join-layout-card"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
              maxHeight: "85vh",
              overflowY: "auto",
              boxSizing: "border-box",
              width: "100%",
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
    </>
  );
}
