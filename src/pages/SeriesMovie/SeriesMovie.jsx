import { typeList } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function SeriesMovie() {
    return <MovieList title="Phim Bộ" fetchFunction={typeList} type="series" slug="phim-bo" />;
}

export default SeriesMovie;
