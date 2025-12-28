
import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
  speed?: number;
  fontSize?: number;
  color?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ className, speed = 0.6, fontSize = 16, color = '#00f3ff' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false }); // Optimization: disable alpha for background
    if (!ctx) return;

    // Multivector Mathematical Notations & Pure Unicode Symbols
    const chars = 'φψη_rR₄Ψ𝔾₃₂∧∨⊗∘∇∫∂∑∏√∞αβγδεζηθικλμνξοπρςστυφχψωℛℳ𝒢𝒪∇_φφ⁻¹φ²φ³φ⁴⟨⟩•⋆⁺⁻ℏℂℍℕℙℚℝℤℵℶℷℸ∆∇∈∋∎∏∐∑∓∔∕∖∗∘∙√∛∜∝∟∠∡∢∣∤∥∦∩∪∬∭∮∯∰∱∲∳∴∵∶∷∸∹∺∻∼∽∾∿≀≁≂≃≄≅≆≇≈≉≊≋≌≍≎≏≐≑≒≓≔≕≖≗≘≙≚≛≜≝≞≟≠≡≢≣≤≥≦≧≨≩≪≫≬≭≮≯≰≱≲≳≴≵≶≷≸≹≺≻≼≽≾≿⊀⊁⊂⊃⊄⊅⊆⊇⊈⊉⊊⊋⊌⊍⊎⊏⊐⊑⊒⊓⊔⊕⊖⊗⊘⊙⊚⊛⊜⊝⊞⊟⊠⊡⊢⊣⊤⊥⊦⊧⊨⊩⊪⊫⊬⊭⊮⊯⊰⊱⊲⊳⊴⊵⊶⊷⊸⊹⊺⊻⊼⊽⊾⊿⋀⋁⋂⋃⋄⋅⋆⋇⋈⋉⋊⋋⋌⋍⋎⋏⋐⋑⋒⋓⋔⋕⋖⋗⋘⋙⋚⋛⋜⋝⋞⋟⋠⋡⋢⋣⋤⋥⋦⋧⋨⋩⋩⋪⋫⋬⋭⋮⋯⋰⋱₀₁₂₃₄₅₆₇₈₉⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾';
    const charArray = chars.split('');
    
    let width = 0;
    let height = 0;
    let columns = 0;
    let drops: number[] = [];

    const setup = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      columns = Math.ceil(width / fontSize);
      drops = new Array(columns).fill(0).map(() => Math.random() * (height / fontSize));
    };

    setup();

    let lastTime = 0;
    const fps = 24; // Throttled FPS for better "Matrix" feel and performance
    const interval = 1000 / fps;

    const animate = (timestamp: number) => {
      const delta = timestamp - lastTime;

      if (delta > interval) {
        lastTime = timestamp - (delta % interval);

        // Trail effect with higher contrast background
        ctx.fillStyle = 'rgba(1, 4, 1, 0.15)';
        ctx.fillRect(0, 0, width, height);

        ctx.font = `bold ${fontSize}px 'JetBrains Mono', monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          const char = charArray[Math.floor(Math.random() * charArray.length)];
          const x = i * fontSize;
          const y = drops[i] * fontSize;

          // Shimmer effect
          const isHighLight = Math.random() > 0.96;
          ctx.fillStyle = isHighLight ? '#fff' : color;
          ctx.globalAlpha = isHighLight ? 1.0 : 0.45;

          ctx.fillText(char, x, y);

          // Reset drops
          if (y > height && Math.random() > 0.975) {
            drops[i] = 0;
          }

          drops[i] += speed;
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    let animationFrameId = requestAnimationFrame(animate);

    const handleResize = () => {
      setup();
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [speed, fontSize, color]);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 pointer-events-none z-0 ${className}`}
      style={{ 
        imageRendering: 'pixelated', // Optimization for some browsers
        opacity: 0.6 
      }} 
    />
  );
};

export default MatrixRain;
