import { useState, useEffect } from 'react';
import { getRecommendationsAPI } from '../services/userServices';
import { detail, type as fetchByGenre, nations as fetchByCountry } from '../services/moviesServices';
import { search as searchMovies } from '../services/searchService';

/**
 * Thuật toán gợi ý nâng cao (Advanced Recommendation Engine)
 *
 * Layer 1: Franchise Detection — Tìm phim cùng series/franchise
 *   VD: Xem "John Wick" → gợi ý "John Wick 2", "John Wick 3", "Ballerina"...
 *
 * Layer 2: Multi-Signal Content-Based Filtering
 *   - Phân tích TẤT CẢ phim đã xem/yêu thích (không chỉ phim gần nhất)
 *   - Tính trọng số cho từng thể loại & quốc gia dựa trên tần suất
 *   - Gợi ý phim khớp nhiều tín hiệu nhất
 *
 * Layer 3: Weighted Scoring & Ranking
 *   - Franchise match: +50 điểm
 *   - Genre match:    +10 điểm/genre * trọng số tần suất
 *   - Country match:  +5 điểm/country * trọng số tần suất
 *   - Phim mới hơn:   +bonus
 */

// Trích xuất keyword chính từ tên phim để tìm franchise
// VD: "Sát Thủ John Wick: Phần 2" → "John Wick"
// VD: "Venom: Kẻ Thù Cuối Cùng" → "Venom"
const extractFranchiseKeyword = (name, originName) => {
    const keywords = [];

    // Ưu tiên origin_name (tên tiếng Anh) vì chính xác hơn
    if (originName) {
        // Loại bỏ phần sau dấu ":" hoặc " - " (thường là subtitle)
        // VD: "John Wick: Chapter 2" → "John Wick"
        let clean = originName.split(':')[0].split(' - ')[0].trim();

        // Loại bỏ số phần/chapter ở cuối
        // VD: "Avengers 2" → "Avengers"
        clean = clean.replace(/\s+(part|chapter|volume|vol|phan|phần)?\s*\d+$/i, '').trim();

        if (clean.length >= 3) {
            keywords.push(clean);
        }
    }

    // Fallback: dùng tên tiếng Việt
    if (name && keywords.length === 0) {
        let clean = name.split(':')[0].split(' - ')[0].trim();
        clean = clean
            .replace(/\s*(phần|tập|chapter|part)\s*\d+$/i, '')
            .replace(/\s+\d+$/, '')
            .trim();
        if (clean.length >= 3) {
            keywords.push(clean);
        }
    }

    return keywords;
};

// Tính trọng số cho genres và countries dựa trên tần suất xuất hiện
const buildWeightedProfile = (movieDetails) => {
    const genreWeights = {}; // { "hanh-dong": { name: "Hành Động", count: 5, weight: 0.5 } }
    const countryWeights = {};
    let totalGenreCount = 0;
    let totalCountryCount = 0;

    movieDetails.forEach((movie) => {
        if (!movie) return;

        const categories = movie?.movie?.category || movie?.category || [];
        const countries = movie?.movie?.country || movie?.country || [];

        categories.forEach((cat) => {
            if (!genreWeights[cat.slug]) {
                genreWeights[cat.slug] = { name: cat.name, slug: cat.slug, count: 0 };
            }
            genreWeights[cat.slug].count++;
            totalGenreCount++;
        });

        countries.forEach((c) => {
            if (!countryWeights[c.slug]) {
                countryWeights[c.slug] = { name: c.name, slug: c.slug, count: 0 };
            }
            countryWeights[c.slug].count++;
            totalCountryCount++;
        });
    });

    // Tính weight (tỷ lệ %) cho mỗi genre/country
    Object.values(genreWeights).forEach((g) => {
        g.weight = totalGenreCount > 0 ? g.count / totalGenreCount : 0;
    });
    Object.values(countryWeights).forEach((c) => {
        c.weight = totalCountryCount > 0 ? c.count / totalCountryCount : 0;
    });

    return { genreWeights, countryWeights };
};

// Tính điểm cho 1 phim ứng viên
const scoreCandidate = (candidate, genreWeights, countryWeights, franchiseSlugs) => {
    let score = 0;
    const reasons = [];

    // Layer 1: Franchise match (+50)
    if (franchiseSlugs.has(candidate.slug)) {
        score += 50;
        reasons.push('franchise');
    }

    // Layer 2: Genre match
    const candidateGenres = candidate.category || [];
    candidateGenres.forEach((cat) => {
        if (genreWeights[cat.slug]) {
            const genreScore = 10 * genreWeights[cat.slug].weight;
            score += genreScore;
            if (!reasons.includes('genre')) reasons.push('genre');
        }
    });

    // Layer 2: Country match
    const candidateCountries = candidate.country || [];
    candidateCountries.forEach((c) => {
        if (countryWeights[c.slug]) {
            const countryScore = 5 * countryWeights[c.slug].weight;
            score += countryScore;
            if (!reasons.includes('country')) reasons.push('country');
        }
    });

    // Bonus: phim mới hơn (+nhỏ)
    const year = candidate.year || 2020;
    const yearBonus = Math.max(0, (year - 2020) * 0.5);
    score += yearBonus;

    return { score, reasons };
};

export const useRecommendations = () => {
    const [sections, setSections] = useState([]); // Multiple recommendation sections
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecommendations = async () => {
            try {
                // ===== STEP 1: Lấy lịch sử xem + yêu thích từ Backend =====
                const res = await getRecommendationsAPI();
                const { slugs, latestMovie } = res.data;

                if (!latestMovie) {
                    setLoading(false);
                    return;
                }

                const watchedSet = new Set(slugs);

                // ===== STEP 2: Lấy chi tiết của top 5 phim gần nhất =====
                // (Để phân tích đa tín hiệu, không chỉ 1 phim)
                const uniqueSlugs = [...new Set(slugs)].slice(0, 5);
                const detailPromises = uniqueSlugs.map((s) =>
                    detail(s).catch(() => null),
                );
                const movieDetails = (await Promise.all(detailPromises)).filter(Boolean);

                if (movieDetails.length === 0) {
                    setLoading(false);
                    return;
                }

                // ===== STEP 3: Build User Taste Profile =====
                const { genreWeights, countryWeights } = buildWeightedProfile(movieDetails);

                // Top genres & countries (sorted by weight)
                const topGenres = Object.values(genreWeights)
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 3);

                const topCountries = Object.values(countryWeights)
                    .sort((a, b) => b.weight - a.weight)
                    .slice(0, 2);

                // ===== STEP 4: LAYER 1 — Franchise/Sequel Detection =====
                const franchiseSection = { title: '', badge: '', items: [], type: 'franchise' };
                const franchiseSlugs = new Set();

                // Lấy keywords từ phim gần nhất
                const latestDetail = movieDetails[0];
                const latestName = latestDetail?.movie?.name || latestMovie.name;
                const latestOriginName = latestDetail?.movie?.origin_name || '';
                const keywords = extractFranchiseKeyword(latestName, latestOriginName);

                if (keywords.length > 0) {
                    try {
                        const searchRes = await searchMovies(keywords[0], 1, 20);
                        const searchItems = searchRes?.items || [];

                        // Lọc bỏ phim đang xem + sắp xếp theo năm
                        const franchiseMovies = searchItems
                            .filter((m) => !watchedSet.has(m.slug))
                            .sort((a, b) => (a.year || 0) - (b.year || 0));

                        if (franchiseMovies.length > 0) {
                            franchiseSection.title = `Cùng series "${keywords[0]}"`;
                            franchiseSection.badge = keywords[0];
                            franchiseSection.items = franchiseMovies.slice(0, 10);
                            franchiseMovies.forEach((m) => franchiseSlugs.add(m.slug));
                        }
                    } catch (err) {
                        console.log('Franchise search failed:', err);
                    }
                }

                // ===== STEP 5: LAYER 2 — Content-Based (Multi-genre) =====
                // Fetch phim từ top 2 genres yêu thích nhất
                const genrePromises = topGenres.slice(0, 2).map((g) =>
                    fetchByGenre(1, 24, g.slug).catch(() => ({ items: [] })),
                );

                // Fetch phim từ top country
                const countryPromises = topCountries.slice(0, 1).map((c) =>
                    fetchByCountry(1, 24, c.slug).catch(() => ({ items: [] })),
                );

                const [genreResults, countryResults] = await Promise.all([
                    Promise.all(genrePromises),
                    Promise.all(countryPromises),
                ]);

                // ===== STEP 6: LAYER 3 — Scoring & Ranking =====
                // Gộp tất cả candidates, loại trùng, tính điểm
                const allCandidates = new Map(); // slug → { movie, score, reasons }

                const addCandidates = (items) => {
                    items.forEach((movie) => {
                        if (watchedSet.has(movie.slug)) return; // Bỏ phim đã xem

                        const { score, reasons } = scoreCandidate(
                            movie,
                            genreWeights,
                            countryWeights,
                            franchiseSlugs,
                        );

                        if (allCandidates.has(movie.slug)) {
                            // Cộng dồn score nếu phim xuất hiện ở nhiều nguồn
                            const existing = allCandidates.get(movie.slug);
                            existing.score += score * 0.5; // Bonus nhưng giảm dần
                            existing.reasons = [...new Set([...existing.reasons, ...reasons])];
                        } else {
                            allCandidates.set(movie.slug, { movie, score, reasons });
                        }
                    });
                };

                genreResults.forEach((r) => addCandidates(r?.items || []));
                countryResults.forEach((r) => addCandidates(r?.items || []));

                // Sort theo score giảm dần
                const ranked = [...allCandidates.values()]
                    .sort((a, b) => b.score - a.score);

                // ===== STEP 7: Build sections cho UI =====
                const finalSections = [];

                // Section 1: Franchise (nếu có)
                if (franchiseSection.items.length > 0) {
                    finalSections.push(franchiseSection);
                }

                // Section 2: "Vì bạn đã xem X" — Top scored movies
                const topRanked = ranked.slice(0, 12).map((r) => r.movie);
                if (topRanked.length > 0) {
                    const topGenreName = topGenres[0]?.name || '';
                    finalSections.push({
                        title: `Vì bạn đã xem "${latestName}"`,
                        badge: topGenreName ? `#${topGenreName}` : '',
                        items: topRanked,
                        type: 'personalized',
                    });
                }

                // Section 3: Genre-specific section (genre phụ nếu có)
                if (topGenres.length > 1) {
                    const secondGenre = topGenres[1];
                    const secondGenreMovies = ranked
                        .filter((r) => {
                            const cats = r.movie.category || [];
                            return cats.some((c) => c.slug === secondGenre.slug);
                        })
                        .slice(0, 12)
                        .map((r) => r.movie);

                    // Chỉ show nếu có ít nhất 4 phim và khác section trên
                    if (secondGenreMovies.length >= 4) {
                        finalSections.push({
                            title: `Phim ${secondGenre.name} dành cho bạn`,
                            badge: `#${secondGenre.name}`,
                            items: secondGenreMovies,
                            type: 'genre',
                        });
                    }
                }

                setSections(finalSections);
            } catch (error) {
                console.log('Recommendation error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, []);

    return { sections, loading };
};
