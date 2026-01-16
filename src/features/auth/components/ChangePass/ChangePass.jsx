import classNames from 'classnames/bind';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import styles from './ChangePass.module.scss';
import Button from '../../../../components/Button/index-button';
import { changePasswordAPI } from '../../../../services/authServices';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    currentPass: yup.string().required('Vui lòng nhập mật khẩu hiện tại').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    newPass: yup.string().required('Vui lòng nhập mật khẩu mới').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPass: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('newPass'), null], 'Mật khẩu xác nhận không khớp'),
});
function ChangePass() {
    const { closeModal } = useAuth();

    const [showPassword, setShowPassword] = useState(false);
    const [typePassword, setTypePassword] = useState('password');

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
        setTypePassword((prev) => (prev === 'password' ? 'text' : 'password'));
    };

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        try {
            const res = await changePasswordAPI({
                currentPass: data.currentPass,
                newPass: data.newPass,
            });

            if (res && res.status) {
                toast.success('Đổi mật khẩu thành công');
                reset();
                closeModal();
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Đổi mật khẩu thất bại!';
            toast.error(msg);
        }
    };

    return (
        <>
            <div className={cx('wrapper', 'change-pass-modal')}>
                <div className={cx('modal-content')}>
                    <div className={cx('close-modal')} onClick={closeModal}>
                        &times;
                    </div>
                    <form className={cx('change-pass-form')} onSubmit={handleSubmit(onSubmit)}>
                        <h3 className={cx('title')}>Đổi mật khẩu</h3>
                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.currentPass })}
                                type={typePassword}
                                placeholder="Mật khẩu hiện tại"
                                {...register('currentPass')}
                            />
                            <FontAwesomeIcon
                                className={cx('eye-icon')}
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={togglePasswordVisibility}
                            />
                            {errors.currentPass && (
                                <span className={cx('form-message')}>{errors.currentPass.message}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.newPass })}
                                type={typePassword}
                                placeholder="Mật khẩu mới"
                                {...register('newPass')}
                            />
                            <FontAwesomeIcon
                                className={cx('eye-icon')}
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={togglePasswordVisibility}
                            />
                            {errors.newPass && <span className={cx('form-message')}>{errors.newPass.message}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.confirmPass })}
                                type={typePassword}
                                placeholder="Xác nhận mật khẩu"
                                {...register('confirmPass')}
                            />
                            <FontAwesomeIcon
                                className={cx('eye-icon')}
                                icon={showPassword ? faEye : faEyeSlash}
                                onClick={togglePasswordVisibility}
                            />
                            {errors.confirmPass && (
                                <span className={cx('form-message')}>{errors.confirmPass.message}</span>
                            )}
                        </div>

                        <div className={cx('btn-change')}>
                            <Button primary className={cx('btn')}>
                                {isSubmitting ? 'Đang xử lý...' : 'Xác nhận'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ChangePass;
