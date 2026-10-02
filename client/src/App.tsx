import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { AppLayout } from './components/AppLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { VerifyResetCodePage } from './pages/VerifyResetCodePage';
import { ResetPasswordPage } from './pages/ResetPasswordPage';
import { LinkAccountPage } from './pages/LinkAccountPage';
import { SecuritySettingsPage } from './pages/SecuritySettingsPage';
import { ConfirmLinkPage } from './pages/ConfirmLinkPage';
import { VerifySetPasswordCodePage } from './pages/VerifySetPasswordCodePage';
import { SetPasswordPage } from './pages/SetPasswordPage';
import { ChangePasswordPage } from './pages/ChangePasswordPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        {/*  Protected Routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path='/' element={<HomePage />} />
          <Route path='/settings/security' element={<SecuritySettingsPage />} />
          <Route path='/link-account' element={<SecuritySettingsPage />} />
          <Route path='/change-password' element={<ChangePasswordPage />} />
          <Route
            path='/set-password/verify'
            element={<VerifySetPasswordCodePage />}
          />
          <Route path='/set-password' element={<SetPasswordPage />} />
        </Route>

        {/* Public Auth Routes */}
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/confirm-link' element={<ConfirmLinkPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route
          path='/forgot-password/verify'
          element={<VerifyResetCodePage />}
        />
        <Route path='/reset-password' element={<ResetPasswordPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
