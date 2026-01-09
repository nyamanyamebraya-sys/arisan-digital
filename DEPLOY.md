# Cara Meng-Online-kan Aplikasi Arisan (Gratis)

Berikut adalah cara termudah untuk membuat aplikasi Arisan ini bisa diakses semua orang melalui internet menggunakan **Vercel** (Layanan hosting gratis terbaik untuk React).

## Persiapan (Wajib)
Pastikan Anda sudah memiliki akun **GitHub**. Jika belum, daftar dulu di [github.com](https://github.com).

## Langkah 1: Upload Kode ke GitHub
1.  Buka terminal di komputer Anda (di folder proyek arisan ini).
2.  Jalankan perintah berikut satu per satu:
    ```bash
    git init
    git add .
    git commit -m "Upload aplikasi arisan v1.0"
    ```
3.  Buka website GitHub, buat **Repository Baru** (klik tombol + di pojok kanan atas -> New Repository).
    *   Beri nama: `arisan-digital`
    *   Pilih **Public** (atau Private juga boleh).
    *   Klik **Create repository**.
4.  Copy perintah yang muncul di bagian **"…or push an existing repository from the command line"**. Biasanya seperti ini:
    ```bash
    git remote add origin https://github.com/USERNAME_ANDA/arisan-digital.git
    git branch -M main
    git push -u origin main
    ```
5.  Paste perintah tersebut di terminal Anda. Kode Anda sekarang sudah ada di GitHub!

## Langkah 2: Deploy ke Vercel
1.  Buka website [Vercel.com](https://vercel.com) dan Login (pilih **Continue with GitHub**).
2.  Di dashboard, klik tombol **Add New...** -> **Project**.
3.  Di bagian "Import Git Repository", cari `arisan-digital` yang baru Anda upload, lalu klik **Import**.
4.  Di halaman konfigurasi (Configure Project):
    *   **Framework Preset**: Pilih **Vite**.
    *   Biarkan pengaturan lain default.
5.  Klik tombol **Deploy**.
6.  Tunggu sekitar 1-2 menit.

## Selesai! 🎉
Vercel akan memberikan link domain (contoh: `https://arisan-digital.vercel.app`).
Link inilah yang bisa Anda bagikan ke semua anggota arisan. Mereka bisa membukanya di HP masing-masing tanpa perlu instalasi!

---

## Tips Tambahan
*   Setiap kali Anda mengubah kode di komputer dan melakukan `git push`, Vercel akan **otomatis** mengupdate website Anda dalam hitungan detik.
*   Jika ingin domain yang lebih cantik (misal `arisan-keluarga.com`), Anda bisa membelinya di penyedia domain dan menghubungkannya di menu Settings Vercel.
