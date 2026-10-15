import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../features/auth/authSlice';
import { FormField } from '../components/UI';

const validate = (f) => {
  const e = {};
  if (f.name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!/^\S+@\S+\.\S+$/.test(f.email)) e.email = 'Enter a valid email address.';
  if (f.password.length < 6) e.password = 'Password must be at least 6 characters.';
  if (f.confirm !== f.password) e.confirm = 'Passwords do not match.';
  return e;
};

export default function Register() {
  const dispatch = useDispatch();
  const authError = useSelector((s) => s.auth.error);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => () => { dispatch(clearError()); }, [dispatch]);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = validate(form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      dispatch(register({ name: form.name, email: form.email, password: form.password }));
    }
  };

  return (
    <div className="auth-card">
      <h1>Create account</h1>
      <p className="muted">Join to discover and register for events.</p>
      {authError && <div className="alert alert-error">{authError}</div>}
      <form onSubmit={onSubmit} noValidate>
        <FormField label="Name" name="name" value={form.name} onChange={onChange} error={errors.name} />
        <FormField label="Email" type="email" name="email" value={form.email} onChange={onChange} error={errors.email} />
        <FormField label="Password" type="password" name="password" value={form.password} onChange={onChange} error={errors.password} />
        <FormField label="Confirm password" type="password" name="confirm" value={form.confirm} onChange={onChange} error={errors.confirm} />
        <button className="btn btn-block" type="submit">Sign up</button>
      </form>
      <p className="muted center">Already registered? <Link to="/login" className="link">Login</Link></p>
    </div>
  );
}