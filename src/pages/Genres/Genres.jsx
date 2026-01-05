import { useParams } from 'react-router-dom';

import { type as fetchByType } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function Genres() {
    const { slug } = useParams();

    const formatTitle = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const fetchMoviesByGenre = async (page, limit) => {
        return await fetchByType(page, limit, slug);
    };

    return <MovieList title={`Thể loại ${formatTitle(slug)}`} fetchFunction={fetchMoviesByGenre} type={'series'} />;
}

export default Genres;
