import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../context/AuthContext';
import styles from './ChangePass.module.scss';
import Button from '../../../../components/Button/index-button';
const cx = classNames.bind(styles);

const validationSchema = yup.object().shape({
    currentPass: yup.string().required('Vui lòng nhập mật khẩu hiện tại').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    newPass: yup.string().required('Vui lòng nhập mật khẩu mới').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPass: yup.string().required('Vui lòng nhập xác nhận mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
});
function ChangePass() {
    const { closeModal } = useAuth();

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
                        <h3 className={cx('title')}>Đổi mật khẩu</h3>
                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.currentPass })}
                                type="text"
                                placeholder="Mật khẩu hiện tại"
                                {...register('currentPass')}
                            />
                            {errors.currentPass && (
                                <span className={cx('form-message')}>{errors.currentPass.message}</span>
                            )}
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.newPass })}
                                type="text"
                                placeholder="Mật khẩu mới"
                                {...register('newPass')}
                            />
                            {errors.newPass && <span className={cx('form-message')}>{errors.newPass.message}</span>}
                        </div>

                        <div className={cx('form-group')}>
                            <input
                                className={cx('form-control', { invalid: errors.confirmPass })}
                                type="text"
                                placeholder="Xác nhận mật khẩu"
                                {...register('confirmPass')}
                            />
                            {errors.confirmPass && (
                                <span className={cx('form-message')}>{errors.confirmPass.message}</span>
                            )}
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

export default ChangePass;
