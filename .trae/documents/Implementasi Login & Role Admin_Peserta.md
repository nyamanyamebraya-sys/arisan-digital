# Rencana Implementasi Login & Role Management

Karena aplikasi ini berjalan tanpa server (Client-side only), sistem login akan dibuat sederhana namun efektif untuk membatasi akses fitur.

## 1. Skema Role (Peran)
*   **Admin**: Akses penuh (Tambah/Edit/Hapus Peserta, Kocok Arisan, Tandai Bayar, Broadcast, Reset).
*   **Peserta (Guest)**: Akses "Read-Only" (Hanya bisa melihat Dashboard, Daftar Peserta, Pemenang, dan Riwayat). Tidak bisa mengubah data apapun.

## 2. Fitur Login
*   **Halaman Login**: Akan menjadi halaman pertama saat aplikasi dibuka.
*   **Mode Peserta**: Tombol "Masuk sebagai Peserta" (Langsung masuk tanpa password).
*   **Mode Admin**: Input Password (Default: `admin123`).
*   **Persistensi**: Status login akan disimpan di sesi browser, jadi tidak perlu login ulang setiap kali refresh (kecuali logout).

## 3. Pembatasan Akses (Protecting Features)
Saya akan menyembunyikan/menonaktifkan tombol-tombol berikut jika pengguna bukan Admin:
*   **Halaman Peserta**: Tombol Tambah, Edit, Hapus, Toggle Bayar, Pengaturan Tagihan, Broadcast.
*   **Halaman Kocok**: Tombol "Kocok Sekarang".
*   **Halaman Riwayat**: Tombol "Reset Periode".
*   **Dashboard**: Tombol "Reset Pembayaran", "Restore Data".

## Langkah Implementasi:
1.  **Update `ArisanContext`**: Menambahkan state `userRole` ('admin' | 'guest' | null) dan fungsi `login/logout`.
2.  **Buat `Login.jsx`**: Halaman antarmuka untuk memilih peran.
3.  **Update `App.jsx`**: Logika routing sederhana (Tampilkan Login jika belum ada role).
4.  **Update Halaman Lain**: Menambahkan pengecekan `userRole === 'admin'` pada tombol-tombol krusial.