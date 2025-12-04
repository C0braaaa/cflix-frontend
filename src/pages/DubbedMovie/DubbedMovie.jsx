import { typeList } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function DubbedMovie() {
    return <MovieList title="Phim Thuyết Minh" fetchFunction={typeList} type="single" slug="phim-thuyet-minh" />;
}

export default DubbedMovie;
