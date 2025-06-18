import LoginForm from "@/components/auth/login-form";

export default function SignupPage() {
  return (
    <div className="d-flex flex-column min-vh-100">
      <div className="flex-grow-1 d-flex align-items-center justify-content-center">
        <LoginForm />
      </div>
    </div>
  );
}
