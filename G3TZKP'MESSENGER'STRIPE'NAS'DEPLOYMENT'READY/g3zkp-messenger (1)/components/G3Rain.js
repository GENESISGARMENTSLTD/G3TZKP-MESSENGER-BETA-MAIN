import { jsx as _jsx } from "react/jsx-runtime";
import React, { useEffect, useRef } from 'react';
const G3Rain = ({ className, speed = 0.25, fontSize = 14 }) => {
    const canvasRef = useRef(null);
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas)
            return;
        const ctx = canvas.getContext('2d', { alpha: false });
        if (!ctx)
            return;
        // G3ZKP Protocol Symbols & Mathematical Isomorphs
        const symbols = 'G3ZKP_Φ_∇_∑_⊗_∘_Ψ_λ_ℏ_ℝ_ℂ_ℍ_∇×Φ_∂_∫_∞_ℵ_ℶ_∆_∎_∐_∓_√_∝_∠_∩_∪_⊕_⊖_⊘_⊙_⊚_⊛_⊜_⊝_⊞_⊟_⊠_⊡_⊢_⊣_⊤_⊥_⊦_⊧_⊨_⊩_⊪_⊫_⊬_⊭_⊮_⊯_⊰_⊱_⊲_⊳_⊴_⊵_⊶_⊷_⊸_⊹_⊺_⊻_⊼_⊽_⊾_⊿_⋀_⋁_⋂_⋃_⋄_⋅_⋆_⋇_⋈_⋉_⋊_⋋_⋌_⋍_⋎_⋏_⋐_⋑_⋒_⋓_⋔_⋕_⋖_⋗_⋘_⋙_⋚_⋛_⋜_⋝_⋞_⋟_⋠_⋡_⋢_⋣_⋤_⋥_⋦_⋧_⋨_⋩';
        const charArray = symbols.split('_');
        let width = 0;
        let height = 0;
        let columns = 0;
        let drops = [];
        const setup = () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
            columns = Math.ceil(width / (fontSize * 0.8)); // Tighter columns for isomorphic density
            drops = new Array(columns).fill(0).map(() => Math.random() * (height / fontSize) * -1);
        };
        setup();
        let animationFrameId;
        const render = () => {
            // 60FPS Native Rendering
            // Semi-transparent background for trails
            ctx.fillStyle = 'rgba(1, 4, 1, 0.12)';
            ctx.fillRect(0, 0, width, height);
            ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;
            for (let i = 0; i < drops.length; i++) {
                // Deterministic but complex symbol picking
                const char = charArray[(Math.floor(drops[i] * 10) + i) % charArray.length];
                const x = i * (fontSize * 0.8);
                const y = drops[i] * fontSize;
                // Visual Shimmer & Depth Logic
                const depth = (i % 3) + 1; // 3 levels of simulated Z-depth
                const isHighlight = Math.random() > 0.992;
                if (isHighlight) {
                    ctx.fillStyle = '#fff';
                    ctx.shadowBlur = 10;
                    ctx.shadowColor = '#00f3ff';
                }
                else {
                    // Alternative between primary blue and secondary green
                    ctx.fillStyle = i % 7 === 0 ? '#00CC88' : '#00f3ff';
                    ctx.shadowBlur = 0;
                    ctx.globalAlpha = 1 / depth; // Further back = fainter
                }
                ctx.fillText(char, x, y);
                ctx.globalAlpha = 1.0;
                // Physics increment
                drops[i] += speed * (2 / depth); // Nearer drops move faster
                // Infinite loop with random reset delay
                if (y > height && Math.random() > 0.975) {
                    drops[i] = -5;
                }
            }
            animationFrameId = requestAnimationFrame(render);
        };
        render();
        const handleResize = () => {
            setup();
        };
        window.addEventListener('resize', handleResize);
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', handleResize);
        };
    }, [speed, fontSize]);
    return (_jsx("canvas", { ref: canvasRef, className: `fixed inset-0 pointer-events-none z-0 ${className}`, style: {
            imageRendering: 'auto',
            opacity: 0.5
        } }));
};
export default G3Rain;
