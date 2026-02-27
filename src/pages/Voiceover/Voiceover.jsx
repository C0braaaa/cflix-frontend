import { typeList } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function Voiceover() {
    return <MovieList title="Phim Lồng Tiến" fetchFunction={typeList} type="single" slug="phim-long-tieng" />;
}

export default Voiceover;
