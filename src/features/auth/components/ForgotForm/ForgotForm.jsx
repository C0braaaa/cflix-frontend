import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import styles from './ForgotForm.module.scss';
import Button from '../../../../components/Button/index-button';
import { forgotPasswordAPI } from '../../../../services/authServices';
import InputField from '../../../../components/Input/InputField';
import { commonRules } from '../../../../utils/validationSchema';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    email: commonRules.email,
});
function ForgotForm() {
    const { closeModal, openModal } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        try {
            const res = await forgotPasswordAPI(data.email);

            if (res && res.status) {
                toast.success(res.msg || 'Vui lòng kiểm tra email để đặt lại mật khẩu!');

                closeModal();
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
            toast.error(msg);
        }
    };

    return (
        <>
            <div className={cx('wrapper', 'forgot-modal')}>
                <div className={cx('modal-content')}>
                    <div className={cx('close-modal')} onClick={closeModal}>
                        &times;
                    </div>
                    <form className={cx('forgot-form')} onSubmit={handleSubmit(onSubmit)}>
                        <h3 className={cx('title')}>Quên mật khẩu</h3>
                        <p className={cx('switch-top-login')}>
                            Bạn đã có tài khoản,{' '}
                            <span className={cx('register')} onClick={() => openModal('login')}>
                                đăng nhập ngay
                            </span>
                        </p>
                        <InputField placeholder="Email" error={errors.email} {...register('email')} />

                        <div className={cx('btn-forgot')}>
                            <Button primary className={cx('btn')} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang gửi...' : 'Gửi yêu cầu'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotForm;
