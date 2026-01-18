import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { GoogleLogin } from '@react-oauth/google';

import { useAuth } from '../../context/AuthContext';
import { commonRules } from '../../../../utils/validationSchema';
import InputField from '../../../../components/Input/InputField';
import PasswordInput from '../../../../components/Input/PasswordInput';
import { loginAPI, loginGoogleAPI } from '../../../../services/authServices';
import styles from './LoginForm.module.scss';
import Button from '../../../../components/Button/index-button';

const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    email: commonRules.email,
    password: commonRules.password,
});

function LoginForm() {
    const { closeModal, openModal, login } = useAuth();
    const [apiError, setApiError] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        try {
            setApiError('');
            const res = await loginAPI(data);
            if (res && res.user) {
                login(res.user);

                toast.success('Đăng nhập thành công');
                closeModal();
            } else {
                setApiError('Không lấy được thông tin người dùng!');
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Đăng nhập thất bại, vui lòng thử lại.';
            setApiError(msg);
            toast.error(msg);
        }
    };

    const handleLoginGoogle = async (credentialResponse) => {
        try {
            setApiError('');
            const res = await loginGoogleAPI(credentialResponse.credential);

            if (res && res.user) {
                login(res.user);
                toast.success('Đăng nhập thành công!');
                closeModal();
            }
        } catch (error) {
            console.log(error);
            const msg = error.response?.data?.message || 'Đăng nhập thất bại, vui lòng thử lại.';
            setApiError(msg);
            toast.error(msg);
        }
    };

    return (
        <div className={cx('wrapper', 'login-modal')}>
            <div className={cx('modal-content')}>
                <div className={cx('close-modal')} onClick={closeModal}>
                    &times;
                </div>
                {/* 7. Bọc form bằng thẻ form và sự kiện onSubmit */}
                <form className={cx('login-form')} onSubmit={handleSubmit(onSubmit)}>
                    <h3 className={cx('title')}>Đăng nhập</h3>
                    {apiError && (
                        <div
                            className={cx('error-alert')}
                            style={{
                                color: 'red',
                                fontSize: '1.4rem',
                                marginBottom: '1rem',
                                textAlign: 'center',
                                background: 'rgba(255,0,0,0.1)',
                                padding: '0.5rem',
                                borderRadius: '4px',
                            }}
                        >
                            {apiError}
                        </div>
                    )}
                    <p className={cx('switch-top-regiter')}>
                        Nếu chưa có tài khoản,{' '}
                        <span className={cx('register')} onClick={() => openModal('register')}>
                            đăng ký ngay
                        </span>
                    </p>

                    {/* INPUT EMAIL */}
                    <InputField placeholder="Email" error={errors.email} {...register('email')} />
                    <PasswordInput placeholder="Mật khẩu" error={errors.password} {...register('password')} />

                    <div className={cx('btn-login')}>
                        {/* Button submit phải có type="submit" hoặc nằm trong form */}
                        <Button type="submit" primary className={cx('btn')}>
                            Đăng Nhập
                        </Button>

                        {/* Button Google không phải submit form nên để type="button" để tránh trigger submit */}
                        <div className={cx('btn-google')}>
                            <GoogleLogin
                                onSuccess={handleLoginGoogle}
                                onError={() => toast.error('Lỗi kết nối đến Google')}
                                theme="filled_blue" // Hoặc 'outline', 'filled_black'
                                shape="rectangular" // Hoặc 'pill', 'circle'
                                text="signin_with"
                            />
                        </div>
                    </div>

                    <p className={cx('forgot-password')} onClick={() => openModal('forgot')}>
                        Quên mật khẩu?
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
