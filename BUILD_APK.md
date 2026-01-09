# Cara Mengubah Aplikasi Arisan Menjadi APK (Android)

Aplikasi ini dibangun menggunakan teknologi **Progressive Web App (PWA)**. Artinya, aplikasi ini sebenarnya adalah website yang bisa diinstal dan dijalankan layaknya aplikasi native.

Untuk mengubahnya menjadi file `.apk` yang bisa diinstal di Android, Anda memiliki 2 opsi utama:

## Opsi 1: Menggunakan PWABuilder (Paling Mudah)
Cara ini tidak memerlukan coding Android sama sekali.

1.  **Deploy Aplikasi ke Internet**
    Anda harus meng-online-kan aplikasi ini terlebih dahulu (misal: ke Vercel atau Netlify).
    *   Push kode ke GitHub.
    *   Buka [Vercel](https://vercel.com) -> Add New Project -> Import dari GitHub.
    *   Tunggu sampai dapat URL (misal: `https://arisan-digital.vercel.app`).

2.  **Generate APK**
    *   Buka website [PWABuilder](https://www.pwabuilder.com/).
    *   Masukkan URL aplikasi Anda (dari langkah 1).
    *   Klik **Start**.
    *   Jika skor PWA sudah bagus (hijau), klik tombol **Package for Stores**.
    *   Pilih **Android** -> **Generate**.
    *   Download file ZIP, ekstrak, dan Anda akan mendapatkan file `.apk` (biasanya `universal.apk` atau `signed.apk`).

3.  **Install di HP**
    *   Kirim file APK ke HP Anda.
    *   Install seperti biasa.

## Opsi 2: "Add to Home Screen" (Tanpa APK)
Sebenarnya Anda tidak *wajib* membuat APK. Teknologi PWA memungkinkan Anda menginstal langsung dari browser Chrome di HP.

1.  Buka URL aplikasi (yang sudah dideploy) di Google Chrome Android.
2.  Akan muncul pop-up di bawah: **"Add Arisan Digital to Home Screen"** (atau klik menu titik tiga -> Install App).
3.  Aplikasi akan muncul di menu HP Anda seperti aplikasi biasa, tanpa address bar browser, dan bisa jalan offline.

## Persiapan Aset (Penting!)
Agar icon aplikasi terlihat bagus di HP, pastikan Anda telah menyiapkan file gambar berikut di folder `public/`:
*   `pwa-192x192.png` (Icon ukuran kecil)
*   `pwa-512x512.png` (Icon ukuran besar)

*Catatan: Saat ini file tersebut belum ada di project, silakan tambahkan gambar logo arisan Anda sendiri dengan nama file di atas agar icon aplikasi tidak kosong.*
