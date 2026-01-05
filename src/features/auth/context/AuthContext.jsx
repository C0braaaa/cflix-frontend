import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cflix_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('login'); // 'login' or 'register'

    // login is called when login successful
    const login = (userData, token) => {
        setUser(userData);
        localStorage.setItem('cflix_user', JSON.stringify(userData));
        localStorage.setItem('cflix_token', token);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('cflix_user');
        localStorage.removeItem('cflix_token');
    };

    const openModal = (type) => {
        setModalType(type);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const value = {
        user,
        login,
        logout,
        isModalOpen,
        modalType,
        openModal,
        closeModal,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
