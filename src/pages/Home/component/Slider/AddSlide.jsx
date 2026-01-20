import classNames from 'classnames/bind';
import { useState } from 'react';
import { toast } from 'react-toastify';

import styles from './AddSlide.module.scss';
import Button from '../../../../components/Button/index-button';
import { createNewSliderAPI, updateSliderAPI } from '../../../../services/sliderServices';

const cx = classNames.bind(styles);

function AddSlide({ setShow, onSuccess, dataToEdit }) {
    const [formData, setFormData] = useState({
        name: dataToEdit?.name || '',
        origin_name: dataToEdit?.origin_name || '',
        slug: dataToEdit?.slug || '',
        imdb: dataToEdit?.imdb || '',
        quality: dataToEdit?.quality || '',
        tag_model: dataToEdit?.tag_model || '',
        content: dataToEdit?.content || '',
        thumb_url: dataToEdit?.thumb_url || '',
        poster_url: dataToEdit?.poster_url || '',
        to_info_page: dataToEdit?.to_info_page || '',
        to_watch_page: dataToEdit?.to_watch_page || '',
        tag_classic: dataToEdit?.tag_classic || [],
        types: dataToEdit?.types || [],
    });

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleKeyDown = (e, field) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Chặn submit form
            const value = e.target.value.trim();
            if (!value) return;

            if (!formData[field].includes(value)) {
                setFormData((prev) => ({
                    ...prev,
                    [field]: [...prev[field], value],
                }));
            }
            e.target.value = '';
        }
    };

    const removeTag = (field, indexToRemove) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, index) => index !== indexToRemove),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let res;

            if (dataToEdit) {
                res = await updateSliderAPI(dataToEdit._id, formData);
            } else {
                res = await createNewSliderAPI(formData);
            }

            if (res) {
                toast.success(dataToEdit ? 'Cập nhật slide thành công!' : 'Thêm slide thành công!');

                setFormData({
                    name: '',
                    origin_name: '',
                    slug: '',
                    imdb: '',
                    quality: '',
                    tag_model: '',
                    content: '',
                    thumb_url: '',
                    poster_url: '',
                    to_info_page: '',
                    to_watch_page: '',
                    tag_classic: [],
                    types: [],
                });

                setShow(false);

                if (onSuccess) onSuccess();
            }
        } catch (error) {
            console.log(error);
            toast.error('Thêm slide thất bại!');
        }
    };

    return (
        <>
            <div className={cx('overlay')} onClick={() => setShow(false)}></div>
            <div className={cx('add-form')}>
                <span className={cx('close')} onClick={() => setShow(false)}>
                    &times;
                </span>
                <h5 className={cx('form-title')}>{dataToEdit ? 'Cập nhật Slide' : 'Thêm Slide'}</h5>

                <form className={cx('form-control')} onSubmit={handleSubmit}>
                    <div className={cx('form-group')}>
                        <label htmlFor="name">Tên phim</label>
                        <input
                            type="text"
                            id="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Tên phim"
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="origin-name">Tên tiếng anh</label>
                        <input
                            type="text"
                            id="origin_name"
                            value={formData.origin_name}
                            onChange={handleChange}
                            placeholder="Tên tiếng anh"
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="slug">Slug</label>
                        <input
                            type="text"
                            id="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="slug-phim-ví-du"
                        />
                    </div>
                    <div className={cx('form-group')} style={{ flex: 1 }}>
                        <label htmlFor="imdb">Điểm IMDb</label>
                        <input
                            type="text"
                            id="imdb"
                            value={formData.imdb}
                            onChange={handleChange}
                            placeholder="Ví dụ: 9.0"
                        />
                    </div>
                    <div className={cx('form-group')} style={{ flex: 1 }}>
                        <label htmlFor="quality">Chất lượng</label>
                        <input
                            type="text"
                            id="quality"
                            value={formData.quality}
                            onChange={handleChange}
                            placeholder="Ví dụ: FHD"
                        />
                    </div>
                    <div className={cx('form-group')} style={{ flex: 1 }}>
                        <label htmlFor="tag_model">Độ tuổi</label>
                        <input
                            type="text"
                            id="tag_model"
                            value={formData.tag_model}
                            onChange={handleChange}
                            placeholder="Ví dụ: T16"
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label>Thông tin thêm (Năm, Thời lượng...)</label>
                        <div className={cx('tag-container')}>
                            {formData.tag_classic.map((tag, index) => (
                                <div key={index} className={cx('tag-item')}>
                                    {tag}
                                    <span className={cx('remove-tag')} onClick={() => removeTag('tag_classic', index)}>
                                        &times;
                                    </span>
                                </div>
                            ))}
                            <input
                                type="text"
                                placeholder="Nhập xong ấn Enter (VD: 2025)"
                                onKeyDown={(e) => handleKeyDown(e, 'tag_classic')}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label>Thể loại</label>
                        <div className={cx('tag-container')}>
                            {formData.types.map((tag, index) => (
                                <div key={index} className={cx('tag-item')}>
                                    {tag}
                                    <span className={cx('remove-tag')} onClick={() => removeTag('types', index)}>
                                        &times;
                                    </span>
                                </div>
                            ))}
                            <input
                                type="text"
                                placeholder="Nhập xong ấn Enter (VD: Hành Động)"
                                onKeyDown={(e) => handleKeyDown(e, 'types')}
                            />
                        </div>
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="content">Nội dung phim</label>
                        <textarea
                            id="content"
                            rows={2}
                            value={formData.content}
                            onChange={handleChange}
                            placeholder="Nội dung phim..."
                        />
                    </div>

                    <div className={cx('form-group')}>
                        <label htmlFor="thumb_url">Link Thumbnail (Ảnh nền to)</label>
                        <input
                            type="text"
                            id="thumb_url"
                            value={formData.thumb_url}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="poster_url">Link Poster (Ảnh nhỏ)</label>
                        <input
                            type="text"
                            id="poster_url"
                            value={formData.poster_url}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="to_info_page">Link trang thông tin</label>
                        <input
                            type="text"
                            id="to_info_page"
                            value={formData.to_info_page}
                            onChange={handleChange}
                            placeholder="/phim/..."
                        />
                    </div>
                    <div className={cx('form-group')}>
                        <label htmlFor="to_watch_page">Link trang xem phim</label>
                        <input
                            type="text"
                            id="to_watch_page"
                            value={formData.to_watch_page}
                            onChange={handleChange}
                            placeholder="/xem-phim/..."
                        />
                    </div>

                    <Button primary className={cx('add-btn')} type="submit">
                        {dataToEdit ? 'Lưu thay đổi' : 'Thêm'}
                    </Button>
                </form>
            </div>
        </>
    );
}

export default AddSlide;
