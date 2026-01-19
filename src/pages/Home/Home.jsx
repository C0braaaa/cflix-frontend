import { useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Home.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';

import { Slider, LatestMovie, Topics, ContinueWatching } from './component/index';
import { useAuth } from '../../features/auth/context/AuthContext';

const cx = classNames.bind(styles);

function Home() {
    const { user, openModal } = useAuth();

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

    return (
        <div className={cx('wrapper')}>
            <Slider />
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
