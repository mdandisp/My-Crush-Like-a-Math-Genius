"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { charactersData } from '../../data/mockData';
import ProfileBadge from '../../components/ProfileBadge';

export default function DashboardPage() {
  const [targetGender, setTargetGender] = useState('cewe'); // cewe = Waifu, cowo = Husbu
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Ambil gender pemain dari localStorage (diset saat daftar/login)
    const userGender = localStorage.getItem('userGender');
    
    // Jika pemain perempuan, cari Husbu (cowo). Jika laki-laki, cari Waifu (cewe).
    if (userGender === 'FEMALE') {
      setTargetGender('cowo');
    } else {
      setTargetGender('cewe');
    }
    
    setIsLoaded(true);
  }, []);

  // Hanya tampilkan karakter yang berlawanan gender
  const displayedCharacters = charactersData.filter(c => c.type === targetGender);

  if (!isLoaded) {
    return <main style={{ minHeight: '100vh', backgroundColor: '#0f1015' }}></main>;
  }

  return (
    <main style={{ 
      minHeight: '100vh', 
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      padding: '2rem'
    }}>
      {/* Dark overlay to make UI pop */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 16, 21, 0.4)',
        zIndex: 0
      }}></div>

      {/* Full width absolute header to reach corners */}
      <header style={{ 
        position: 'absolute',
        top: '2rem',
        left: '2rem',
        right: '2rem',
        zIndex: 10,
        display: 'flex', 
        alignItems: 'center' 
      }}>
        {/* Profile Badge */}
        <ProfileBadge name="Pemain 1" level={1} size="medium" />

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Link href="/leaderboard" style={{ 
            color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600',
            backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            padding: '8px 18px', borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s'
          }}>Leaderboard</Link>
          <Link href="/admin" style={{ 
            color: 'white', textDecoration: 'none', fontSize: '0.9rem', fontWeight: '600',
            backgroundColor: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)',
            padding: '8px 18px', borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.2)', transition: 'all 0.2s'
          }}>Admin</Link>
        </div>
      </header>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '1200px', margin: '0 auto', paddingTop: '6rem' }}>
        
        {/* Title */}
        <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
          <h1 className="animate-fade-in" style={{ 
            fontSize: '2.5rem', 
            color: 'white', 
            textShadow: '0 4px 15px rgba(255, 71, 126, 0.5)'
          }}>
            Pilih Karakter
          </h1>
        </div>

        {/* Character Selection */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          gap: '2rem',
          flexWrap: 'wrap'
        }}>
          {displayedCharacters.map((char, index) => (
            <Link href={`/topic/${char.id}`} key={char.id} style={{ textDecoration: 'none' }}>
              <div 
                className="glass-card animate-fade-in char-card-hover" 
                style={{ 
                  animationDelay: `${index * 0.15}s`,
                  width: '280px',
                  height: '400px',
                  position: 'relative',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  cursor: 'pointer'
                }}
              >
                {/* Character Image */}
                <img 
                  src={char.image} 
                  alt={char.name} 
                  className="char-image-hover"
                  style={{ 
                    position: 'absolute',
                    bottom: '0',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    height: '95%',
                    objectFit: 'contain',
                    zIndex: 1
                  }} 
                />
                
                {/* Gradient overlay for text */}
                <div style={{
                  position: 'absolute',
                  bottom: 0, left: 0, right: 0,
                  height: '50%',
                  background: 'linear-gradient(to top, rgba(15, 16, 21, 0.9), transparent)',
                  zIndex: 2
                }}></div>

                {/* Name & Concept */}
                <div style={{ position: 'relative', zIndex: 3, padding: '1.5rem', textAlign: 'center' }}>
                  <h3 style={{ color: 'white', fontSize: '1.5rem', marginBottom: '5px' }}>{char.name}</h3>
                  <span style={{ 
                    backgroundColor: '#ff477e', 
                    color: 'white', 
                    padding: '4px 12px', 
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {char.concept}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </main>
  );
}
