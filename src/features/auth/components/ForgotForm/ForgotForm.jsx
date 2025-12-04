import classNames from 'classnames/bind';

import ValidatorForm from '../../../../components/Validator/Validator';
import { useAuth } from '../../context/AuthContext';
import styles from './ForgotForm.module.scss';
import Button from '../../../../components/Button/index-button';
const cx = classNames.bind(styles);

function ForgotForm() {
    const { closeModal, openModal } = useAuth();

    return (
        <>
            <div className={cx('wrapper', 'forgot-modal')}>
                <div className={cx('modal-content')}>
                    <div className={cx('close-modal')} onClick={closeModal}>
                        &times;
                    </div>
                    <div className={cx('forgot-form')}>
                        <h3 className={cx('title')}>Quên mật khẩu</h3>
                        <p className={cx('switch-top-login')}>
                            Bạn đã có tài khoản,{' '}
                            <span className={cx('register')} onClick={() => openModal('login')}>
                                đăng nhập ngay
                            </span>
                        </p>
                        <ValidatorForm name="email" placeholder="Email đăng ký" type="text" rules="required|email" />

                        <div className={cx('btn-forgot')}>
                            <Button primary className={cx('btn')}>
                                Gửi yêu cầu
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotForm;
