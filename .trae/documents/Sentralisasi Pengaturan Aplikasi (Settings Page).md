# Rencana Pembuatan Halaman Pengaturan Terpusat

Saat ini, pengaturan tersebar di berbagai tempat (tombol "Info Arisan" di Dashboard, tombol "Pengaturan" di Members, dll). Untuk membuatnya lebih rapi dan profesional, saya akan menyatukan semua konfigurasi ke dalam satu halaman/menu khusus **"Pengaturan"**.

## 1. Perubahan Struktur Navigasi
*   Menambahkan tab baru **"Pengaturan"** (ikon ⚙️) di navigasi bawah (bottom bar).
*   Tab ini hanya akan terlihat/aktif jika user adalah **Admin**.

## 2. Halaman Pengaturan Baru (`src/pages/Settings.jsx`)
Halaman ini akan menjadi pusat kontrol aplikasi, mencakup:
*   **Info Arisan**: Mengatur Tanggal Jatuh Tempo.
*   **Keuangan**: Mengatur Nominal Tagihan (pindah dari halaman Members).
*   **Metode Pembayaran**: Mengatur Nama Bank, No. Rekening, Atas Nama.
*   **Manajemen Data**: Fitur Backup (Download) & Restore (Upload) Data (pindah dari Dashboard).
*   **Bahaya (Danger Zone)**: Tombol Reset Pembayaran & Reset Periode Arisan (pindah dari Dashboard & History).
*   **Akun**: Ubah Password Admin (Fitur Baru!).

## 3. Pembersihan Halaman Lain
*   Menghapus tombol "Info Arisan" & "Data Backup" dari **Dashboard**.
*   Menghapus tombol "Pengaturan" (Nominal) dari **Members**.
*   Menghapus tombol "Reset" dari **History**.
*   Menjadikan halaman-halaman tersebut lebih bersih dan fokus pada fungsinya (Menampilkan data).

## Langkah Implementasi:
1.  **Buat `Settings.jsx`**: Implementasi UI pusat pengaturan dengan accordion/card yang rapi.
2.  **Update `App.jsx`**: Tambahkan rute dan tombol navigasi baru.
3.  **Update `ArisanContext`**: Tambahkan state untuk `adminPassword` (agar bisa diubah).
4.  **Refactor**: Hapus kode pengaturan lama dari `Dashboard.jsx`, `Members.jsx`, dan `History.jsx`.