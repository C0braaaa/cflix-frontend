import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Fragment } from 'react';
import { ToastContainer } from 'react-toastify';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { privateRoutes, publicRoutes } from './routes/index-routes';
import DefaultLayout from './layout/DefaultLayout';
import AuthContainer from './features/auth/AuthContainer';
import SplashScreen from './components/SplashScreen/SplashPage';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import { addTrafficAPI } from './services/trafficService';
import DisclaimerModal from './components/DisclaimerModal/DisclaimerModal';

function App() {
    const [splashScreen, setSplashScreen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSplashScreen(false);
        }, 2500);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const msg = sessionStorage.getItem('notify_after_load');
        if (msg) {
            setTimeout(() => {
                toast.error(msg);
                sessionStorage.removeItem('notify_after_load');
            }, 3000);
        }
    }, []);

    useEffect(() => {
        const addTraffic = async () => {
            try {
                const today = new Date().toLocaleDateString('vi-VN', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                });

                const lastVisitDate = localStorage.getItem('cflix_last_visit');
                if (lastVisitDate !== today) {
                    await addTrafficAPI();
                    localStorage.setItem('cflix_last_visit', today);
                }
            } catch (error) {
                console.log(error);
            }
        };
        addTraffic();
    }, []);

    useEffect(() => {
        // Theo dõi thay đổi của pathname (bằng cách lắng nghe popstate và click link)
        const handleScrollTop = () => {
            window.scrollTo({
                top: 0,
            });
        };

        window.addEventListener('popstate', handleScrollTop); // khi dùng nút back/forward
        document.body.addEventListener('click', (e) => {
            if (e.target.closest('a[href]')) handleScrollTop(); // khi click link
        });

        return () => {
            window.removeEventListener('popstate', handleScrollTop);
        };
    }, []);
    return (
        <Router>
            <div className="App">
                {splashScreen ? (
                    <SplashScreen />
                ) : (
                    <Routes>
                        {publicRoutes.map((route, index) => {
                            const Page = route.component;

                            let Layout = DefaultLayout;

                            if (route.layout) {
                                Layout = route.layout;
                            } else if (route.layout === null) {
                                Layout = Fragment;
                            }
                            return (
                                <Route
                                    key={index}
                                    path={route.path}
                                    element={
                                        <Layout>
                                            <Page />
                                        </Layout>
                                    }
                                />
                            );
                        })}
                        {/* Private routes */}
                        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                            {privateRoutes.map((route, index) => {
                                const Page = route.component;

                                let Layout = DefaultLayout;

                                if (route.layout) {
                                    Layout = route.layout;
                                } else if (route.layout === null) {
                                    Layout = Fragment;
                                }

                                return (
                                    <Route
                                        key={index}
                                        path={route.path}
                                        element={
                                            <Layout>
                                                <Page />
                                            </Layout>
                                        }
                                    />
                                );
                            })}
                        </Route>
                    </Routes>
                )}
                <AuthContainer />
                <ToastContainer
                    toastClassName="glass-toast"
                    position="bottom-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop
                    closeOnClick
                    pauseOnHover
                    theme="dark"
                    zIndex={999999999}
                />
                <DisclaimerModal />
            </div>
        </Router>
    );
}

export default App;
