// src/components/Player/Player.jsx
import { useEffect, useRef } from 'react';
import Artplayer from 'artplayer';
import Hls from 'hls.js';
import classNames from 'classnames/bind';
import { saveProgressAPI } from '../../services/userServices';
import { increaseViewAPI } from '../../services/viewsService';
import { useAuth } from '../../features/auth/context/AuthContext';

import styles from './Player.module.scss';

const cx = classNames.bind(styles);

export default function Player({ option, style, getInstance, movieData }) {
    const artRef = useRef();
    const { user } = useAuth();
    const saveTimeout = useRef(null);
    const dataRef = useRef({ user, movieData });

    const hasCountedView = useRef(false);

    // Check Mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    useEffect(() => {
        dataRef.current = { user, movieData };
    }, [user, movieData]);

    useEffect(() => {
        hasCountedView.current = false;
        const art = new Artplayer({
            ...option,
            container: artRef.current,
            url: option.url,
            customType: {
                m3u8: function (video, url, art) {
                    if (Hls.isSupported()) {
                        const hls = new Hls();
                        hls.loadSource(url);
                        hls.attachMedia(video);
                        art.hls = hls;
                        art.on('destroy', () => hls.destroy());
                    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                        video.src = url;
                    } else {
                        art.notice.show = 'Trình duyệt không hỗ trợ HLS';
                    }
                },
            },

            // --- CẤU HÌNH GIAO DIỆN ---
            volume: 1,
            isLive: false,
            muted: false,
            // autoplay: true,
            autoSize: true,
            theme: '#ff0000',
            autoOrientation: true,
            setting: true,
            flip: true,
            playbackRate: true,
            aspectRatio: true,
            // subtitleOffset: true,
            screenshot: true,
            pip: true,
            fullscreen: true,
            miniProgressBar: false,
            playsInline: true,
            autoPlayback: true,
            airplay: true,
            controls: [
                {
                    name: 'fast-backward',
                    position: 'left',
                    index: 10,
                    html: `
                        <div class="custom-control">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M88 256L232 256C241.7 256 250.5 250.2 254.2 241.2C257.9 232.2 255.9 221.9 249 215L202.3 168.3C277.6 109.7 386.6 115 455.8 184.2C530.8 259.2 530.8 380.7 455.8 455.7C380.8 530.7 259.3 530.7 184.3 455.7C174.1 445.5 165.3 434.4 157.9 422.7C148.4 407.8 128.6 403.4 113.7 412.9C98.8 422.4 94.4 442.2 103.9 457.1C113.7 472.7 125.4 487.5 139 501C239 601 401 601 501 501C601 401 601 239 501 139C406.8 44.7 257.3 39.3 156.7 122.8L105 71C98.1 64.2 87.8 62.1 78.8 65.8C69.8 69.5 64 78.3 64 88L64 232C64 245.3 74.7 256 88 256z"/></svg>
                            <span>10</span>
                        </div>
                    `,
                    tooltip: 'Lùi 10s',
                    click: function () {
                        this.seek = this.currentTime - 10;
                    },
                },
                {
                    name: 'fast-forward',
                    position: 'left',
                    index: 11,
                    html: `
                        <div class="custom-control">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" width="20" height="20"><!--!Font Awesome Free v7.1.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2026 Fonticons, Inc.--><path d="M552 256L408 256C398.3 256 389.5 250.2 385.8 241.2C382.1 232.2 384.1 221.9 391 215L437.7 168.3C362.4 109.7 253.4 115 184.2 184.2C109.2 259.2 109.2 380.7 184.2 455.7C259.2 530.7 380.7 530.7 455.7 455.7C463.9 447.5 471.2 438.8 477.6 429.6C487.7 415.1 507.7 411.6 522.2 421.7C536.7 431.8 540.2 451.8 530.1 466.3C521.6 478.5 511.9 490.1 501 501C401 601 238.9 601 139 501C39.1 401 39 239 139 139C233.3 44.7 382.7 39.4 483.3 122.8L535 71C541.9 64.1 552.2 62.1 561.2 65.8C570.2 69.5 576 78.3 576 88L576 232C576 245.3 565.3 256 552 256z"/></svg>
                            <span>10</span>
                        </div>
                    `,
                    tooltip: 'Tua 10s',
                    click: function () {
                        this.seek = this.currentTime + 10;
                    },
                },
            ],
            moreVideoAttr: {
                crossOrigin: 'anonymous',
            },
        });

        // --- Logic Lưu tiến trình (Giữ nguyên) ---
        const handleSave = async (time) => {
            const currentMovieData = dataRef.current.movieData;
            if (!currentMovieData?.slug) return;
            try {
                saveProgressAPI({
                    slug: currentMovieData.slug,
                    name: currentMovieData.name,
                    origin_name: currentMovieData.origin_name,
                    poster_url: currentMovieData.poster_url,
                    episode_slug: currentMovieData.episode_slug,
                    episode_name: currentMovieData.episode_name,
                    current_time: time,
                    duration: art.duration,
                });
            } catch (error) {
                console.error(error);
            }
        };

        art.on('video:timeupdate', () => {
            const currentTime = art.currentTime;
            const currentUser = dataRef.current.user;
            if (!saveTimeout.current && currentUser && currentTime > 5) {
                saveTimeout.current = setTimeout(() => {
                    handleSave(currentTime);
                    saveTimeout.current = null;
                }, 15000);
            }

            // logic incease view
            if (currentTime > 30 && !hasCountedView.current) {
                const { slug, type, name, origin_name, poster_url } = dataRef.current.movieData || {};

                if (slug) {
                    const sessionKey = `view_${slug}`;
                    if (!sessionStorage.getItem(sessionKey)) {
                        increaseViewAPI({ slug, type, name, origin_name, poster_url })
                            .then(() => {
                                sessionStorage.setItem(sessionKey, 'true');
                            })
                            .catch((err) => console.error('Error: ', err));
                    }
                    hasCountedView.current = true;
                }
            }
        });

        art.on('pause', () => {
            const currentUser = dataRef.current.user;
            if (currentUser && art.currentTime > 5) {
                handleSave(art.currentTime);
            }
        });

        art.on('ready', () => {
            if (option.seekTime && option.seekTime > 0) {
                art.seek = option.seekTime;
                art.notice.show = `Đã phát tiếp từ ${formatTime(option.seekTime)}`;
            }
        });

        if (getInstance && typeof getInstance === 'function') {
            getInstance(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [option.url]);

    return <div ref={artRef} className={cx('wrapper', { mobile: isMobile })} style={style}></div>;
}

function formatTime(seconds) {
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds();
    if (hh) return `${hh}:${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    return `${mm}:${String(ss).padStart(2, '0')}`;
}
