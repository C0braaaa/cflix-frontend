import { useState, useEffect } from 'react';
import { getRecommendationsAPI } from '../services/userServices';
import { detail, type as fetchByGenre } from '../services/moviesServices';

export const useRecommendations = () => {
    const [movies, setMovies] = useState([]);
    const [reason, setReason] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // 1. Lấy lịch sử xem từ BE (BE tự lấy userId từ token)
                const res = await getRecommendationsAPI();
                const { slugs, latestMovie } = res.data;

                if (!latestMovie) {
                    setLoading(false);
                    return;
                }

                // 2. Lấy chi tiết phim gần nhất → lấy thể loại
                const movieDetail = await detail(latestMovie.slug);
                const genres = movieDetail?.movie?.category || [];
                const genreSlug = genres[0]?.slug;
                const genreName = genres[0]?.name;

                if (!genreSlug) {
                    setLoading(false);
                    return;
                }

                // 3. Lấy phim cùng thể loại
                const genreRes = await fetchByGenre(1, 20, genreSlug);
                const candidates = genreRes?.items || [];

                // 4. Lọc bỏ phim đã xem
                const watchedSet = new Set(slugs);
                const recommendations = candidates.filter((m) => !watchedSet.has(m.slug)).slice(0, 12);

                setMovies(recommendations);
                setReason({ movieName: latestMovie.name, genreName });
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return { movies, reason, loading };
};
