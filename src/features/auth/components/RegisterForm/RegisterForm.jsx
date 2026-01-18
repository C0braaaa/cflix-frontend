import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import { registerAPI } from '../../../../services/authServices';
import styles from './RegisterForm.module.scss';
import Button from '../../../../components/Button/index-button';
import { commonRules } from '../../../../utils/validationSchema';
import InputField from '../../../../components/Input/InputField';
import PasswordInput from '../../../../components/Input/PasswordInput';

const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    username: commonRules.username,
    email: commonRules.email,
    password: commonRules.password,
    confirmPassword: commonRules.confirmPassword,
});

function RegisterForm() {
    const { closeModal, openModal } = useAuth();
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
            await registerAPI(data);
            toast.success('Đăng ký thành công');
            openModal('login');
        } catch (error) {
            const msg = error.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại.';
            setApiError(msg);
            toast.error(msg);
        }
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
                        <p className={cx('switch-top-login')}>
                            Bạn đã có tài khoản,{' '}
                            <span className={cx('register')} onClick={() => openModal('login')}>
                                đăng nhập ngay
                            </span>
                        </p>

                        <InputField placeholder="Tên hiển thị" error={errors.username} {...register('username')} />
                        <InputField placeholder="Email" error={errors.email} {...register('email')} />
                        <PasswordInput placeholder="Mật khẩu" error={errors.password} {...register('password')} />
                        <PasswordInput
                            placeholder="Xác nhận mật khẩu"
                            error={errors.confirmPassword}
                            {...register('confirmPassword')}
                        />

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
