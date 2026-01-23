import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import GlobalStyles from './components/GlobalStyles';
import { AuthProvider } from './features/auth/context/AuthContext';
import { GoogleOAuthProvider as Google } from '@react-oauth/google';
// import { socket } from './utils/socket';

const root = ReactDOM.createRoot(document.getElementById('root'));
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
root.render(
    <React.StrictMode>
        <Google clientId={clientId}>
            <AuthProvider>
                <GlobalStyles>
                    <App />
                </GlobalStyles>
            </AuthProvider>
        </Google>
    </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
