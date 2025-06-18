export default function Loading() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center min-vh-100 w-100 bg-white">
      <div className="spinner-border text-primary mb-3" role="status">
        <span className="visually-hidden">Yükleniyor...</span>
      </div>
      <div className="fw-bold fs-5">Yükleniyor...</div>
    </div>
  );
}
