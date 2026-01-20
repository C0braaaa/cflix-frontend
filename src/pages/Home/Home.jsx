import { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { Slider, LatestMovie, Topics, ContinueWatching, AddSlide } from './component/index';
import { useAuth } from '../../features/auth/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAllSliderAPI } from '../../services/sliderServices';

const cx = classNames.bind(styles);

function Home() {
    const { user, openModal } = useAuth();
    const [isShowAddSlide, setIsShowAddSlide] = useState(false);
    const [sliderList, setSliderList] = useState([]);

    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (location.state?.openModal === 'login') {
            if (openModal) {
                openModal('login');
            }

            navigate('/', { replace: true, state: {} });
        }
    }, [location, navigate, openModal]);

    useEffect(() => {
        document.title = 'CFlix - Phim Hay Xem Là Ngất Ngay';
    }, []);

    const fetchSlider = useCallback(async () => {
        try {
            const res = await getAllSliderAPI();
            setSliderList(res);
        } catch (error) {
            console.log(error);
        }
    }, []);

    useEffect(() => {
        const run = async () => {
            await fetchSlider();
        };
        run();
    }, [fetchSlider]);

    return (
        <div className={cx('wrapper')}>
            {user && user?.role === 'admin' && (
                <Tippy content="Thêm Slide" placement="bottom">
                    <div className={cx('add-slide')} onClick={() => setIsShowAddSlide((prev) => !prev)}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </Tippy>
            )}
            {isShowAddSlide && <AddSlide setShow={setIsShowAddSlide} onSuccess={fetchSlider} />}
            <Slider sliders={sliderList} />
            <Topics />
            {user && <ContinueWatching />}
            <LatestMovie
                slug="phim-le"
                year="2025"
                bg="linear-gradient(90deg, #6ffacf, #ffffff, #6ffacf)"
                title="Phim lẻ mới nhất 2025"
                link="f/phim-le-moi-nhat"
            />
            <LatestMovie
                slug="phim-bo"
                year="2025"
                bg="linear-gradient(90deg, #ffe082, #ffffff, #ffe082)"
                title="Phim bộ mới nhất 2025"
                link="f/phim-bo-moi-nhat"
            />
        </div>
    );
}

export default Home;
