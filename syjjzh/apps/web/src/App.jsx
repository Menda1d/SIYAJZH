import React from 'react';
import { Route, Routes, BrowserRouter as Router } from 'react-router-dom';
import ScrollToTop from './components/ScrollToTop';
import { CartProvider } from '@/lib/CartContext';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';

function App() {
    return (
        <Router>
            <ScrollToTop />
            <CartProvider>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                </Routes>
            </CartProvider>
        </Router>
    );
}

export default App;
