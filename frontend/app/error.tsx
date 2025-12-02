"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const isProd = process.env.NODE_ENV === "production";

  return (
    <div style={{ padding: "4rem", textAlign: "center" }}>
      <h1>エラー</h1>

      {isProd ? (
        <>
          {/* 本番は安全な文言 */}
          <p>エラーが発生しました。</p>
        </>
      ) : (
        <>
          {/* 開発・ステージングは詳細表示 */}
          <p style={{ color: "red", marginTop: "1rem" }}>{error.message}</p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              marginTop: "1rem",
              fontSize: "0.9rem",
              textAlign: "left",
              display: "inline-block",
            }}
          >
            {error.stack}
          </pre>
        </>
      )}

      <button onClick={() => reset()} style={{ marginTop: "2rem" }}>
        再読み込み
      </button>
    </div>
  );
}
