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

            <Tippy content={`Hello, ${user?.username || "I'm Jarvis"}`}>
                <div className={cx('chatbot')} onClick={() => setShowChatBot((prev) => !prev)}>
                    <img src="/assets/images/chatbot_logo.png" alt="chatbot-logo" />
                </div>
            </Tippy>
            {showChatBot && (
                <div className={cx('chatbox')}>
                    <ChatBot showChatbox={setShowChatBot} />
                </div>
            )}
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
