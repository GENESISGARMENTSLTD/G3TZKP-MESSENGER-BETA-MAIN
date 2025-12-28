import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import HowItWorks from './pages/HowItWorks';
import FreeTrial from './pages/FreeTrial';
import Pricing from './pages/Pricing';
import Download from './pages/Download';
import Support from './pages/Support';
import G3Rain from './components/G3Rain';
const App = () => {
    return (_jsx(Router, { children: _jsxs("div", { className: "flex flex-col min-h-screen relative overflow-hidden", children: [_jsx(G3Rain, {}), _jsx(Header, {}), _jsx("main", { className: "flex-grow relative z-10", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Home, {}) }), _jsx(Route, { path: "/how-it-works", element: _jsx(HowItWorks, {}) }), _jsx(Route, { path: "/free-trial", element: _jsx(FreeTrial, {}) }), _jsx(Route, { path: "/pricing", element: _jsx(Pricing, {}) }), _jsx(Route, { path: "/download", element: _jsx(Download, {}) }), _jsx(Route, { path: "/support", element: _jsx(Support, {}) })] }) }), _jsx(Footer, {})] }) }));
};
export default App;
