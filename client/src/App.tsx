import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { VerifyEmailPage } from './pages/VerifyEmailPage';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <BrowserRouter>
      <Toaster position='top-center' />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/signup' element={<SignupPage />} />
        <Route path='/verify-email' element={<VerifyEmailPage />} />
        <Route path='*' element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}


export default App;
