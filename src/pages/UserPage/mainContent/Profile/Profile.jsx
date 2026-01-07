import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { toast } from 'react-toastify';
import axios from 'axios';

import styles from './Profile.module.scss';
import Button from '../../../../components/Button/index-button';
import { useAuth } from '../../../../features/auth/context/AuthContext';
// Đảm bảo bạn import đúng đường dẫn API update user
import { updateProfileAPI } from '../../../../services/authServices';

const cx = classNames.bind(styles);

// 1. Sửa lại thông báo lỗi tiếng Việt có dấu cho chuẩn
const profileSchema = yup.object().shape({
    username: yup
        .string()
        .required('Vui lòng nhập tên hiển thị')
        .min(6, 'Tên hiển thị phải có ít nhất 6 ký tự')
        .max(50, 'Tên hiển thị không vượt quá 50 ký tự'),
    gender: yup.string().oneOf(['male', 'female', 'unknown'], 'Giới tính không hợp lệ').required(),
});

// Cloudinary
const CLOUD_NAME = import.meta.env.VITE_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_UPLOAD_PRESET;
function Profile() {
    const { openModal, user, updateUserState } = useAuth();

    // State chỉ dùng để lưu file ảnh mới chọn từ máy (để preview)
    const [fileToUpload, setFileToUpload] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        resolver: yupResolver(profileSchema),
        mode: 'onBlur',
        defaultValues: {
            username: '',
            gender: 'unknown',
            email: '', // Email chỉ để hiện, không sửa
        },
    });

    // 2. Logic hiển thị ảnh (Ưu tiên: Ảnh vừa chọn > Ảnh từ DB > Ảnh mặc định)
    const avatarDisplay = previewUrl || user?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

    // 3. Sync dữ liệu từ user vào form khi load trang
    useEffect(() => {
        if (user) {
            reset({
                username: user.username,
                gender: user.gender,
                email: user.email,
            });
        }
    }, [user, reset]);

    // --- HÀM UPLOAD ẢNH LÊN CLOUDINARY ---
    const uploadToCloudinary = async (file) => {
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', UPLOAD_PRESET);
            const response = await axios.post(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, formData);
            return response.data.secure_url;
        } catch (error) {
            console.error('Error uploading file to Cloudinary:', error);
            return null;
        }
    };

    const onSubmit = async (data) => {
        // Nếu không sửa gì và không có file mới -> Dừng (tiết kiệm request)
        if (!isDirty && !fileToUpload) return;

        try {
            let newAvatarUrl = user?.avatar_url; // Mặc định dùng link cũ

            // 1. Nếu có file ảnh mới -> Upload lên Cloud trước
            if (fileToUpload) {
                const toastId = toast.loading('Đang tải ảnh lên máy chủ...'); // Hiện loading

                const uploadedUrl = await uploadToCloudinary(fileToUpload);

                toast.dismiss(toastId); // Tắt loading

                if (uploadedUrl) {
                    newAvatarUrl = uploadedUrl; // Lấy link mới thay thế
                } else {
                    toast.error('Lỗi khi tải ảnh, vui lòng thử lại!');
                    return; // Dừng, không update profile nữa
                }
            }

            // 2. Gọi API Backend (Gửi link ảnh + thông tin text)
            const res = await updateProfileAPI({
                username: data.username,
                gender: data.gender,
                avatar_url: newAvatarUrl,
            });

            if (res && res.user) {
                toast.success('Cập nhật hồ sơ thành công!');
                updateUserState(res.user);

                // Reset lại state file
                setFileToUpload(null);
                setPreviewUrl(null);
            }
        } catch (error) {
            const msg = error.response?.data?.message || 'Lỗi cập nhật!';
            toast.error(msg);
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Lưu file vào state để tý nữa bấm Save mới upload
            setFileToUpload(file);
            // Tạo link tạm (blob) để xem trước ngay lập tức cho mượt
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <p>Tài Khoản</p>
                <span>Cập nhật thông tin tài khoản</span>
            </div>

            <form className={cx('body')} onSubmit={handleSubmit(onSubmit)}>
                <div className={cx('body-content')}>
                    <div className={cx('col-1')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id="email"
                                disabled
                                className={cx('input-disabled')}
                                {...register('email')}
                            />
                        </div>

                        <div className={cx('form-group')}>
                            <label htmlFor="username">Tên hiển thị</label>
                            <input
                                type="text"
                                id="username"
                                className={cx('form-control', { invalid: errors.username })}
                                {...register('username')}
                            />
                            {errors.username && <span className={cx('form-message')}>{errors.username.message}</span>}
                        </div>

                        <div className={cx('label-gender')}>
                            <label>Giới tính</label>
                        </div>
                        <div className={cx('form-group', 'gender')}>
                            {['male', 'female', 'unknown'].map((g) => (
                                <div className={cx('form-check')} key={g}>
                                    <input
                                        type="radio"
                                        id={g}
                                        value={g} // Value gửi lên server
                                        {...register('gender')} // Đăng ký cùng 1 tên 'gender' để tạo nhóm
                                    />
                                    <label htmlFor={g}>{g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'}</label>
                                </div>
                            ))}
                        </div>

                        <div className={cx('btn')}>
                            <div className={cx('btn-update')}>
                                <Button primary large type="submit" disabled={!isDirty && !fileToUpload}>
                                    Cập nhật
                                </Button>
                            </div>
                            <div className={cx('btn-change-pass')}>
                                <Button primary large type="button" onClick={() => openModal('forgot')}>
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div className={cx('col-2')}>
                        <div className={cx('avatar')}>
                            <img src={avatarDisplay} alt="avatar" />
                        </div>
                        <div className={cx('change-avatar')}>
                            <label htmlFor="fileUpload">Đổi avatar</label>
                            <input
                                type="file"
                                id="fileUpload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={handleAvatarChange}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

export default Profile;
