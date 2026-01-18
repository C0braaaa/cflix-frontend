import { forwardRef } from 'react';
import classNames from 'classnames/bind';

import styles from './InputField.module.scss';

const cx = classNames.bind(styles);

const InputField = forwardRef(({ label, error, className, rightIcon, onRightIconClick, ...props }, ref) => {
    return (
        <div className={cx('form-group', className)}>
            {label && <label className={cx('form-label')}>{label}</label>}

            <div className={cx('input-wrapper')}>
                <input ref={ref} className={cx('form-control', { invalid: !!error })} {...props} />
                {rightIcon && (
                    <span className={cx('eye-icon')} onClick={onRightIconClick}>
                        {rightIcon}
                    </span>
                )}
            </div>

            {error && <span className={cx('form-message')}>{error.message}</span>}
        </div>
    );
});

export default InputField;
