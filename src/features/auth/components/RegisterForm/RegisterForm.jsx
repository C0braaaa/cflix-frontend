import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { useAuth } from '../../context/AuthContext';
import styles from './RegisterForm.module.scss';
import Button from '../../../../components/Button/index-button';

const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    username: yup.string().required('Vui lòng nhập tên hiển thị'),
    email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ (ví dụ: abc@gmail.com)'),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
});

function RegisterForm() {
    const { closeModal, openModal } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [typePassword, setTypePassword] = useState('password');

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
        setTypePassword((prev) => (prev === 'password' ? 'text' : 'password'));
    };

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = (data) => {
        console.log('Dữ liệu form:', data);
    };

    return (
        <>
            <div className={cx('wrapper', 'register-modal')}>
                <div className={cx('modal-content')}>
                    <div className={cx('close-modal')} onClick={closeModal}>
                        &times;
                    </div>
                    <form className={cx('register-form')} onSubmit={handleSubmit(onSubmit)}>
                        <h3 className={cx('title')}>Đăng ký</h3>
                        <p className={cx('switch-top-login')}>
                            Bạn đã có tài khoản,{' '}
                            <span className={cx('register')} onClick={() => openModal('login')}>
                                đăng nhập ngay
                            </span>
                        </p>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.username })}
                                type="text"
                                placeholder="Tên hiển thị"
                                {...register('username')}
                            />
                            {errors.username && <span className={cx('form-message')}>{errors.username.message}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.email })}
                                type="text"
                                placeholder="Email"
                                {...register('email')}
                            />
                            {errors.email && <span className={cx('form-message')}>{errors.email.message}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.password })}
                                type={typePassword}
                                autoComplete="new-password"
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

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.confirmPassword })}
                                type={typePassword}
                                placeholder="Xác nhận mật khẩu"
                                {...register('confirmPassword')} // Đăng ký input này tên là 'password'
                            />
                            <FontAwesomeIcon
                                className={cx('eye-icon')}
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={togglePasswordVisibility}
                            />
                            {errors.confirmPassword && (
                                <span className={cx('form-message')}>{errors.confirmPassword.message}</span>
                            )}
                        </div>

                        <div className={cx('btn-register')}>
                            <Button type="submit" primary className={cx('btn')}>
                                Đăng Ký
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default RegisterForm;
