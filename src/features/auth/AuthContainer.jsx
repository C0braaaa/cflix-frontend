import AuthModal from './components/AuthModal/AuthModal';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import ForgotForm from './components/ForgotForm/ForgotForm';
import ChangePass from './components/ChangePass/ChangePass';
import { useAuth } from './context/AuthContext';

function AuthContainer() {
    const { modalType, isModalOpen, closeModal } = useAuth();

    return (
        <>
            {modalType === 'login' && (
                <AuthModal isOpen={isModalOpen} onClose={closeModal}>
                    <LoginForm />
                </AuthModal>
            )}
            {modalType === 'register' && (
                <AuthModal isOpen={isModalOpen} onClose={closeModal}>
                    <RegisterForm />
                </AuthModal>
            )}
            {modalType === 'forgot' && (
                <AuthModal isOpen={isModalOpen} onClose={closeModal}>
                    <ForgotForm />
                </AuthModal>
            )}
            {modalType === 'change-pass' && (
                <AuthModal isOpen={isModalOpen} onClose={closeModal}>
                    <ChangePass />
                </AuthModal>
            )}
        </>
    );
}

export default AuthContainer;
