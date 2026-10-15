import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../features/auth/authSlice';
import { FormField } from '../components/UI';

export default function Login() {
  const dispatch = useDispatch();
  const authError = useSelector((s) => s.auth.error);
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address.';
    if (!form.password) errs.password = 'Password is required.';
    setErrors(errs);
    if (Object.keys(errs).length === 0) dispatch(login(form));
  };

  return (
    <div className="auth-card">
      <h1>Welcome back</h1>
      <p className="muted">Log in to register for events.</p>
      {authError && <div className="alert alert-error">{authError}</div>}
      <form onSubmit={onSubmit} noValidate>
        <FormField label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} />
        <FormField label="Password" type="password" name="password" value={form.password} onChange={onChange} error={errors.password} />
        <button className="btn btn-block" type="submit">Login</button>
      </form>
      <p className="muted center">No account? <Link to="/register" className="link">Sign up</Link></p>
    </div>
  );
}