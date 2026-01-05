import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { loginAPI } from '../../../../services/authServices';
import styles from './LoginForm.module.scss';
import Button from '../../../../components/Button/index-button';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const cx = classNames.bind(styles);

// 4. Định nghĩa Schema Validation (Quy tắc kiểm tra)
// Phần này tách biệt hoàn toàn logic check lỗi ra khỏi UI
const validationSchema = yup.object().shape({
    email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ (ví dụ: abc@gmail.com)'),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});

function LoginForm() {
    const { closeModal, openModal, login } = useAuth();
    const [apiError, setApiError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [typePassword, setTypePassword] = useState('password');
    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
        setTypePassword((prev) => (prev === 'password' ? 'text' : 'password'));
    };

    // 5. Khởi tạo form với useForm
    const {
        register, // Dùng để đăng ký input vào hook form
        handleSubmit, // Hàm xử lý khi submit form
        formState: { errors }, // Lấy ra object chứa các lỗi
    } = useForm({
        resolver: yupResolver(validationSchema), // Kết nối Yup với Hook Form
        mode: 'onBlur', // Validate ngay khi người dùng rời khỏi ô input (UX tốt hơn)
    });

    const onSubmit = async (data) => {
        try {
            setApiError('');
            const res = await loginAPI(data);
            login(res, res.accessToken);
            toast.success('Đăng nhập thành công');
            closeModal();
        } catch (error) {
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
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-control', { invalid: errors.email })}
                            type="text"
                            placeholder="Email"
                            {...register('email')} // Đăng ký input này tên là 'email'
                        />
                        {/* Hiển thị lỗi nếu có */}
                        {errors.email && <span className={cx('form-message')}>{errors.email.message}</span>}
                    </div>

                    {/* INPUT PASSWORD */}
                    <div className={cx('form-group')}>
                        <input
                            className={cx('form-control', { invalid: errors.password })}
                            type={typePassword}
                            placeholder="Mật khẩu"
                            {...register('password')} // Đăng ký input này tên là 'password'
                        />
                        <FontAwesomeIcon
                            className={cx('eye-icon')}
                            icon={showPassword ? faEye : faEyeSlash}
                            onClick={togglePasswordVisibility}
                        />
                        {errors.password && <span className={cx('form-message')}>{errors.password.message}</span>}
                    </div>

                    <div className={cx('btn-login')}>
                        {/* Button submit phải có type="submit" hoặc nằm trong form */}
                        <Button type="submit" primary className={cx('btn')}>
                            Đăng Nhập
                        </Button>

                        {/* Button Google không phải submit form nên để type="button" để tránh trigger submit */}
                        <Button
                            type="button"
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
                </form>
            </div>
        </div>
    );
}

export default LoginForm;
