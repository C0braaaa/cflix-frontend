import { typeList } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function SingleMovie() {
    return <MovieList title="Phim Lẻ" fetchFunction={typeList} type="single" slug="phim-le" />;
}

export default SingleMovie;
