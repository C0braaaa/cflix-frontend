import config from '../config/index-config';

// Pages
import Home from '../pages/Home/Home';
import Find from '../pages/Find/Find';
import SingleMovie from '../pages/SingleMovie/SingleMovie';
import SeriesMovie from '../pages/SeriesMovie/SeriesMovie';
import Cartoons from '../pages/Cartoons/Cartoons';
import Genres from '../pages/Genres/Genres';
import Nations from '../pages/Nations/Nations';
import DubbedMovie from '../pages/DubbedMovie/DubbedMovie';
import UserPage from '../pages/UserPage/UserPage';
import DashBoard from '../pages/Admin/Admin';
import FullTopics from '../pages/Topics/FullTopics';
import TopicsDetail from '../pages/Topics/TopicsDetail';
import MovieInfo from '../pages/MovieInfo/MovieInfo';
import Wacth from '../pages/Watch/Watch';
import FullLatestMovies from '../pages/FullLatestMovies/FullLatestMovies';
import ForgotPassPage from '../features/auth/components/ForgotPassPage/ForgotPassPage';
import Introduce from '../pages/AboutCflix/Introduce';
import Contact from '../pages/AboutCflix/Contact';
import Voiceover from '../pages/Voiceover/Voiceover';

//erorr page
import NotFound404 from '../pages/ErorrPage/NotFound404';

// public routes
const publicRoutes = [
    { path: config.routes.home, component: Home },
    { path: config.routes.search, component: Find },
    { path: config.routes.singleMovie, component: SingleMovie },
    { path: config.routes.series, component: SeriesMovie },
    { path: config.routes.cartoons, component: Cartoons },
    { path: config.routes.category, component: Genres },
    { path: config.routes.nation, component: Nations },
    { path: config.routes.dubbed, component: DubbedMovie },
    { path: config.routes.voiceover, component: Voiceover },
    { path: config.routes.topics, component: FullTopics },
    { path: config.routes.topicsDetail, component: TopicsDetail },
    { path: config.routes.user, component: UserPage },
    { path: config.routes.movieInfo, component: MovieInfo },
    { path: config.routes.watch, component: Wacth },
    { path: config.routes.watchMore, component: FullLatestMovies },
    { path: config.routes.forgotPass, component: ForgotPassPage, layout: null },
    { path: config.routes.introduction, component: Introduce },
    { path: config.routes.contact, component: Contact },
    // erorr page
    { path: '*', component: NotFound404 },
];

// private routes
const privateRoutes = [{ path: config.routes.admin, component: DashBoard, layout: null, role: ['admin'] }];

export { publicRoutes, privateRoutes };
