import { createContext, useContext, useState } from 'react';
import { logoutAPI } from '../../../services/authServices';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cflix_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('login'); // 'login' or 'register'

    // login is called when login successful
    const login = (userData) => {
        setUser(userData);
        localStorage.setItem('cflix_user', JSON.stringify(userData));
    };

    const logout = async () => {
        try {
            await logoutAPI();
        } catch (error) {
            console.log(error);
        } finally {
            setUser(null);
            localStorage.removeItem('cflix_user');
        }
    };

    const updateUserState = (newUser) => {
        const updatedUser = { ...user, ...newUser };
        setUser(updatedUser);
        localStorage.getItem('cflix_user', JSON.stringify(updatedUser));
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
        updateUserState,
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
