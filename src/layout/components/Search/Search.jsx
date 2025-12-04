import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classNames from 'classnames/bind';
import HeadlessTippy from '@tippyjs/react/headless';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

import styles from './Search.module.scss';
import * as searchServices from '../../../services/searchService';
import { useDebounce } from '../../../hooks';
import { Wrapper as PopperWrapper } from '../../../components/Popper/index-popper';
import MovieItem from '../../../components/MovieItem/MovieItem';

const cx = classNames.bind(styles);

function Search() {
    const [input, setInput] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // ✅ thêm state loading

    const inputRef = useRef();
    const navigate = useNavigate();
    const debouncedValue = useDebounce(input, 500);

    const handleDeleteText = () => {
        setInput('');
        setSearchResult([]);
        inputRef.current.blur();
        setShowResult(false);
    };

    const handleHideResult = () => setShowResult(false);

    const handleChange = (e) => {
        const searchValue = e.target.value;

        if (!searchValue.startsWith(' ')) {
            setInput(searchValue);
        }
    };

    useEffect(() => {
        if (!debouncedValue.trim()) {
            setSearchResult([]);
            setIsLoading(false);
            return;
        }

        const fetchApi = async () => {
            setIsLoading(true);
            try {
                const result = await searchServices.search(debouncedValue);
                setSearchResult(result.items || []);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchApi();

        return () => {
            setIsLoading(false);
        };
    }, [debouncedValue]);

    return (
        <>
            <div>
                <HeadlessTippy
                    interactive
                    visible={
                        showResult &&
                        (isLoading || searchResult.length > 0 || (debouncedValue.trim() && searchResult.length === 0))
                    }
                    placement="bottom"
                    onClickOutside={handleHideResult}
                    render={(attrs) => (
                        <div className={cx('search-result')} tabIndex="-1" {...attrs}>
                            <PopperWrapper>
                                {isLoading ? (
                                    <div className={cx('loader')}></div>
                                ) : searchResult.length === 0 ? (
                                    <div className={cx('no-result')}>
                                        <h4>Không tìm thấy kết quả nào</h4>
                                    </div>
                                ) : (
                                    <>
                                        <h4 className={cx('search-title')}>Kết quả tìm kiếm</h4>
                                        {searchResult.slice(0, 5).map((movie, index) => (
                                            <MovieItem
                                                key={index}
                                                data={movie}
                                                onClick={() => {
                                                    setShowResult(false);
                                                    setInput('');
                                                    inputRef.current.blur();
                                                }}
                                            />
                                        ))}
                                    </>
                                )}
                            </PopperWrapper>
                        </div>
                    )}
                >
                    <div className={cx('search')}>
                        <div className={cx('search-elements')}>
                            <input
                                ref={inputRef}
                                value={input}
                                className={cx('search-input')}
                                type="text"
                                placeholder="Tìm kiếm phim, diễn viên..."
                                onChange={handleChange}
                                onFocus={() => setShowResult(true)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && input.trim()) {
                                        navigate(`/tim-kiem?q=${encodeURIComponent(input.trim())}`);
                                        setShowResult(false);
                                        setInput('');
                                        inputRef.current.blur();
                                    }
                                }}
                                spellCheck={false}
                            />

                            {!!input && (
                                <div id="remove-text" className={cx('remove-icon')} onClick={handleDeleteText}>
                                    <FontAwesomeIcon icon={faCircleXmark} />
                                </div>
                            )}

                            <div
                                className={cx('search-icon')}
                                onClick={() => {
                                    navigate(`/tim-kiem?q=${encodeURIComponent(input.trim())}`);
                                    setShowResult(false);
                                    setInput('');
                                    inputRef.current.blur();
                                }}
                            >
                                <FontAwesomeIcon icon={faMagnifyingGlass} />
                            </div>
                        </div>
                    </div>
                </HeadlessTippy>
            </div>

            {/* ✅ Overlay click ra ngoài để đóng */}
            {showResult && <div className={cx('overlay')} onClick={handleHideResult}></div>}
        </>
    );
}

export default Search;
