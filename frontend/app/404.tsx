// app/404.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NotFound() {
  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>404 Not Found</h1>
      <p>お探しのページは見つかりませんでした。</p>
    </div>
  );
}
