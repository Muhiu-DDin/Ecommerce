import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {BrowserRouter} from "react-router-dom"
import { AuthProvider } from './context/authContext.jsx'
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById('root')).render(
    <AuthProvider>
        <BrowserRouter>
            <App />
            <Toaster position="bottom-right" reverseOrder={false} />
        </BrowserRouter>
    </AuthProvider>
)
