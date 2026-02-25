import { createContext, useContext, useState } from 'react';

const ReportModalContext = createContext();

// eslint-disable-next-line react-refresh/only-export-components
export const useReportModal = () => useContext(ReportModalContext);
export const ReportModalProvider = ({ children }) => {
    const [isReportModalOpen, setIsReportModalOpen] = useState(false);
    const [reportTarget, setReportTarget] = useState(null);
    const openReportModal = (targetData) => {
        setReportTarget(targetData);
        setIsReportModalOpen(true);
    };

    const closeReportModal = () => {
        setIsReportModalOpen(false);
        setReportTarget(null);
    };

    return (
        <ReportModalContext.Provider value={{ isReportModalOpen, reportTarget, openReportModal, closeReportModal }}>
            {children}
        </ReportModalContext.Provider>
    );
};
