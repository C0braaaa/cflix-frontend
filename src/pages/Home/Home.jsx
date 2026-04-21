import { useEffect, useState, useCallback } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import { Slider, LatestMovie, Topics, ContinueWatching, AddSlide, MostView, Ranking } from './component/index';
import { useAuth } from '../../features/auth/context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { getAllSliderAPI } from '../../services/sliderServices';

const cx = classNames.bind(styles);

function Home() {
    const { user, openModal } = useAuth();
    const [isShowAddSlide, setIsShowAddSlide] = useState(false);
    const [sliderList, setSliderList] = useState([]);
    const [dataToEdit, setDataToEdit] = useState(null);

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

    const handleAddClick = () => {
        setDataToEdit(null);
        setIsShowAddSlide(true);
    };

    const handleEditClick = (item) => {
        setDataToEdit(item);
        setIsShowAddSlide(true);
    };

    return (
        <div className={cx('wrapper')}>
            {user && user?.role === 'admin' && (
                <Tippy content="Thêm Slide" placement="bottom">
                    <div className={cx('add-slide')} onClick={handleAddClick}>
                        <FontAwesomeIcon icon={faPlus} />
                    </div>
                </Tippy>
            )}
            {isShowAddSlide && <AddSlide setShow={setIsShowAddSlide} onSuccess={fetchSlider} dataToEdit={dataToEdit} />}
            <Slider sliders={sliderList} onSuccess={fetchSlider} onEdit={handleEditClick} />
            {/* <Topics /> */}
            {user && <ContinueWatching />}
            <LatestMovie
                slug="phim-le"
                year="2026"
                bg="linear-gradient(90deg, #6ffacf, #ffffff, #6ffacf)"
                title="Phim lẻ mới nhất 2026"
                link="f/phim-le-moi-nhat"
            />
            <MostView title="Top 10 phim lẻ xem nhiều nhất!" type="single" />
            <Ranking />
            <LatestMovie
                slug="phim-bo"
                year="2026"
                bg="linear-gradient(90deg, #ffe082, #ffffff, #ffe082)"
                title="Phim bộ mới nhất 2026"
                link="f/phim-bo-moi-nhat"
            />
            <MostView title="Top 10 phim bộ xem nhiều nhất!" type="series" />
            <LatestMovie
                slug="hoat-hinh"
                year="2025"
                bg="linear-gradient(90deg, #ff9ad5, #7ad9ff, #ff9ad5)"
                title="Phim hoạt hình mới nhất 2026"
                link="f/hoat-hinh-moi-nhat"
            />
            <MostView title="Top 10 phim hoạt hình xem nhiều nhất!" type="hoathinh" />
        </div>
    );
}

export default Home;
