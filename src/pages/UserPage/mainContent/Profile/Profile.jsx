import { useState } from 'react';
import classNames from 'classnames/bind';

import styles from './Profile.module.scss';
import Button from '../../../../components/Button/index-button';
import { useAuth } from '../../../../features/auth/context/AuthContext';

const cx = classNames.bind(styles);

function Profile() {
    const { openModal } = useAuth();
    const [gender, setGender] = useState('other');
    const [avatar, setAvatar] = useState(
        '//assets.manutd.com/AssetPicker/images/0/0/22/86/1464036/8_Bruno_Fernandes1751376440402.webp',
    );

    const handleGenderChange = (e) => {
        setGender(e.target.value);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <p>Tài Khoản</p>
                <span>Cập nhật thông tin tài khoản</span>
            </div>
            <div className={cx('body')}>
                <div className={cx('body-content')}>
                    <div className={cx('col-1')}>
                        <div className={cx('form-group')}>
                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                name="email"
                                id="email"
                                defaultValue="cobragaming0fo@gmail.com"
                                disabled
                            />
                        </div>
                        <div className={cx('form-group')}>
                            <label htmlFor="name">Tên hiển thị</label>
                            <input type="text" name="name" id="name" defaultValue="C0bra" />
                        </div>
                        <div className={cx('label-gender')}>
                            <label>Giới tính</label>
                        </div>
                        <div className={cx('form-group', 'gender')}>
                            <div className={cx('form-check')}>
                                <input
                                    type="radio"
                                    name="male"
                                    id="male"
                                    value="male"
                                    checked={gender === 'male'}
                                    onChange={handleGenderChange}
                                />
                                <label htmlFor="male">Nam</label>
                            </div>
                            <div className={cx('form-check')}>
                                <input
                                    type="radio"
                                    name="female"
                                    id="female"
                                    value="female"
                                    checked={gender === 'female'}
                                    onChange={handleGenderChange}
                                />
                                <label htmlFor="female">Nữ</label>
                            </div>
                            <div className={cx('form-check')}>
                                <input
                                    type="radio"
                                    name="other"
                                    id="other"
                                    value="other"
                                    checked={gender === 'other'}
                                    onChange={handleGenderChange}
                                />
                                <label htmlFor="other">Không xác định</label>
                            </div>
                        </div>
                        <div className={cx('btn')}>
                            <div className={cx('btn-update')}>
                                <Button primary large>
                                    Cập nhật
                                </Button>
                            </div>
                            <div className={cx('btn-change-pass')}>
                                <Button primary large onClick={() => openModal('forgot')}>
                                    Đổi mật khẩu
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className={cx('col-2')}>
                        <div className={cx('avatar')}>
                            <img src={avatar} alt="logo" />
                        </div>
                        <div className={cx('change-avatar')}>
                            <label htmlFor="fileUpload">Đổi avatar</label>
                            <input
                                type="file"
                                id="fileUpload"
                                accept="image/*"
                                style={{ display: 'none' }}
                                onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
