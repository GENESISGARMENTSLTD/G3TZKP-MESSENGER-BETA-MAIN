
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

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative overflow-hidden">
        <G3Rain />
        <Header />
        <main className="flex-grow relative z-10">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/free-trial" element={<FreeTrial />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/download" element={<Download />} />
            <Route path="/support" element={<Support />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
