import { typeList } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function Cartoons() {
    return <MovieList title="Phim Hoạt Hình" fetchFunction={typeList} type="cartoon" slug="hoat-hinh" />;
}

export default Cartoons;
