import { useParams } from 'react-router-dom';

import { nations } from '../../services/moviesServices';
import MovieList from '../../components/MovieList/MovieList';
function Nations() {
    const { slug } = useParams();

    const formatTitle = (slug) => slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

    const fetchMoviesByNation = async (page, limit) => {
        return await nations(page, limit, slug);
    };

    return <MovieList title={`Quốc gia ${formatTitle(slug)}`} fetchFunction={fetchMoviesByNation} type={'series'} />;
}

export default Nations;
