import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from '../components/NavBar.jsx';
import Home from '../features/home/pages/Home.jsx';

function AppRouter() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<><NavBar /><Home /></>} />
            </Routes>
        </Router>
    );
}


export default AppRouter;