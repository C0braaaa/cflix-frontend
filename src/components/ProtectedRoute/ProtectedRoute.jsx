// src/components/ProtectedRoute/ProtectedRoute.jsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../features/auth/context/AuthContext';
import NotFound404 from '../../pages/ErorrPage/NotFound404';

const ProtectedRoute = ({ allowedRoles }) => {
    const { user } = useAuth();

    if (!user) {
        return <Navigate to="/" />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <NotFound404 />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
