
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@/App';
import '@/index.css';
import { AuthProvider } from '@/contexts/SupabaseAuthContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/i18n/config';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/i18n/config';

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </I18nextProvider>
    </ErrorBoundary>
  </>
);
