import { createContext, useContext, useEffect, useState } from 'react';
import { logoutAPI } from '../../../services/authServices';
import { getMeAPI } from '../../../services/userServices';
import { socket } from '../../../utils/socket';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('cflix_user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState('login'); // 'login' or 'register'

    useEffect(() => {
        if (!user || !user._id) return;

        if (socket.connected) {
            socket.emit('join_user_room', user._id);
        }

        const handleConnect = () => {
            socket.emit('join_user_room', user._id);
        };
        socket.on('connect', handleConnect);

        const handleAccountLocked = () => {
            setUser(null);
            localStorage.removeItem('cflix_user');
            sessionStorage.setItem(
                'notify_after_load',
                'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.',
            );
            window.location.href = '/';
        };

        const handleAccountDeleted = () => {
            setUser(null);
            localStorage.removeItem('cflix_user');
            sessionStorage.setItem('notify_after_load', 'Tài khoản của bạn đã bị xóa, liên hệ với admin để khôi phục.');
            window.location.href = '/';
        };

        socket.once('account_locked', handleAccountLocked);
        socket.once('account_deleted', handleAccountDeleted);

        return () => {
            socket.off('connect', handleConnect);
            socket.off('account_locked', handleAccountLocked);
            socket.off('account_deleted', handleAccountDeleted);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?._id]);

    useEffect(() => {
        const fetchCurrentUser = async () => {
            try {
                const res = await getMeAPI();
                if (res && res.user) {
                    setUser(res.user);
                    localStorage.setItem('cflix_user', JSON.stringify(res.user));
                    socket.emit('join_user_room', res.user._id);
                }
            } catch (error) {
                console.log(error);
                setUser(null);
                localStorage.removeItem('cflix_user');
            }
        };
        if (localStorage.getItem('cflix_user')) {
            fetchCurrentUser();
        }
    }, []);

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
        localStorage.setItem('cflix_user', JSON.stringify(updatedUser));
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
