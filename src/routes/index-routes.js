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
    { path: config.routes.topics, component: FullTopics },
    { path: config.routes.topicsDetail, component: TopicsDetail },
    { path: config.routes.user, component: UserPage },
    { path: config.routes.admin, component: DashBoard, layout: null },
    { path: config.routes.movieInfo, component: MovieInfo },
    { path: config.routes.watch, component: Wacth },
    { path: config.routes.watchMore, component: FullLatestMovies },
    // erorr page
    { path: '*', component: NotFound404 },
];

// private routes
const privateRoutes = [];

export { publicRoutes, privateRoutes };
