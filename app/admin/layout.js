import SiteSettingsClientEffect from "@/components/site-settings-client-effect";
import AdminNavbar from "@/components/admin-navbar";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminLayout({ children }) {
  return (
    <div className="min-vh-100 d-flex">
      <SiteSettingsClientEffect />
      <div className="bg-dark text-light min-vh-100 d-flex flex-column p-0" style={{width:'260px'}}>
        <AdminNavbar />
      </div>
      <div className="flex-grow-1">
        <div>{children}</div>
      </div>
    </div>
  );
}
