import classNames from 'classnames/bind';

import styles from './Movies.module.scss';

const cx = classNames.bind(styles);

function Movies() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('heading')}>
                <h3>Danh sách phim</h3>
                <h4>
                    Tổng số lượng phim <span>26386</span>
                </h4>
            </div>
            <div className={cx('content')}>
                <table cellPadding={0} cellSpacing={0} className={cx('table')}>
                    <thead className={cx('thead')}>
                        <tr>
                            <th>TÊN</th>
                            <th>NĂM</th>
                            <th>TÌNH TRẠNG</th>
                            <th>ĐỊNH DẠNG</th>
                            <th>QUỐC GIA</th>
                            <th>NGÀY CẬP NHẬT</th>
                        </tr>
                    </thead>
                    <tbody className={cx('tbody')}>
                        <tr>
                            <td>
                                <div className={cx('poster')}>
                                    <img
                                        src="https://phimapi.com/image.php?url=https://phimimg.com/upload/vod/20260218-1/4aec5178300ef5a8de3179f249b72b74.jpg"
                                        alt="poster"
                                    />
                                </div>
                                <div className={cx('name')}>
                                    <p>Tội ác vô hình (công lý mù)</p>
                                    <p>(Blind)</p>
                                </div>
                            </td>
                            <td>2026</td>
                            <td>Hoàn tất(16/16)</td>
                            <td>Phim bộ</td>
                            <td>Hàn Quốc</td>
                            <td>2026-02-18 08:16:51</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Movies;
