// src/components/Input/PasswordInput.jsx
import { useState, forwardRef } from 'react';
import InputField from './InputField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PasswordInput = forwardRef((props, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <InputField
            ref={ref}
            type={showPassword ? 'text' : 'password'}
            rightIcon={<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />}
            onRightIconClick={togglePassword}
            {...props}
        />
    );
});

export default PasswordInput;
