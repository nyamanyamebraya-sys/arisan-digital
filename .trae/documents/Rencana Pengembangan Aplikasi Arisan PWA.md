# Inisialisasi Proyek
1.  Setup project menggunakan **Vite** dengan template **React** (cepat dan modern).
2.  Install dependencies yang diperlukan.

# Konfigurasi UI & Styling
1.  Install dan konfigurasi **Tailwind CSS** untuk tampilan yang responsif dan modern.
2.  Membuat struktur folder yang rapi untuk komponen dan halaman.

# Implementasi PWA (Progressive Web App)
1.  Install `vite-plugin-pwa`.
2.  Konfigurasi `vite.config.js` untuk membuat manifest (Nama aplikasi, Ikon, Warna tema) dan Service Worker agar aplikasi bisa diinstall di HP dan berjalan offline.

# Pengembangan Fitur Inti
1.  **Manajemen Data**: Membuat sistem penyimpanan data peserta dan riwayat arisan menggunakan `localStorage` (agar data tersimpan di browser pengguna).
2.  **Halaman Utama**: Dashboard ringkas status arisan.
3.  **Kelola Peserta**: Fitur tambah, edit, dan hapus peserta arisan.
4.  **Kocok Arisan**: Fitur utama untuk mengacak pemenang dari peserta yang belum menang.
5.  **Riwayat**: Daftar pemenang arisan sebelumnya.

# Finalisasi
1.  Menjalankan server lokal.
2.  Verifikasi fitur PWA (Installable & Offline capabilities).