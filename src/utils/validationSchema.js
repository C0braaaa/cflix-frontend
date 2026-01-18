import * as yup from 'yup';

export const commonRules = {
    username: yup
        .string()
        .required('Vui lòng nhập tên hiển thị')
        .min(6, 'Tên hiển thị phải có ít nhất 6 ký tự')
        .max(20, 'Tên hiển thị không vượt quá 20 ký tự'),
    email: yup.string().required('Vui lòng nhập email').email('Email không hợp lệ (ví dụ: abc@gmail.com)'),
    password: yup.string().required('Vui lòng nhập mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    currentPass: yup.string().required('Vui lòng nhập mật khẩu hiện tại').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    newPass: yup.string().required('Vui lòng nhập mật khẩu mới').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    confirmPassword: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('password'), null], 'Mật khẩu xác nhận không khớp'),
    confirmNewPass: yup
        .string()
        .required('Vui lòng xác nhận mật khẩu')
        .oneOf([yup.ref('newPass'), null], 'Mật khẩu xác nhận không khớp'),
};
