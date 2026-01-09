# Rencana Penyempurnaan Aplikasi Arisan

Berdasarkan status aplikasi saat ini, berikut adalah fitur-fitur krusial yang perlu ditambahkan agar aplikasi ini benar-benar "siap pakai" dan aman digunakan:

## 1. Manajemen Pembayaran (Payment Tracking)
Saat ini kita hanya bisa mengirim tagihan WA, tapi belum bisa mencatat **siapa yang sudah bayar**.
*   **Implementasi**: Menambahkan status "Sudah Bayar" (Checkbox) pada setiap peserta.
*   **Manfaat**: Admin bisa melihat ringkasan berapa orang yang belum bayar sebelum mengocok arisan.

## 2. Fitur Edit Data Peserta
Saat ini hanya bisa Tambah dan Hapus. Jika ada salah ketik nama atau ganti nomor WA, data harus dihapus dulu.
*   **Implementasi**: Menambahkan tombol **Edit** (ikon pensil) untuk mengubah Nama dan No. WA.

## 3. Backup & Restore Data (Penting!)
Karena aplikasi ini berbasis PWA & LocalStorage (tanpa server cloud), data tersimpan di browser HP pengguna. Jika pengguna menghapus cache atau ganti HP, data bisa hilang.
*   **Implementasi**: Fitur **Export Data** (Download file JSON) dan **Import Data** (Upload file JSON) di halaman Dashboard/Pengaturan.

## 4. UI/UX Polish
*   Menggunakan notifikasi yang lebih cantik (Toast) daripada `window.alert` bawaan browser.
*   Menambahkan indikator visual (Progress Bar) pembayaran di Dashboard.

---

### Langkah Implementasi:

1.  **Install Dependensi**: `react-hot-toast` untuk notifikasi cantik.
2.  **Update Context (`ArisanContext.jsx`)**:
    *   Menambahkan fungsi `updateMember` (untuk edit & status bayar).
    *   Menambahkan logika Import/Export data.
3.  **Update Halaman Peserta (`Members.jsx`)**:
    *   Integrasi fitur Edit dan Checkbox Bayar.
    *   Tampilan visual status pembayaran.
4.  **Update Halaman Dashboard (`Dashboard.jsx`)**:
    *   Menambahkan panel Backup/Restore.
    *   Menambahkan ringkasan keuangan (Total Uang Terkumpul).