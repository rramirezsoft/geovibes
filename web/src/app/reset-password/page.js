import { Suspense } from 'react';
import ResetPasswordClient from './components/resetPasswordClient';
import Loading from '../components/loading';

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0e1a2b] flex items-center justify-center px-4 font-baloo">
          <div className="bg-[#1f2b3a] rounded-xl shadow-lg w-full max-w-md p-6 flex justify-center items-center">
            <Loading size="lg" />
          </div>
        </div>
      }
    >
      <ResetPasswordClient />
    </Suspense>
  );
}
