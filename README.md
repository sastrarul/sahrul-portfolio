# Raka.Edits — Personal Brand Website

Website personal brand untuk content creator / video editor / template creator CapCut & DaVinci Resolve enthusiast. HTML + CSS + JS murni, tanpa framework, siap deploy ke Vercel.

## Struktur File

```
index.html      → semua section (Hero, About, Works, Skills, Stats, Testimonials, Contact)
css/style.css   → semua styling, animasi, responsive
js/script.js    → loader, custom cursor, particles, scroll reveal, counter, carousel, modal, form
```

## Deploy ke Vercel

**Cara tercepat (drag & drop):**
1. Buka https://vercel.com/new
2. Drag folder ini (yang berisi `index.html`, `css/`, `js/`) ke halaman upload
3. Klik Deploy — selesai, tidak perlu konfigurasi apa pun (static site)

**Lewat Vercel CLI:**
```bash
npm i -g vercel
cd folder-ini
vercel
```

**Lewat GitHub:** push folder ini ke repo, lalu import repo di Vercel dashboard. Build command kosongkan, output directory `.` (root).

## Yang Perlu Kamu Ganti Sebelum Publish

Semua ini masih placeholder/contoh — wajib diganti dengan data asli kamu:

1. **Nama & brand** — cari "Raka Ananda" / "raka.edits" di `index.html` (hero, navbar, footer, ID card, modal email) dan ganti dengan nama/brand kamu.
2. **Foto/avatar** — bagian `.id-photo` di section About masih ilustrasi SVG sederhana. Ganti dengan `<img>` foto asli kamu (rasio 1:1 disarankan).
3. **Thumbnail karya** — `.work-thumb` di section Featured Works masih gradient warna (placeholder, bukan video asli). Ganti dengan `background-image` thumbnail asli atau elemen `<video>`/embed YouTube/Drive sesuai kebutuhan.
4. **Statistik** — angka di section Statistics (`data-count` pada `index.html`) masih contoh, sesuaikan dengan data asli kamu.
5. **Testimoni** — nama & kutipan di section Testimonials masih fiktif sebagai contoh, ganti dengan testimoni asli dari klien/kolaborator.
6. **Link sosial media** — tombol Instagram/TikTok/YouTube/Behance di section Contact masih `href="#"`, isi dengan URL asli.
7. **Form kontak** — saat ini form hanya simulasi di front-end (tidak benar-benar mengirim email). Untuk membuatnya berfungsi, hubungkan ke layanan seperti Formspree, Resend, atau Vercel Serverless Function, lalu ganti logic di `js/script.js` bagian `contactForm()`.
8. **Email** — ganti `hello@raka.edits` di `index.html` dengan email asli kamu.

## Fitur yang Sudah Dibangun

- Loading screen dengan progress bar
- Custom cursor (dot + ring, otomatis nonaktif di perangkat sentuh)
- Floating particles background (canvas, ringan)
- Hero dengan panel preview timeline ala software editing (playhead + timecode berjalan otomatis)
- Marquee tools berjalan otomatis
- Scroll reveal animation (IntersectionObserver, tidak ada library)
- Parallax ringan pada hero (mengikuti posisi mouse & scroll)
- Featured Works dengan hover effect + modal popup detail karya
- Animated counter pada Statistics
- Skill bar animasi saat masuk viewport
- Testimonial carousel otomatis (auto-play, pause saat hover/fokus, dots & arrow navigation)
- Smooth scroll antar section + nav aktif otomatis mengikuti scroll
- Menu mobile (hamburger) responsif penuh
- Mendukung `prefers-reduced-motion` (animasi otomatis dikurangi untuk pengguna yang sensitif terhadap gerakan)
- Fokus keyboard terlihat jelas (aksesibilitas)

## Browser Support

Menggunakan CSS modern (`backdrop-filter`, `color-mix`) — disarankan Chrome/Edge/Safari/Firefox versi terbaru untuk tampilan glassmorphism optimal.
