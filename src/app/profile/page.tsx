"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import BackButton from '../../components/BackButton';
import { fetchApi } from '../../utils/api';
import ProfileCard from '../../components/profile/ProfileCard';
import HistoryTable from '../../components/profile/HistoryTable';
import ImageCropper from '../../components/profile/ImageCropper';
import { AttemptHistory } from '../../types';

export default function ProfilePage() {
  const [history, setHistory] = useState<AttemptHistory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [userName, setUserName] = useState('Pemain');
  const [handle, setHandle] = useState('@username');
  const [avatarUrl, setAvatarUrl] = useState('/char-mc.png');
  const [userRole, setUserRole] = useState('Pelajar Kalkulus');
  const [selectedFileUrl, setSelectedFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // Fetch User Profile and Attempts History concurrently for better performance
        const [userRes, attemptsRes] = await Promise.all([
          fetchApi('/api/v1/users/me').catch(e => ({ error: e })),
          fetchApi('/api/v1/attempts').catch(e => ({ error: e }))
        ]);

        if (!userRes.error && userRes.data) {
          const user = userRes.data;
          const fullName = user.first_name ? `${user.first_name} ${user.last_name || ''}`.trim() : user.username;
          setUserName(fullName || 'Pemain');
          setHandle(`@${user.username}`);
          if (user.profile_picture_url) {
            setAvatarUrl(user.profile_picture_url);
          }
          if (user.roles && user.roles.includes('ADMIN')) {
            setUserRole('Admin');
          } else if (user.roles && user.roles.includes('SUPER_ADMIN')) {
            setUserRole('Super Admin');
          }
        } else if (userRes.error) {
          toast.error(userRes.error.message || "Gagal mengambil data profil");
        }

        if (!attemptsRes.error && attemptsRes.data && Array.isArray(attemptsRes.data)) {
          // Sort by latest first
          const sortedAttempts = attemptsRes.data.sort((a: any, b: any) => 
            new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime()
          );
          setHistory(sortedAttempts);
        } else if (attemptsRes.error) {
          toast.error(attemptsRes.error.message || "Gagal mengambil histori");
        }
      } catch (error: any) {
        toast.error("Gagal mengambil data profil");
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProfileData();
  }, []);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedFileUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset the input so the same file can be selected again if needed
    e.target.value = '';
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setSelectedFileUrl(null); // Close the cropper modal immediately

    // Preview locally first
    const reader = new FileReader();
    reader.onloadend = () => setAvatarUrl(reader.result as string);
    reader.readAsDataURL(croppedBlob);

    // Upload to backend
    const formData = new FormData();
    formData.append("profile_picture", croppedBlob, "avatar.jpg");

    const loadingToast = toast.loading("Mengunggah foto profil...");
    try {
      const res = await fetchApi("/api/v1/users/me/profile-picture", {
        method: "PATCH",
        body: formData,
      });
      if (res.data?.profile_picture_url) {
         setAvatarUrl(res.data.profile_picture_url);
      }
      toast.success("Foto profil berhasil diperbarui!", { id: loadingToast });
    } catch (error: any) {
      toast.error(error.message || "Gagal mengunggah foto profil", { id: loadingToast });
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem('userRole');
    localStorage.removeItem('userGender');
    window.location.href = "/login";
  };

  if (!isLoaded) {
    return (
      <main style={{
        minHeight: '100vh',
        backgroundImage: 'url("/bg_kelas.png")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(15, 16, 21, 0.6)',
          zIndex: 0
        }}></div>
        <div style={{ position: 'relative', zIndex: 5, color: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '40px', height: '40px', border: '4px solid rgba(255, 71, 126, 0.3)', borderTopColor: '#ff477e', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ fontWeight: '500', letterSpacing: '1px' }}>Memuat Profil...</p>
        </div>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: '100vh',
      backgroundImage: 'url("/bg_kelas.png")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Dark overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(15, 16, 21, 0.6)',
        zIndex: 0
      }}></div>

      <div style={{
        position: 'relative', zIndex: 5, marginTop: '2rem', width: '100%', maxWidth: '800px', padding: '0 2rem',
        display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60px'
      }}>
        <div style={{ position: 'absolute', left: '2rem' }}>
          <BackButton href="/dashboard" />
        </div>
        
        {/* Banner */}
        <div style={{
          backgroundColor: '#ff477e',
          padding: '10px 30px',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(255, 71, 126, 0.4)'
        }}>
          <h1 style={{
            color: 'white', fontSize: '1.5rem', fontWeight: '700', margin: 0,
            fontStyle: 'italic', textShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}>
            Profil Pemain
          </h1>
        </div>
      </div>

      <div style={{
        position: 'relative', zIndex: 5,
        width: '100%', maxWidth: '800px',
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '2rem'
      }}>
        {/* User Info Card */}
        <ProfileCard 
          avatarUrl={avatarUrl}
          handleAvatarChange={handleAvatarChange}
          userName={userName}
          handle={handle}
          userRole={userRole}
          handleLogout={handleLogout}
        />

        {/* History Table */}
        <HistoryTable history={history} />
      </div>

      {/* Image Cropper Modal */}
      {selectedFileUrl && (
        <ImageCropper
          imageSrc={selectedFileUrl}
          onCancel={() => setSelectedFileUrl(null)}
          onCropComplete={handleCropComplete}
        />
      )}
    </main>
  );
}
