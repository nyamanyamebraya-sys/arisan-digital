# Arisan Digital v1.0

Aplikasi web modern untuk mengelola arisan dengan mudah, transparan, dan profesional.

## Fitur Utama

### 1. Dashboard Interaktif
*   Ringkasan keuangan (Total Terkumpul vs Target).
*   Progress bar pembayaran bulan ini.
*   Info Rekening & Tanggal Jatuh Tempo yang jelas.
*   Daftar pemenang terakhir.

### 2. Manajemen Peserta & Pembayaran
*   **Daftar Peserta**: Tambah/Hapus peserta dengan mudah.
*   **Status Pembayaran**: Tandai "Sudah Bayar" atau "Belum Bayar" dengan satu klik.
*   **Indikator Status**: Label "Lunas", "Belum Menang", atau "Sudah Menang" otomatis.

### 3. Broadcast Tagihan Otomatis (WhatsApp)
*   **Kirim ke Grup**: Generate pesan tagihan otomatis berisi daftar nama yang belum bayar + info rekening.
*   **Auto Blast (Personal)**: Fitur "Wizard" untuk mengirim pesan tagihan personal (Japri) satu per satu secara cepat.
*   **Integrasi Link WA**: Pesan otomatis menyertakan nama peserta dan nominal tagihan.

### 4. Pengundian Pemenang (Lottery)
*   Animasi pengocokan yang seru dan menegangkan.
*   Sistem cerdas: Hanya mengundi peserta yang **Sudah Bayar** dan **Belum Menang**.
*   Pop-up konfetti saat pemenang muncul.

### 5. Pusat Pengaturan (Settings)
*   **Info Arisan**: Ubah nominal iuran & tanggal jatuh tempo.
*   **Rekening**: Atur info bank transfer (BCA/Mandiri/dll).
*   **Backup & Restore**: Simpan data ke file JSON agar aman saat ganti HP/Laptop.
*   **Keamanan**: Ubah password admin sesuka hati.
*   **Reset Data**: Mulai periode baru atau bulan baru dengan mudah.

## Cara Instalasi (Developer)

1.  Clone repository ini.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Jalankan aplikasi:
    ```bash
    npm run dev
    ```

## Cara Penggunaan

1.  **Login**:
    *   **Admin**: Gunakan password default `admin123` (bisa diubah di pengaturan).
    *   **Peserta**: Klik "Masuk sebagai Peserta" (Mode Read-Only).
2.  **Mulai**: Tambahkan peserta di menu "Peserta".
3.  **Tagihan**: Gunakan menu "Broadcast Tagihan" untuk menagih lewat WA.
4.  **Kocok**: Masuk ke menu "Kocok" saat arisan berlangsung.

---
*Dibuat dengan ❤️ menggunakan React + Vite + Tailwind CSS*
