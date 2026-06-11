export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  // Try to get token from cookies or localStorage
  let token = '';
  if (typeof window !== 'undefined') {
    const match = document.cookie.match(new RegExp('(^| )token=([^;]+)'));
    if (match) token = match[2];
  }

  const defaultHeaders: HeadersInit = {};

  // Deteksi cerdas: Jika body BUKAN FormData, baru set Content-Type ke JSON
  if (!(options.body instanceof FormData)) {
    defaultHeaders['Content-Type'] = 'application/json';
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  
  const response = await fetch(`${baseUrl}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  // Auto-Kick jika token basi (401 Unauthorized)
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie = "role=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      localStorage.removeItem('userRole');
      localStorage.removeItem('userGender');
      window.location.href = '/login';
    }
    throw {
      status: 401,
      message: 'Sesi telah berakhir, silakan login kembali.'
    };
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    data = null;
  }

  if (!response.ok) {
    throw {
      status: response.status,
      message: data?.message || `Error ${response.status}: ${response.statusText}`,
      data: data?.data
    };
  }

  return data;
}
