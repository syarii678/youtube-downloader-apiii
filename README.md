# API Downloader YouTube Siap Pakai untuk Vercel

Ini adalah proyek REST API siap pakai untuk mendapatkan link download video (MP4) dan audio (M4A) dari YouTube. Dibuat dengan Node.js, Express, dan `node-yt-dl`, serta dikonfigurasi khusus untuk deployment di Vercel.

## Langkah-langkah Penggunaan

1.  **Buat Ulang Proyek:** Buat semua file dan folder seperti struktur di atas dan salin-tempel (copy-paste) semua kode yang disediakan.

2.  **Install Dependensi (Lokal):** Buka terminal di folder proyek dan jalankan `npm install`.

3.  **Unggah ke GitHub:** Buat repository baru di GitHub dan unggah semua file proyek ini.
    ```bash
    git init
    git add .
    git commit -m "Initial commit"
    git branch -M main
    git remote add origin [https://github.com/USERNAME/NAMA_REPO.git](https://github.com/USERNAME/NAMA_REPO.git)
    git push -u origin main
    ```

4.  **Deploy ke Vercel:**
    * Buka dashboard Vercel Anda.
    * Pilih "Add New..." -> "Project".
    * Import repository GitHub yang baru saja Anda buat.

5.  **Atur API Key (WAJIB):**
    * Di pengaturan proyek Vercel, masuk ke **Settings** -> **Environment Variables**.
    * Buat variabel baru:
        * **Key:** `API_KEY`
        * **Value:** `BuatKunciRahasiaAndaDisini12345` (ganti dengan API Key yang Anda inginkan)
    * Simpan, dan Vercel akan otomatis men-deploy ulang dengan API Key tersebut.

## Contoh Penggunaan API

Ganti `NAMA-PROYEK.vercel.app` dengan URL Vercel Anda dan `API_KEY_ANDA` dengan kunci yang Anda atur.

### Download Video (MP4)