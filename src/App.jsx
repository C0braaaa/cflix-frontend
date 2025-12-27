import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { publicRoutes } from './routes/index-routes';
import DefaultLayout from './layout/DefaultLayout';
import { Fragment } from 'react';
import AuthContainer from './features/auth/AuthContainer';
import SplashScreen from './components/SplashScreen/SplashPage';
function App() {
    const [splashScreen, setSplashScreen] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSplashScreen(false);
        }, 2500);
        return () => clearTimeout(timer);
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
                    </Routes>
                )}
                <AuthContainer />
            </div>
        </Router>
    );
}

export default App;
