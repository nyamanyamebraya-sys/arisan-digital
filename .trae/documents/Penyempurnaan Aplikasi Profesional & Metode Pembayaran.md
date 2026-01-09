# Rencana Penyempurnaan Aplikasi Arisan Profesional

Untuk membuat aplikasi terlihat lebih profesional dan lengkap, saya akan melakukan beberapa peningkatan signifikan:

## 1. Fitur Metode Pembayaran
Admin perlu menampilkan info rekening agar peserta tahu harus transfer ke mana.
*   **Menu Pengaturan Rekening**: Admin bisa input Nama Bank, No. Rekening, dan Atas Nama.
*   **Integrasi ke Pesan Tagihan**: Info rekening ini akan otomatis muncul di pesan WhatsApp tagihan ("Silakan transfer ke BCA 123456 a.n Budi").
*   **Tampilan Dashboard**: Menampilkan info rekening di dashboard agar mudah dilihat peserta.

## 2. Penyempurnaan UI/UX (Professional Look)
*   **Empty States yang Lebih Baik**: Tampilan saat data kosong yang lebih informatif dan rapi.
*   **Loading States**: Indikator loading yang halus saat proses berat.
*   **Konsistensi Warna & Tipografi**: Memastikan palet warna biru-putih-abu konsisten dan nyaman di mata.
*   **Responsive Mobile**: Memastikan semua modal dan tombol pas di layar HP (karena arisan sering diakses via HP).

## 3. Fitur Tambahan (Quality of Life)
*   **Tanggal Jatuh Tempo**: Menambahkan pengaturan tanggal jatuh tempo (misal: "Setiap tanggal 10").
*   **Statistik Lebih Detail**: Menampilkan total uang masuk vs total tagihan secara persentase yang lebih visual.

## Langkah Implementasi:
1.  **Update Context**: Menambahkan state untuk menyimpan `bankDetails` (Bank, No Rek, Nama) dan `dueDate`.
2.  **Halaman Pengaturan (Baru/Modal)**: Membuat UI bagi admin untuk mengedit info rekening dan info arisan lainnya.
3.  **Update Broadcast Message**: Memasukkan info rekening ke dalam template pesan WA.
4.  **Polishing UI**: Merapikan padding, shadow, dan border radius di seluruh aplikasi agar terlihat "mahal".