import classNames from 'classnames/bind';

import ValidatorForm from '../../../../components/Validator/Validator';
import { useAuth } from '../../context/AuthContext';
import styles from './LoginForm.module.scss';
import Button from '../../../../components/Button/index-button';

const cx = classNames.bind(styles);

function LoginForm() {
    const { closeModal, openModal } = useAuth();

    return (
        <>
            <div className={cx('wrapper', 'login-modal')}>
                <div className={cx('modal-content')}>
                    <div className={cx('close-modal')} onClick={closeModal}>
                        &times;
                    </div>
                    <div className={cx('login-form')}>
                        <h3 className={cx('title')}>Đăng nhập</h3>
                        <p className={cx('switch-top-regiter')}>
                            Nếu chưa có tài khoản,{' '}
                            <span className={cx('register')} onClick={() => openModal('register')}>
                                đăng ký ngay
                            </span>
                        </p>
                        <ValidatorForm name="email" placeholder="Email" type="text" rules="required|email" />
                        <ValidatorForm name="password" placeholder="Mật khẩu" type="text" rules="required|min:6" />

                        <div className={cx('btn-login')}>
                            <Button primary className={cx('btn')}>
                                Đăng Nhập
                            </Button>
                            <Button
                                primary
                                className={cx('btn')}
                                leftIcon={
                                    <img
                                        src="/assets/images/google-icon-logo-svgrepo-com.svg"
                                        alt="Google"
                                        className={cx('google-icon')}
                                    />
                                }
                            >
                                Đăng nhập bằng Google
                            </Button>
                        </div>

                        <p className={cx('forgot-password')} onClick={() => openModal('forgot')}>
                            Quên mật khẩu?
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
