# Rencana Implementasi Fitur "Broadcast Tagihan" (Semi-Auto)

Karena aplikasi ini berjalan di browser (PWA) tanpa server backend, pengiriman pesan WhatsApp **sepenuhnya otomatis** (tanpa klik kirim) tidak dimungkinkan karena kebijakan keamanan browser dan WhatsApp.

Namun, saya akan membuat fitur **Broadcast Center** yang membuat prosesnya jauh lebih cepat dan "otomatis" dari sisi pembuatan pesan:

## 1. Fitur "Tagihan Grup" (Paling Efektif)
Membuat satu pesan panjang yang berisi daftar semua peserta yang belum bayar. Admin cukup kirim sekali ke Grup WhatsApp Arisan.
*   **Format Pesan**:
    ```text
    🔔 *PENGINGAT ARISAN* 🔔
    
    Halo semuanya, berikut daftar peserta yang belum melunasi arisan (Rp 100.000):
    1. Budi
    2. Siti
    3. Andi
    
    Mohon segera melakukan pembayaran ya. Terima kasih! 🙏
    ```
*   **Action**: Tombol "Kirim ke Grup WA" dan "Copy Teks".

## 2. Fitur "Quick Blast" (Personal)
Menampilkan daftar peserta yang belum bayar dalam satu jendela popup, dengan tombol "Kirim WA" di samping setiap nama.
*   Admin bisa klik tombol kirim secara berurutan dengan cepat tanpa harus scroll mencari nama di daftar utama.

## Langkah Implementasi:
1.  **Update `Members.jsx`**:
    *   Menambahkan tombol **📢 Tagihan Massal** di bagian atas.
    *   Membuat Modal/Popup "Broadcast Center".
    *   Mengimplementasikan logika generate teks tagihan grup.
    *   Mengimplementasikan list pengiriman cepat.
2.  **Validasi**: Memastikan link WA berjalan lancar.