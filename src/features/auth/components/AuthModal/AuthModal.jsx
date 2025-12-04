import classNames from 'classnames/bind';
import styles from './AuthModal.module.scss';

const cx = classNames.bind(styles);

function AuthModal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <div className={cx('overlay')} onClick={onClose}>
            <div className={cx('modal')} onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );
}

export default AuthModal;
