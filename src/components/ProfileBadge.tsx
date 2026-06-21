"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { fetchApi } from '../utils/api';

interface ProfileBadgeProps {
  name?: string;
  level?: number;
  size?: 'small' | 'medium';
  style?: React.CSSProperties;
  className?: string;
}

export default function ProfileBadge({ name = "Pemain 1", level, size = 'medium', style, className }: ProfileBadgeProps) {
  const isSmall = size === 'small';
  const [displayName, setDisplayName] = useState(name);
  const [avatarUrl, setAvatarUrl] = useState('/char-mc.png');

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetchApi('/api/v1/users/me');
        if (res.data) {
          const user = res.data;
          if (user.username) {
            setDisplayName(user.username);
            localStorage.setItem('userName', user.username); // Cache for immediate load
          }
          if (user.profile_picture_url) {
            setAvatarUrl(user.profile_picture_url);
            localStorage.setItem('userAvatar', user.profile_picture_url);
          } else {
            setAvatarUrl('/char-mc.png');
            localStorage.removeItem('userAvatar');
          }
        }
      } catch (err) {
        // Fallback to local storage if API fails
      }
    };
    
    // First load from cache for fast UI
    const savedName = localStorage.getItem('userName');
    if (savedName) setDisplayName(savedName);
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) setAvatarUrl(savedAvatar);

    // Then fetch fresh data from API
    loadProfile();
  }, []);

  return (
    <Link href="/profile" style={{ textDecoration: 'none', display: 'inline-block', ...style }} className={className}>
      <div
        className="profile-badge-hover"
        style={{
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(10px)',
          padding: isSmall ? '8px 16px 8px 8px' : '10px 20px 10px 10px',
          borderRadius: '50px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.transform = 'scale(1.08) translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 71, 126, 0.3)';
          e.currentTarget.style.borderColor = 'rgba(255, 71, 126, 0.5)';
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.transform = 'scale(1) translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
        }}
      >
        <div style={{
          width: isSmall ? '40px' : '50px',
          height: isSmall ? '40px' : '50px',
          borderRadius: '50%',
          backgroundColor: '#ccc',
          backgroundImage: `url("${avatarUrl}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginRight: isSmall ? '12px' : '15px'
        }}></div>
        <div>
          <h3 style={{ fontSize: isSmall ? '0.85rem' : '1rem', color: 'white', marginBottom: '2px', marginTop: '0' }}>{displayName}</h3>
          {level !== undefined && level > 0 && <p style={{ fontSize: '0.75rem', color: '#ff477e', margin: 0 }}>Level {level}</p>}
        </div>
      </div>
    </Link>
  );
}
