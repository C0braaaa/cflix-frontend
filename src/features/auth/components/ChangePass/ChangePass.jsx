import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import { useAuth } from '../../context/AuthContext';
import styles from './ChangePass.module.scss';
import Button from '../../../../components/Button/index-button';
import { changePasswordAPI } from '../../../../services/authServices';
import PasswordInput from '../../../../components/Input/PasswordInput';
import { commonRules } from '../../../../utils/validationSchema';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    currentPass: commonRules.currentPass,
    newPass: commonRules.newPass,
    confirmNewPass: commonRules.confirmNewPass,
});
function ChangePass() {
    const { closeModal } = useAuth();

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
                        <PasswordInput
                            placeholder="Mật khẩu hiện tại"
                            error={errors.currentPass}
                            {...register('currentPass')}
                        />
                        <PasswordInput placeholder="Mật khẩu mới" error={errors.newPass} {...register('newPass')} />
                        <PasswordInput
                            placeholder="Xác nhận mật khẩu mới"
                            error={errors.confirmNewPass}
                            {...register('confirmNewPass')}
                        />

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
