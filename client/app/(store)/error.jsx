"use client";
export default function ErrorPage({ reset }) {
  return (
    <div className="container error-panel">
      <h2>Something took a wrong turn.</h2>
      <p>Give it another try. Your saved bag is still in this browser.</p>
      <button className="button" onClick={reset}>
        Try again
      </button>
    </div>
  );
}
