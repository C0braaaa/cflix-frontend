import classNames from 'classnames/bind';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSearchParams, useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import styles from './ForgotPassPage.module.scss';
import { resetPasswordAPi, verifyTokenResetPassAPI } from '../../../../services/authServices';
import Button from '../../../../components/Button/index-button';
import { useAuth } from '../../context/AuthContext';
import PasswordInput from '../../../../components/Input/PasswordInput';
import { commonRules } from '../../../../utils/validationSchema';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    newPass: commonRules.newPass,
    confirmNewPass: commonRules.confirmNewPass,
});
function ForgotPassPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');

    const { user } = useAuth();

    const [verifying, setVerifying] = useState(true);

    useEffect(() => {
        const checkToken = async () => {
            if (user) {
                toast.info('Bạn đã đăng nhập rồi!');
                navigate('/');
                return;
            }

            if (!token) {
                navigate('/', { state: { openModal: 'login' } });
                toast.warn('Vui lòng đăng nhập để tiếp tục!');
                return;
            }

            try {
                await verifyTokenResetPassAPI(token);
                setVerifying(false);
            } catch (error) {
                toast.error('Token đã hết hạn hoặc không tồn tại. Vui lòng lấy lại mã mới!');
                navigate('/', { state: { openModal: 'forgot' } });
                console.log(error);
            }
        };

        checkToken();
    }, [user, token, navigate]);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onBlur',
    });

    const onSubmit = async (data) => {
        if (!token) {
            toast.error('Token đã hết hạn hoặc không tồn tại!');
            return;
        }
        try {
            const res = await resetPasswordAPi({ token: token, newPass: data.newPass });
            if (res && res.status) {
                toast.success('Đặt lại mật khẩu thành công!');
                navigate('/', { state: { openModal: 'login' } });
            }
        } catch (error) {
            const msg = error.response?.data?.message || error.message || 'Có lỗi xảy ra!';
            toast.error(msg);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('background-layer')} />
                <div className={cx('logo')}>
                    <img src="/assets/images/logo.png" alt="logo-cflix" />
                </div>
                {!verifying ? (
                    <div className={cx('content')}>
                        <form className={cx('forgot-form')} onSubmit={handleSubmit(onSubmit)}>
                            <h5 className={cx('title')}>Đặt lại mật khẩu</h5>
                            <PasswordInput placeholder="Mật khẩu mới" error={errors.newPass} {...register('newPass')} />
                            <PasswordInput
                                placeholder="Xác nhận mật khẩu mới"
                                error={errors.confirmNewPass}
                                {...register('confirmNewPass')}
                            />
                            <Button primary className={cx('btn-forgot')} type="submit" disabled={isSubmitting}>
                                {isSubmitting ? 'Đang xử lí...' : 'Xác nhận'}
                            </Button>
                        </form>
                    </div>
                ) : (
                    <div className={cx('token-expired')}>
                        <p>Token đã hết hạn hoặc không tồn tại. Vui lòng lấy lại mã mới!</p>
                    </div>
                )}
                <div className={cx('footer')}>
                    <p className={cx('copyright')}>
                        <span>&copy; Copyright {new Date().getFullYear()}</span> CFlix
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassPage;
