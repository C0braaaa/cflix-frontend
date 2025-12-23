import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../context/AuthContext';
import styles from './ForgotForm.module.scss';
import Button from '../../../../components/Button/index-button';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ (ví dụ: abc@gmail.com)'),
});
function ForgotForm() {
    const { closeModal, openModal } = useAuth();

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
                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.email })}
                                type="text"
                                placeholder="Email"
                                {...register('email')}
                            />
                            {errors.email && <span className={cx('form-message')}>{errors.email.message}</span>}
                        </div>

                        <div className={cx('btn-forgot')}>
                            <Button primary className={cx('btn')}>
                                Gửi yêu cầu
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}

export default ForgotForm;
