/**
 * FRONTEND API CLIENT
 * Handles asynchronous HTTP communication with the backend Express endpoints (/api/*)
 */

interface RequestOptions extends RequestInit {
  data?: unknown;
}

export async function apiFetch<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { data, headers, ...customConfig } = options;

  const config: RequestInit = {
    method: data ? 'POST' : 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    ...customConfig,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const response = await fetch(`/api${cleanEndpoint}`, config);

  if (!response.ok) {
    const statusCode = response.status;
    const fullUrl = `/api${cleanEndpoint}`;

    // 👇 Coba ekstrak error JSON dari backend dulu
    let errorMessage = '';
    let rawResponseText = '';
    try {
      rawResponseText = await response.text();
    } catch {
      rawResponseText = '(tidak bisa baca response body)';
    }

    try {
      const errorData = JSON.parse(rawResponseText);
      if (errorData?.error) errorMessage = errorData.error;
    } catch {
      // Bukan JSON = biasanya halaman HTML error 500 / 404 dari hosting
      errorMessage = response.statusText || 'Gagal memproses permintaan.';
    }

    // 👇 DEBUG INFO SELALU DITAMPILKAN DI CONSOLE (F12) supaya gak bingung!
    const preview = rawResponseText.length > 400 ? `${rawResponseText.slice(0, 400)}... (truncated)` : rawResponseText;
    console.error(`❌ [API ERROR] ${statusCode} ${fullUrl}\nMessage : ${errorMessage}\nResponse: ${preview}`);

    // Jika 5xx / 404 / response HTML, berikan HINT ke user apa yang harus dicek
    let hint = '';
    if (statusCode === 404) {
      hint = '\n\n💡 HINT: API route tidak ditemukan (404). Pastikan di hosting kamu menjalankan Node.js Express server (bukan static file hosting saja! Netlify/Vercel static tidak bisa run /api Express). Cek start script & package.json.';
    } else if (statusCode >= 500) {
      hint = '\n\n💡 HINT: Server error (5xx). 99% dikarenakan ENVIRONMENT VARIABLES Supabase (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY) TIDAK DISET di panel hosting! File .env tidak ikut ter-upload (karena .gitignore). Masuk ke dashboard hosting → Environment Variables → tambahkan SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY.';
    } else if (statusCode === 0 || statusCode >= 400) {
      hint = `\n\n💡 HINT: Status ${statusCode}. Cek Console F12 → Network, tab Response untuk detail. Mungkin CORS / CORS preflight / HTTPS Mixed Content.`;
    }

    throw new Error(`${errorMessage}\n[Status: ${statusCode}]${hint}`);
  }

  return response.json();
}
