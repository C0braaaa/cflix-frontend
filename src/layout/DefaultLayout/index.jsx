// import React from 'react';
// import classNames from 'classnames/bind';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faTools, faExclamationTriangle, faEnvelope, faFilm } from '@fortawesome/free-solid-svg-icons';
// import styles from './DefaultLayout.module.scss';

// const cx = classNames.bind(styles);

// === GIAO DIỆN BẢO TRÌ ===
// function DefaultLayout() {
//     return (
//         <div className={cx('wrapper-maintenance')}>
//             <div className={cx('maintenance-container')}>
//                 <div className={cx('brand')}>
//                     <FontAwesomeIcon icon={faFilm} className={cx('brand-icon')} />
//                     <span>CFlix</span>
//                 </div>

//                 <div className={cx('icon-wrapper')}>
//                     <FontAwesomeIcon icon={faTools} className={cx('icon-tools')} />
//                 </div>
//                 <h1 className={cx('title')}>Trang Web Ngừng Hoạt Động</h1>
//                 <p className={cx('message')}>
//                     CFlix hiện đang tạm ngưng hoạt động do một số yếu tố liên quan đến chính sách và định hướng phát
//                     triển. Chúng tôi đang tiến hành rà soát và điều chỉnh để đảm bảo phù hợp với các yêu cầu cần thiết
//                     trong thời gian tới.
//                 </p>
//                 <div className={cx('info-box')}>
//                     <div className={cx('info-item')}>
//                         <FontAwesomeIcon icon={faExclamationTriangle} className={cx('info-icon')} />
//                         <span>Thời gian dự kiến: Vô thời hạn</span>
//                     </div>
//                     {/* <div className={cx('info-item')}>
//                         <FontAwesomeIcon icon={faEnvelope} className={cx('info-icon')} />
//                         <span>Liên hệ: support@cflix.com</span>
//                     </div> */}
//                 </div>

//                 <div className={cx('progress-bar')}>
//                     <div className={cx('progress')}></div>
//                 </div>
//             </div>

//             {/* Background Animations */}
//             <div className={cx('background-elements')}>
//                 <div className={cx('circle', 'circle-1')}></div>
//                 <div className={cx('circle', 'circle-2')}></div>
//                 <div className={cx('circle', 'circle-3')}></div>
//             </div>
//         </div>
//     );
// }

// export default DefaultLayout;

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import styles from './DefaultLayout.module.scss';
import Header from '../components/Header/Header';
import MobileHeader from '../components/MobileHeader/MobileHeader';
import Footer from '../components/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/Button/index-button';
import ChatBot from '../../components/ChatBot/ChatBot';
import ReportModal from '../../components/ReportModal/ReportModal';
import { useReportModal } from '../../features/report/context/ReportModalContext';
import { useAuth } from '../../features/auth/context/AuthContext';

const cx = classNames.bind(styles);

function DefaultLayout({ children }) {
    const [moveTop, setMoveTop] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 1350);
    const [showChatBot, setShowChatBot] = useState(false);
    const { isReportModalOpen, closeReportModal, reportTarget } = useReportModal();
    const { user } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 1350);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setMoveTop(true);
            } else {
                setMoveTop(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleMoveTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className={cx('wrapper')}>
            {isMobile ? <MobileHeader /> : <Header />}
            <div className={cx('container')}>{children}</div>
            <Footer />
            {moveTop && (
                <div className={cx('move-top')} onClick={handleMoveTop}>
                    <Button square leftIcon={<FontAwesomeIcon icon={faArrowUp} className={cx('icon')} />}></Button>
                </div>
            )}

            {/* <Tippy content={`Hello, ${user?.username || "I'm Jarvis"}`}>
                <div className={cx('chatbot')} onClick={() => setShowChatBot((prev) => !prev)}>
                    <img src="/assets/images/chatbot_logo.png" alt="chatbot-logo" />
                </div>
            </Tippy>
            {showChatBot && (
                <div className={cx('chatbox')}>
                    <ChatBot showChatbox={setShowChatBot} />
                </div>
            )} */}
            {isReportModalOpen && (
                <div className={cx('report-modal')}>
                    <div className={cx('overlay')} onClick={closeReportModal}></div>
                    <div className={cx('modal')}>
                        <ReportModal isClose={closeReportModal} reportTarget={reportTarget} />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DefaultLayout;
