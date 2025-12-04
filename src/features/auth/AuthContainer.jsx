import AuthModal from './components/AuthModal/AuthModal';
import LoginForm from './components/LoginForm/LoginForm';
import RegisterForm from './components/RegisterForm/RegisterForm';
import ForgotForm from './components/ForgotForm/ForgotForm';
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
        </>
    );
}

export default AuthContainer;
