// Reset scroll position on page load
window.addEventListener('beforeunload', function() {
    window.scrollTo(0, 0);
});

// Ensure page starts at top when loaded
window.addEventListener('load', function() {
    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 100);
});

// Also reset on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    window.scrollTo(0, 0);
    
    // Smooth scrolling for navigation links
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    mobileMenuBtn.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Close mobile menu if open
                mobileMenu.classList.add('hidden');
            }
        });
    });

    // Navbar background change on scroll
    const navbar = document.querySelector('nav');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('bg-cyber-dark/95');
            navbar.classList.remove('bg-cyber-dark/80');
        } else {
            navbar.classList.add('bg-cyber-dark/80');
            navbar.classList.remove('bg-cyber-dark/95');
        }
    });

    // Animate elements on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animate-slide-up')) {
                entry.target.classList.add('animate-slide-up');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Typewriter effect
    const typewriterText = document.querySelector('.typewriter');
    if (typewriterText) {
        // Same texts for both mobile and desktop
        const texts = [
            'WebDev dan Robotics Enthusiast',
            'Spesialis JavaScript & Python',
            'Mahasiswa Teknik Elektro',
            'Pemecah Masalah & Penggerak Inovasi'
        ];
        
        let textIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let currentText = '';

        function type() {
            const fullText = texts[textIndex];
            
            if (isDeleting) {
                currentText = fullText.substring(0, charIndex - 1);
                charIndex--;
            } else {
                currentText = fullText.substring(0, charIndex + 1);
                charIndex++;
            }
            
            typewriterText.textContent = currentText;
            
            let typeSpeed = isDeleting ? 50 : 100;
            
            if (!isDeleting && charIndex === fullText.length) {
                typeSpeed = 2000; // Pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                textIndex = (textIndex + 1) % texts.length;
                typeSpeed = 500; // Pause before next text
            }
            
            setTimeout(type, typeSpeed);
        }
        
        type();
    }

    // Particle effect for hero section
    createParticles();

    // Contact form handling with Google Sheets integration
    const contactForm = document.querySelector('#contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submit-btn');
            const submitText = document.getElementById('submit-text');
            const submitLoader = document.getElementById('submit-loader');
            
            // Show loading state
            submitBtn.disabled = true;
            submitText.textContent = 'Mengirim...';
            submitLoader.classList.remove('hidden');
            
            // Get form data
            const formData = new FormData(this);
            const data = {
                name: formData.get('nama'),
                email: formData.get('email'),
                subject: formData.get('subjek'),
                message: formData.get('pesan'),
                timestamp: new Date().toISOString()
            };
            
            // Send to Google Sheets
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwvzdccT2OdgD9HPQc3M3FVz3jTvJEJJFzPlLDvehieqgS9p9uVoPI6yJB3C9pQsDuP/exec';
            
            fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })
            .then(() => {
                // Reset button state
                submitBtn.disabled = false;
                submitText.textContent = 'Kirim Pesan';
                submitLoader.classList.add('hidden');
                
                // Show success message
                showNotification('Pesan berhasil dikirim! Saya akan segera membalasnya.', 'success');
                
                // Reset form
                this.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                
                // Reset button state
                submitBtn.disabled = false;
                submitText.textContent = 'Kirim Pesan';
                submitLoader.classList.add('hidden');
                
                // Show error message
                showNotification('Gagal mengirim pesan. Silakan coba lagi.', 'error');
            });
        });
    }

    // View Work button functionality
    const viewWorkBtn = document.getElementById('view-work-btn');
    if (viewWorkBtn) {
        viewWorkBtn.addEventListener('click', function() {
            document.querySelector('#projects').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    }

    // View All Projects functionality
    const viewAllProjectsBtn = document.getElementById('view-all-projects-btn');
    const additionalProjects = document.getElementById('additional-projects');
    
    if (viewAllProjectsBtn && additionalProjects) {
        viewAllProjectsBtn.addEventListener('click', function() {
            if (additionalProjects.classList.contains('hidden')) {
                // Show additional projects
                additionalProjects.classList.remove('hidden');
                additionalProjects.style.opacity = '0';
                additionalProjects.style.transform = 'translateY(20px)';
                
                // Animate in
                setTimeout(() => {
                    additionalProjects.style.transition = 'all 0.5s ease-out';
                    additionalProjects.style.opacity = '1';
                    additionalProjects.style.transform = 'translateY(0)';
                    
                    // Add event listeners to newly visible project areas
                    setupAdditionalProjectListeners();
                }, 10);
                
                this.textContent = 'Tampilkan Lebih Sedikit Proyek';
            } else {
                // Hide additional projects
                additionalProjects.style.transition = 'all 0.3s ease-in';
                additionalProjects.style.opacity = '0';
                additionalProjects.style.transform = 'translateY(-20px)';
                
                setTimeout(() => {
                    additionalProjects.classList.add('hidden');
                }, 300);
                
                this.textContent = 'Lihat Semua Proyek';
            }
        });
    }

    // Skills animation
    animateSkills();
});

// Particle system for hero section
function createParticles() {
    const heroSection = document.querySelector('#home');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'absolute w-1 h-1 bg-cyber-blue rounded-full opacity-30 animate-float';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animationDelay = Math.random() * 3 + 's';
        particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
        heroSection.appendChild(particle);
    }
}

// Skills animation
function animateSkills() {
    const skillBars = document.querySelectorAll('.skill-item');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.skill-bar');
                if (progressBar) {
                    const targetWidth = progressBar.getAttribute('data-width');
                    progressBar.style.width = '0%';
                    progressBar.style.transition = 'none';
                    
                    setTimeout(() => {
                        progressBar.style.transition = 'width 2s ease-in-out';
                        progressBar.style.width = targetWidth;
                    }, 200);
                }
            }
        });
    }, { threshold: 0.3 });
    
    skillBars.forEach(skill => {
        skillObserver.observe(skill);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-20 right-6 p-4 rounded-lg shadow-lg z-50 transform translate-x-full transition-transform duration-300`;
    
    switch (type) {
        case 'success':
            notification.classList.add('bg-green-500', 'text-white');
            break;
        case 'error':
            notification.classList.add('bg-red-500', 'text-white');
            break;
        default:
            notification.classList.add('bg-cyber-blue', 'text-cyber-dark');
    }
    
    notification.innerHTML = `
        <div class="flex items-center space-x-2">
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'times' : 'info'}-circle"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out after 3 seconds
    setTimeout(() => {
        notification.classList.add('translate-x-full');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cursor trail effect
let mouseX = 0;
let mouseY = 0;
let trailElements = [];

document.addEventListener('mousemove', function(e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function createCursorTrail() {
    if (trailElements.length > 20) {
        const oldElement = trailElements.shift();
        if (oldElement && oldElement.parentNode) {
            oldElement.parentNode.removeChild(oldElement);
        }
    }
    
    const trail = document.createElement('div');
    trail.className = 'fixed w-2 h-2 bg-cyber-blue rounded-full pointer-events-none z-40 opacity-60';
    trail.style.left = mouseX + 'px';
    trail.style.top = mouseY + 'px';
    trail.style.transform = 'translate(-50%, -50%)';
    trail.style.transition = 'opacity 0.5s ease-out';
    
    document.body.appendChild(trail);
    trailElements.push(trail);
    
    setTimeout(() => {
        trail.style.opacity = '0';
    }, 100);
}

// Create cursor trail effect on desktop
if (window.innerWidth > 768) {
    setInterval(createCursorTrail, 50);
}

// Parallax effect for hero section
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroElements = document.querySelectorAll('#home .animate-float');
    
    heroElements.forEach((element, index) => {
        const speed = 0.5 + (index * 0.1);
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Loading animation
window.addEventListener('load', function() {
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'fixed inset-0 bg-cyber-dark z-50 flex items-center justify-center';
    loadingScreen.innerHTML = `
        <div class="text-center">
            <div class="w-16 h-16 border-4 border-cyber-blue border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <div class="text-cyber-blue text-xl font-cyber">Memuat...</div>
        </div>
    `;
    
    document.body.appendChild(loadingScreen);
    
    setTimeout(() => {
        loadingScreen.style.opacity = '0';
        loadingScreen.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
            document.body.removeChild(loadingScreen);
        }, 500);
    }, 1000);
});

// Matrix rain effect (optional, can be enabled for extra futuristic feel)
function createMatrixRain() {
    const matrixContainer = document.createElement('div');
    matrixContainer.className = 'fixed inset-0 pointer-events-none z-0 opacity-10';
    matrixContainer.innerHTML = `
        <canvas id="matrix-canvas" class="w-full h-full"></canvas>
    `;
    document.body.appendChild(matrixContainer);
    
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    const matrix = "ABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const matrixArray = matrix.split("");
    
    const fontSize = 10;
    const columns = canvas.width / fontSize;
    
    const drops = [];
    for (let x = 0; x < columns; x++) {
        drops[x] = 1;
    }
    
    function draw() {
        ctx.fillStyle = 'rgba(10, 10, 10, 0.04)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#00d2ff';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
            const text = matrixArray[Math.floor(Math.random() * matrixArray.length)];
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);
            
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }
    
    setInterval(draw, 35);
    
    window.addEventListener('resize', function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

createMatrixRain();

// Project data
const projectsData = {
    project1: {
        title: "Website Form Laporan Anomali",
        description: [
            "Aplikasi Web Laporan Anomali ini adalah aplikasi web laporan anomali yang dibangun menggunakan Google Apps Script sebagai backend serverless dan Google Sheets sebagai penyimpanan utama, dengan front-end sederhana berbasis HTML, CSS, dan Vanilla JavaScript. Tujuan utamanya adalah menyederhanakan proses pelaporan anomali operasional (shift pagi & sore), memastikan konsistensi format data, dan menyediakan rekap yang siap untuk analisis oleh tim operasional dan manajemen.",
            "Frontend: HTML terstruktur, CSS minimal untuk keterbacaan, dan JavaScript yang menangani validasi, toggle field, dan komunikasi google.script.run. Implementasinya berfokus pada kecepatan input (autofocus, tab order) dan umpan balik visual untuk memungkinkan operator bekerja dengan cepat di lapangan.",
            "Backend (Google Apps Script): Fungsi doGet() me-render halaman, sementara fungsi saveData(form) melakukan pemetaan field → header, validasi sisi server, pembuatan sheet (jika belum ada), penambahan baris, dan logging error. PropertiesService menyimpan spreadsheetId sehingga integrasi dapat dikonfigurasi dan stateless.",
            "Storage: Google Sheets berfungsi sebagai database ringan — mudah dikelola, mendukung filter, chart, dan ekspor CSV untuk analisis lebih lanjut.",
            "Aplikasi ini menggunakan izin Google Apps standar: hanya pengguna yang diotorisasi yang dapat mengedit sheet (jika dikonfigurasi). Data sensitif dapat dimitigasi dengan menghindari input data pribadi yang tidak perlu dan mengatur izin peran (Viewer/Editor) sesuai kebijakan perusahaan. Backup rutin dan rotasi sheet (bulanan/triwulanan) direkomendasikan untuk memenuhi kepatuhan retensi data dan menjaga performa.",
            "Desain modular (UI terpisah dari logika back-end) membuat penambahan field atau kategori baru menjadi mudah—cukup tambahkan header dan sesuaikan pemetaan di back-end. Untuk skala data besar, strategi rotasi sheet per periode dan ekspor ke BigQuery atau sistem analitik eksternal disarankan."
        ],
        images: [
            "assets/Projects/Form_Laporan_Anomali.png",
            "assets/Projects/Form_Laporan_Anomali_Opsi.png",
            "assets/Projects/Form_Laporan_Anomali_Mobile.png",
            "assets/Projects/Form_Laporan_Anomali_Mobile_Opsi.png"
        ],
        techStack: ["Google Apps Script", "JavaScript", "HTML5", "CSS3", "Google Sheets"],
        features: [
            "Formulir Dinamis Pagi/Sore — Field ditampilkan atau disembunyikan berdasarkan shift yang dipilih untuk mengurangi kesalahan input",
            "Validasi Klien & Server — Field wajib divalidasi di browser dan dicek ulang di server sebelum disimpan",
            "Pengiriman Asinkron (Tanpa Reload) — Mengirim data melalui google.script.run sehingga pengguna mendapat umpan balik instan tanpa refresh halaman",
            "Pembuatan Spreadsheet Rekap Otomatis — Script membuat Google Sheet terstruktur dengan header standar pada run pertama",
            "Tambah Baris dengan Timestamp — Setiap laporan dicatat sebagai baris baru dengan timestamp sisi server dan metadata",
            "Manajemen Konfigurasi via PropertiesService — Menyimpan spreadsheetId dan pengaturan secara terpusat sehingga deployment tidak memerlukan konfigurasi manual",
            "Umpan Balik Ramah Pengguna — Notifikasi sukses dan error yang jelas dengan pesan yang dapat ditindaklanjuti untuk operator",
            "Penanganan Error & Logging — Logging yang robust dan pesan error deskriptif untuk menyederhanakan troubleshooting dan maintenance",
            "Provisioning Akses Otomatis Opsional — Opsi untuk memberikan akses editor spreadsheet secara otomatis kepada pemilik atau peran",
            "Struktur Data Siap Analisis — Kolom standar (timestamp, operator, kategori, lokasi, keterangan, status) untuk filtering dan pivoting yang mudah",
            "Skalabilitas Operasional — Dukungan untuk rotasi sheet per periode (misalnya, bulanan) untuk mengelola dataset besar dan menjaga performa",
            "Deployment Mudah sebagai Web App — Dapat dipublikasikan sebagai Google Apps Script Web App dengan akses yang dapat dikonfigurasi (internal/eksternal) untuk rollout cepat"
        ],
    },
    project2: {
        title: "Website Portofolio",
        description: [
            "Website Portofolio ini adalah situs brand personal yang dibangun untuk menyajikan proyek, keterampilan, dan pengalaman dengan cara yang ringkas dan menarik secara visual. Desainnya memadukan layout bersih dengan aksen terinspirasi cyberpunk untuk mengkomunikasikan kelancaran teknis dan selera kreatif. Situs ini menekankan kegunaan, responsivitas, dan performa sehingga pengunjung dan perekrut dapat dengan cepat mengevaluasi kemampuan dan navigasi ke contoh karya.",
            "Pengunjung tiba di bagian Beranda dengan headline bergaya typewriter dan bio singkat, kemudian dapat scroll atau menggunakan navigasi untuk melompat ke bagian Tentang, Keterampilan, Proyek, dan Kontak. Proyek ditampilkan sebagai kartu interaktif yang dapat diperluas atau membuka modal dengan detail dan link (kode). Keterampilan menampilkan indikator progres animasi. Formulir kontak memungkinkan pengunjung menulis pesan dengan validasi sisi klien dan umpan balik segera.",
            "Markup & styling: struktur HTML5 semantik dengan CSS modular; pola utility-first digunakan untuk layout cepat dan spacing yang konsisten.",
            "Interaktivitas: vanilla JavaScript ringan mengontrol perilaku navigasi, animasi yang dipicu scroll (intersection observer), efek typewriter, dan interaksi modal/proyek.",
            "Assets & fonts: Google Fonts untuk polish tipografi dan Font Awesome (atau ikon SVG) untuk ikon yang tajam tanpa overhead dependensi yang berat.",
            "Hosting: situs ini adalah situs statis yang siap untuk GitHub Pages, Netlify, atau platform serupa—tidak memerlukan backend untuk fungsionalitas inti.",
            "Mengutamakan waktu muat cepat melalui JS minimal dan visual ringan; menggunakan gambar responsif jika diperlukan. Menggunakan markup semantik dan focus states untuk navigasi keyboard; audit aksesibilitas lebih lanjut dan perbaikan ARIA dijadwalkan. Untuk portofolio yang sangat besar atau konten multimedia-heavy, pertimbangkan lazy-loading aset tambahan atau memindahkan demo berat ke halaman demo terpisah."
        ],
        images: [
            "assets/Projects/Website_Portofolio.png",
            "assets/Projects/Website_Portofolio_Mobile.png",
        ],
        techStack: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "Font Awesome", "Google Fonts", "GitHub Pages"],
        features: [
            "Desain futuristik/terinspirasi cyberpunk — gradien neon, efek glow, dan tipografi modern untuk identitas visual yang kuat",
            "Layout responsif — bekerja dengan lancar di breakpoint mobile, tablet, dan desktop",
            "Mikro-interaksi yang halus — animasi entrance, efek hover, dan teks hero typewriter untuk meningkatkan engagement",
            "Kartu proyek interaktif — detail hover, tombol view/code, dan reveal modal/detail untuk setiap proyek",
            "Indikator skill animasi — progress bar atau meter radial yang beranimasi masuk ke view saat scroll",
            "Formulir kontak dengan umpan balik sisi klien — validasi dan notifikasi sukses/error untuk UX langsung",
            "Aksen visual partikel/matrix opsional — efek canvas ringan untuk polish ekstra tanpa memblokir konten",
            "Berorientasi performa — reveal konten lazy, aset diminimalkan, dan arsitektur situs statis untuk page loads cepat"
        ],
    },
    project3: {
        title: "Kalkulator Matriks - Aplikasi Web Statis",
        description: [
            "Proyek ini adalah Kalkulator Matriks berbasis web statis yang diimplementasikan dengan HTML, CSS, dan JavaScript biasa, ditingkatkan dengan library math.js. Dirancang untuk siswa, instruktur, dan insinyur yang membutuhkan solusi cepat, reliable tool untuk menghitung eigenvalue/eigenvector dan melakukan beberapa faktorisasi matriks tanpa menginstal software atau memerlukan server.",
            "Pengguna dapat paste atau mengetik matriks menggunakan format teks minimal (angka dipisahkan spasi, baris dipisahkan newline) atau memilih contoh built-in. UI memvalidasi input, kemudian menjalankan metode numerik yang dipilih sepenuhnya di klien. Hasil disajikan dengan jelas: matriks yang diformat, komponen dekomposisi (L, U, P, D, dll.), eigenvector, dan pemeriksaan verifikasi yang menunjukkan matriks yang didekomposisi disusun kembali ke aslinya, membantu pengguna mengonfirmasi kebenaran.",
            "Frontend: index.html menyediakan struktur halaman dan preset contoh; styles.css mengimplementasikan desain bersih dan responsif yang dioptimalkan untuk keterbacaan dan penggunaan mobile.",
            "Komputasi: script.js berisi kelas MatrixCalculator yang menangani parsing, validasi, pemilihan algoritma, pemrosesan numerik, dan formatting hasil. math.js digunakan untuk operasi aljabar linear inti (eigs, perkalian matriks, inversi, dll.). Script juga mengimplementasikan beberapa algoritma dekomposisi klasik (Doolittle, Crout, Cholesky) dengan pesan error/warning yang membantu dan preprocessing untuk meningkatkan perilaku numerik.",
            "Deployment: Aplikasi ini statis (HTML/CSS/JS). Dapat dihosting di GitHub Pages, Netlify, atau hosting statis/CDN lainnya untuk akses publik instan.",
            "Aplikasi ini mengandalkan library numerik sisi klien (math.js). Untuk matriks yang sangat besar atau sistem yang sangat ill-conditioned, batasan floating-point browser dapat mempengaruhi hasil — UI memberikan peringatan dan mencoba preprocessing yang aman jika memungkinkan. Ditujukan untuk tugas pendidikan, prototyping, dan teknik ringan daripada aljabar linear skala produksi pada dataset besar."
        ],
        images: [
            "assets/Projects/Kalkulator_Statis.png",
            "assets/Projects/Kalkulator_Statis_Fitur_Contoh.png",
            "assets/Projects/Kalkulator_Statis_Fitur.png",
            "assets/Projects/Kalkulator_Statis_Hasil.png"
        ],
        techStack: ["HTML5", "CSS3", "JavaScript (Vanilla) + math.js", "GitHub Pages"],
        features: [
            "Metode matriks berganda — eigenvalue & eigenvector, diagonalisasi, dekomposisi LU, Cholesky, Doolittle, dan Crout",
            "Input teks-ke-matriks — paste atau ketik matriks dengan elemen dipisahkan spasi dan baris dipisahkan newline; preset contoh disertakan",
            "Validasi & preprocessing sisi klien — memeriksa kondisi square/symmetric/positive-definite dan menerapkan preprocessing yang aman (simetrisasi / penyesuaian diagonal kecil) bila diperlukan",
            "Output numerik yang mudah dibaca — matriks yang diformat dengan baik, eigenvalue dan blok verifikasi (mis., P × D × P⁻¹, L × U)",
            "UX yang ramah pengguna — layout responsif, output matriks monospace, hasil in-place dengan pesan sukses/error/warning",
            "Tidak memerlukan back-end — sepenuhnya statis, mudah dihosting di GitHub Pages atau host statis lainnya",
            "Penanganan numerik yang robust — menggunakan math.js untuk rutinitas numerik inti dan menyertakan fallback/pemeriksaan ekstra untuk stabilitas numerik"
        ],
    },
    project4: {
        title: "Kalkulator Matriks Streamlit",
        description: [
            "Kalkulator Matriks Streamlit ini adalah aplikasi Python interaktif yang menyederhanakan analisis matriks untuk mahasiswa dan insinyur. Menyediakan antarmuka web yang ramah untuk menghitung eigenvalue/eigenvector, melakukan diagonalisasi, dan menjalankan faktorisasi matriks berganda (LU, Cholesky, Doolittle, Crout) menggunakan library numerik yang andal. Aplikasi ini ditujukan sebagai tool pendidikan dan demonstrasi yang berjalan secara lokal atau di host yang kompatibel dengan Streamlit.",
            "Pengguna paste atau mengetik matriks di area teks biasa (angka dipisahkan spasi, baris dipisahkan newline). Mereka memilih metode yang diinginkan dari dropdown dan menekan satu tombol untuk menjalankan perhitungan. Aplikasi menampilkan matriks asli (dan jika berlaku, yang sudah dipreproses), komponen dekomposisi (P, L, U, D, P⁻¹, dll.), dan pemeriksaan komposisi (mis., L × U atau P × D × P⁻¹) sehingga pengguna dapat memverifikasi hasil segera. Pesan informatif muncul pada kesalahan input atau kegagalan numerik.",
            "Frontend / UI (Streamlit): apps.py menggunakan widget Streamlit (st.text_area, st.selectbox, st.button, st.write) untuk membangun antarmuka dan alur kontrol. Aplikasi mengorganisir cabang komputasi per metode yang dipilih dan mencetak hasil dalam matriks dan header yang mudah dibaca.",
            "Komputasi (NumPy / SciPy): parsing matriks menggunakan konversi numpy.array; komputasi eigen dan diagonalisasi menggunakan numpy.linalg.eig; dekomposisi LU menggunakan scipy.linalg.lu; Cholesky menggunakan numpy.linalg.cholesky. Beberapa implementasi kustom (Doolittle, Crout) diimplementasikan langsung dalam Python untuk kejelasan pedagogis.",
            "Preprocessing & pemeriksaan: fungsi menguji ke-squareness-an, simetri, dan positive-definiteness. Untuk Cholesky, matriks non-simetris disimetrisasi dan matriks non-positive-definite didorong dengan menambahkan offset diagonal kecil untuk memastikan stabilitas sebelum mencoba dekomposisi.",
            "Menggunakan rutinitas NumPy/SciPy presisi ganda; akurat untuk matriks ukuran sedang yang khas dalam kursus dan demonstrasi. Untuk matriks yang sangat besar atau masalah yang sangat ill-conditioned, komputasi berkinerja tinggi tanpa browser (atau library presisi arbitrer sisi server) direkomendasikan. Aplikasi menyertakan preprocessing dan memperingatkan pengguna ketika metode kemungkinan akan gagal."
        ],
        images: [
            "assets/Projects/Kalkulator_Python.png",
            "assets/Projects/Kalkulator_Python_Fitur.png",
            "assets/Projects/Kalkulator_Python_Hasil.png"
        ],
        techStack: ["Python", "Streamlit", "NumPy", "SciPy", "Plain-text matrix I/O"],
        features: [
            "UI Streamlit Interaktif — area input sederhana dan kontrol untuk memilih metode matriks dan menjalankan komputasi dengan satu klik",
            "Metode dekomposisi & analisis berganda — eigenvalue & eigenvector, diagonalisasi, LU (dengan permutasi), Cholesky, Doolittle, dan Crout",
            "Pengalaman seperti klien (interaktif) dalam Python — tampilan langsung input, matriks yang diproses, faktor (L, U, P, D, P⁻¹), dan blok verifikasi (mis., L × U)",
            "Preprocessing untuk stabilitas numerik — rutinitas auto-symmetrize dan penyesuaian diagonal kecil untuk Cholesky dan pemeriksaan positive-definiteness",
            "Library numerik yang robust — menggunakan NumPy untuk operasi array dan SciPy untuk dekomposisi LU (matriks permutasi P disertakan)",
            "Penanganan error yang ramah pengguna — pesan error atau warning informatif ketika dekomposisi gagal atau input tidak valid (non-square, singular, dll.)",
            "Demo zero-devops — jalankan secara lokal dengan streamlit run apps.py menggunakan requirements.txt yang disediakan"
        ],
    },
    project5: {
        title: "Website Portofolio (Beta)",
        description: [
            "Portfolio Website (Beta) adalah website personal statis yang dibangun sebagai latihan praktis saat mempelajari HTML dan CSS. Website ini mendemonstrasikan dasar-dasar front-end, antara lain struktur HTML semantik, layout responsif dengan Bootstrap, CSS modular untuk spacing dan warna, serta peningkatan JavaScript kecil untuk interaktivitas dan animasi. Ini dirancang sebagai portofolio untuk menyajikan bio singkat, proyek contoh, dan formulir kontak.",
            "Pengunjung mendarat di bagian hero (jumbotron) dengan foto profil dan headline, scroll untuk membaca detail About, memeriksa kartu proyek di bagian Projects, dan mengirim pesan melalui formulir Contact. Polish visual ditambahkan dengan animasi AOS yang dipicu scroll dan subtitle animasi yang didorong GSAP untuk membuat antarmuka terasa lebih dinamis. Pengiriman kontak yang berhasil memicu alert yang terlihat dan mereset formulir.",
            "Markup & layout: dibangun dengan komponen HTML5 dan Bootstrap 5 (navbar responsif, container/rows/cols, dan komponen kartu untuk proyek).",
            "Styling: style.css yang ringkas mengontrol spacing bagian, warna latar belakang, dan gaya footer untuk menjaga gaya mudah dibaca dan dimodifikasi saat Anda belajar.",
            "Interaktivitas: vanilla JS menangani submit formulir melalui fetch() ke endpoint Google Apps Script, toggle loading/success states, dan menginisialisasi AOS. GSAP (dengan TextPlugin) menganimasikan teks hero dan menambahkan efek entrance untuk elemen kunci.",
            "Dukungan aksesibilitas dan ARIA saat ini dapat ditingkatkan (misalnya, focus states, aria-labels, dan validasi formulir). Iterasi selanjutnya dapat menambahkan gambar lazy-loaded, unduhan resume, modal detail proyek, atau CMS sederhana untuk pembaruan konten yang lebih mudah."
        ],
        images: [
            "assets/Projects/Portfolio_Website(Beta).png",
            "assets/Projects/Portfolio_Website(Beta)_Mobile.png"
        ],
        techStack: ["HTML5", "CSS3", "Bootstrap 5", "JavaScript (Vanilla)", "AOS", "GSAP (Text-plugin)"],
        features: [
            "Build yang fokus pada pembelajaran — dibuat sebagai latihan praktis untuk mempraktikkan dasar-dasar HTML dan CSS sambil menerapkan komponen Bootstrap",
            "Layout responsif — navbar mobile-first dan grid Bootstrap memastikan situs beradaptasi di berbagai ukuran layar",
            "Bagian Home / jumbotron — foto profil, headline nama yang besar, dan subtitle animasi yang didukung oleh GSAP TextPlugin",
            "Bagian modular — area About, Projects (galeri kartu), dan Contact yang berbeda untuk navigasi yang jelas dan penemuan konten",
            "Animasi scroll & entrance — AOS menyediakan reveal animasi untuk kartu dan teks untuk meningkatkan kesan polish",
            "Formulir kontak dengan integrasi Google Apps Script — penanganan formulir sisi klien mengirim pesan ke endpoint Google Apps Script dan menampilkan feedback sukses",
            "CSS yang sederhana dan mudah dipelihara — stylesheet yang pendek dan terfokus untuk spacing bagian dan aksen warna (latihan dalam menyusun gaya)",
            "Ramah hosting statis — tidak memerlukan backend (sempurna untuk demo GitHub Pages / Netlify)"
        ],
    },
    project6: {
        title: "Simulasi Pengering Tangan Otomatis",
        description: [
            "Simulasi Pengering Tangan Otomatis adalah prototipe pengering tangan tanpa sentuhan yang diimplementasikan dan diverifikasi di Proteus. Proyek ini menggabungkan program mikrokontroler tertanam (assembly .a51) dengan skematik Proteus untuk mensimulasikan perangkat elektromekanikal dunia nyata: sistem ini mendeteksi tangan pengguna, mengaktifkan kipas angin untuk interval yang terkontrol, menunjukkan indikator status, dan menerapkan batas waktu keselamatan sederhana.",
            "Ketika pengguna menempatkan tangan dalam jangkauan sensor, output sensor dibaca oleh mikrokontroler. Firmware melakukan debounce input, memulai timer pengeringan, dan memberikan energi ke driver motor. LED (atau LCD) memberikan umpan balik segera. Setelah timer berakhir, sistem mematikan motor dan kembali ke idle. Jika terjadi kesalahan atau kondisi tak terduga (mis., pemicu sensor berkelanjutan melebihi batas keamanan), firmware menghentikan motor dan menampilkan error/status.",
            "Firmware: ditulis dalam assembly 8051 (sumber .a51) yang menargetkan perangkat keluarga 8051 standar; mengimplementasikan polling I/O atau penginderaan berbasis interrupt, rutinitas timer untuk durasi pengeringan, dan kontrol output untuk driver motor dan indikator.",
            "Skematik & simulasi: skematik Proteus memodelkan mikrokontroler, sensor (IR/PIR), switch daya (relay/MOSFET), motor (model motor DC), dan LED/LCD status. Instrumen virtual (osiloskop, logic analyzer) digunakan untuk verifikasi dan debugging.",
            "Pendekatan pengujian: menjalankan simulasi Proteus dengan HEX yang sudah dirakit dimuat ke mikrokontroler; memeriksa bentuk gelombang sinyal, memvalidasi timing, dan melakukan iterasi pada timing/logika firmware.",
            "Implementasi saat ini adalah simulasi/prototipe — hardware nyata memperkenalkan pertimbangan daya, termal, EMC, dan mekanik. Langkah selanjutnya: prototipe pada hardware nyata (devboard + driver), menambahkan kontrol kecepatan motor closed-loop, mengimplementasikan monitoring suhu, dan menyertakan mode hemat energi atau pengaturan yang dapat dikonfigurasi pengguna."
        ],
        images: [
            "assets/Projects/Rangkaian_HandDryer.png",
            "assets/Projects/SourceCode_HandDryer.png"
        ],
        techStack: ["Proteus", "8051 (Keil .a51 assembly)", "Virtual instruments", "Basic electromechanical components"],
        features: [
            "Deteksi & aktivasi otomatis — input sensor memicu switch-on otomatis pengering ketika tangan terdeteksi",
            "Siklus pengeringan terbatas waktu — firmware mengelola timer yang dapat disesuaikan untuk menjalankan kipas selama durasi tetap setelah deteksi",
            "Kontrol daya motor — mikrokontroler menggerakkan driver simulasi (relay atau MOSFET) untuk memberikan energi ke kipas; termasuk soft-start sederhana atau PWM tetap (tergantung implementasi)",
            "Indikator status — LED (atau LCD opsional) menampilkan status operasional: idle, drying, fault",
            "Keamanan & penanganan fault — interlock dasar dalam firmware untuk menghindari operasi runaway (mis., timeout maksimum-run, debounce sensor)",
            "Testbench siap Proteus — skematik dan kode lengkap memungkinkan simulasi step-through, inspeksi bentuk gelombang, dan verifikasi perilaku menggunakan instrumen virtual Proteus",
            "Firmware tingkat assembly — program assembly .a51 yang kecil dan efisien cocok untuk mengajar konsep embedded (interrupts/polling, I/O, timer)"
        ],
    },
    project7: {
        title: "Simulasi Sistem Parkir Otomatis",
        description: [
            "Proyek Sistem Parkir Otomatis adalah prototipe simulasi Proteus yang mendemonstrasikan kontrol embedded inti untuk fasilitas parkir kecil. Firmware ditulis dalam assembly 8051 (.a51) dan mengontrol penginderaan, aktuasi barrier, penghitungan okupansi, dan indikator yang menghadap pengguna. Pendekatan berbasis simulasi memungkinkan verifikasi logika kontrol dan timing tanpa hardware langsung.",
            "Sensor pendeteksi (input IR/ultrasonik/loop tersimulasi) memberikan sinyal kedatangan kendaraan. Kontroler melakukan debounce sinyal, memeriksa okupansi saat ini, menggerakkan barrier untuk memungkinkan lewat (buka → tunggu → tutup), memperbarui counter okupansi, dan menampilkan status (mis., slot tersedia / penuh). Event keluar mengurangi counter. Jika terjadi fault atau kondisi tidak biasa (mis., aktuator berjalan melampaui waktu aman), firmware memicu state safe-fail dan memberitahu melalui indikator.",
            "Firmware: assembly 8051 mengimplementasikan state machine ringan, debouncing input, sekuens aktuator yang didorong timer, dan rutinitas display/update untuk okupansi.",
            "Simulasi: skematik Proteus memodelkan sensor, driver aktuator (relay/MOSFET atau servo), modul display, dan menyediakan instrumen virtual untuk step debugging. File .hex yang diproduksi oleh Keil dimuat ke model MCU untuk pengujian runtime.",
            "Testing & iterasi: log osiloskop virtual dan logic analyzer membantu menyetel jendela debounce dan nilai timeout; build firmware iteratif dimuat ulang ke Proteus untuk memvalidasi pembaruan.",
            "Ini adalah prototipe simulasi/prototipe — hardware fisik memperkenalkan pertimbangan daya, termal, EMC, dan mekanik. Langkah selanjutnya: prototipe pada hardware nyata (devboard + driver), menambahkan kontrol kecepatan motor closed-loop, mengimplementasikan monitoring suhu, atau menghasilkan prototipe hardware dengan PCB dan sensor/drive stage nyata."
        ],
        images: [
            "assets/Projects/Rangkaian_ParkirOtomatis.png",
            "assets/Projects/SourceCode_ParkirOtomatis.png"
        ],
        techStack: ["Proteus", "8051 (Keil .a51 assembly)", "Common simulated components"],
        features: [
            "Deteksi kendaraan & penanganan event — sensor tersimulasi memicu event masuk/keluar dengan logika debounce",
            "Kontrol gate/barrier — sekuens aktuator yang dikelola mikrokontroler (buka → tunggu → tutup) dengan interlock keamanan",
            "Pelacakan okupansi — counter increment/decrement real-time untuk slot parkir yang tersedia dan penegakan kapasitas",
            "Umpan balik pengguna — status ditampilkan melalui LED, counter 7-segment atau pesan LCD opsional (tersedia/penuh/error)",
            "Logika akses & state machine — sekuensing masuk/keluar yang robust, anti-bounce, dan pemeriksaan akses dasar",
            "Keamanan/timeout — runtime aktuator maksimum yang dapat dikonfigurasi dan penanganan fault otomatis untuk mencegah state stuck",
            "Testbench & debugging Proteus — instrumen virtual untuk inspeksi waveform/state, memungkinkan pengujian berulang sebelum hardware",
            "Kode assembly didaktik — firmware .a51 yang kompak mengilustrasikan topik embedded tingkat rendah: timer, I/O, dan finite-state machine"
        ],
    },
    project8: {
        title: "Deteksi Objek YOLOv5 di ROS2",
        description: [
            "Proyek ini mengimplementasikan sistem deteksi objek YOLOv5 yang terintegrasi dengan ROS2 yang dirancang untuk tugas persepsi robotika real-time. Dibangun menggunakan rclpy, OpenCV, dan PyTorch, sistem ini terdiri dari dua node utama:",
            "✅Node Publisher Gambar — menangkap frame dari webcam atau input video dan mempublikasikannya sebagai pesan gambar ROS2.",
            "✅Node Detektor YOLOv5 — berlangganan topik gambar, melakukan preprocessing frame, menjalankan inferensi YOLOv5, dan menampilkan hasil deteksi (bounding box, label kelas, dan nilai kepercayaan).",
            "Sistem ini mendukung pemuatan model dinamis, akselerasi GPU, dan pemeriksaan stabilitas. Hasil ditampilkan dalam jendela visualisasi OpenCV, dengan monitoring FPS untuk mengevaluasi kinerja.",
            "Setup ini sangat berharga dalam penelitian robotika, navigasi otonom, dan interaksi manusia-robot, karena menyediakan komponen persepsi modular plug-and-play dalam ekosistem ROS2. Penggunaan YOLOv5 memastikan akurasi deteksi tinggi di berbagai kelas objek, sementara integrasi ROS2 menjamin interoperabilitas dengan stack perangkat lunak robotika lainnya."
        ],
        images: [
            "assets/Projects/YOLOv5.jpg",
            "assets/Projects/YOLOv5.mp4"
        ],
        techStack: ["ROS2", "rclpy", "YOLOv5", "PyTorch", "OpenCV", "CvBridge", "NumPy", "Utilitas SciPy"],
        features: [
            "Arsitektur Node ROS2 — node publisher dan detektor modular (image_publisher_node, yolov5_detector_node) untuk integrasi yang bersih dalam pipeline robotika",
            "Deteksi Objek Real-time — model YOLOv5 dimuat melalui PyTorch dengan dukungan GPU/CPU, menjalankan inferensi langsung pada frame kamera",
            "Pemuatan Model Fleksibel — pencarian otomatis file weights (.pt) di direktori src lokal atau share package ROS2, memastikan deployment yang lancar",
            "Visualisasi Interaktif — tampilan OpenCV dengan bounding box, label, dan skor kepercayaan yang dioverlay pada objek yang terdeteksi",
            "Monitoring Kinerja — overlay frame rate (FPS) untuk pelacakan kinerja real-time",
            "Penanganan Error & Logging — log informatif untuk weights yang hilang, error akses kamera, atau deteksi yang tidak valid",
            "Siap Ekosistem ROS2 — mempublikasikan dan berlangganan topik sensor_msgs/Image, membuatnya kompatibel dengan node ROS2 lainnya (navigasi, SLAM, dll.)"
        ],
    },
    project9: {
        title: "Deteksi Objek YOLOv12 di ROS2",
        description: [
            "Proyek ini menyediakan sistem deteksi objek YOLOv12 yang terintegrasi dengan ROS2, memanfaatkan model YOLOv12 terbaru dari Ultralytics untuk persepsi real-time yang akurat dan efisien. Dirancang sebagai node ROS2 standalone (yolov12_detector_node), ia menangkap video dari webcam atau file, menjalankan inferensi, dan mempublikasikan hasil teranotasi ke jaringan ROS2.",
            "Node ini dapat dikonfigurasi melalui parameter ROS2: pengguna dapat menentukan sumber video, file weights YOLOv12, ukuran gambar, dan ambang batas kepercayaan deteksi. Objek yang terdeteksi divisualisasikan dengan bounding box, label kelas, dan skor kepercayaan yang dioverlay pada frame. Node juga menghitung dan menampilkan FPS real-time untuk pelacakan kinerja.",
            "Hasil dipublikasikan ke topik ROS2 detection_output, memungkinkan modul downstream (mis. navigasi, pelacakan, atau manipulasi) untuk berlangganan dan memanfaatkan data deteksi objek. Penggunaan Ultralytics YOLOv12 memastikan akurasi dan kecepatan deteksi modern, sementara ekosistem ROS2 menyediakan modularitas dan interoperabilitas.",
            "Sistem ini sangat berharga untuk penelitian robotika, sistem otonom, dan pendidikan, karena menghubungkan computer vision state-of-the-art dengan middleware ROS2 dalam paket yang ringan dan dapat di-deploy."
        ],
        images: [
            "assets/Projects/YOLOv12.jpg",
            "assets/Projects/YOLOv12.mp4"
        ],
        techStack: ["ROS2", "rclpy", "YOLOv12", "Ultralytics", "OpenCV", "CvBridge", "NumPy", "Torch (melalui Ultralytics)"],
        features: [
            "Arsitektur Node ROS2 — diimplementasikan sebagai node deteksi khusus (yolov12_detector_node) untuk integrasi yang mulus dengan package ROS2 lainnya",
            "Inferensi Model YOLOv12 — memuat weights YOLOv12 yang sudah dilatih (bestv12.pt) dan melakukan deteksi yang cepat dan akurat dengan bounding box dan label kelas",
            "Parameter yang Dapat Dikonfigurasi — parameter runtime untuk sumber input (webcam/video), ambang batas kepercayaan, ukuran gambar, dan path weights",
            "Visualisasi Real-time — jendela OpenCV menampilkan deteksi teranotasi dengan label kelas dan overlay FPS untuk monitoring kinerja",
            "Publishing Gambar ROS2 — hasil deteksi teranotasi dipublikasikan sebagai sensor_msgs/Image ke topik ROS2 (detection_output) untuk modul robotika downstream",
            "Umpan Balik Kinerja — perhitungan FPS ditampilkan langsung pada frame output untuk memantau throughput sistem",
            "Penanganan Error & Logging — log informatif untuk pemuatan model, error sumber video, dan masalah runtime"
        ],
    }
};

// Project modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('project-modal');
    const lightboxModal = document.getElementById('image-lightbox');
    const closeModalBtn = document.getElementById('close-modal');
    const closeProjectModalBtn = document.getElementById('close-project-modal');
    const closeLightboxBtn = document.getElementById('close-lightbox');
    const viewProjectBtns = document.querySelectorAll('.view-project-btn');

    // Open modal when view button is clicked
    viewProjectBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            const projectId = this.getAttribute('data-project');
            openProjectModal(projectId);
        });
    });

    // Add click event to project cards for opening modal
    document.querySelectorAll('.view-project-area').forEach(card => {
        card.addEventListener('click', function(e) {
            // Only trigger if the click wasn't on a button
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const projectId = this.getAttribute('data-project');
                openProjectModal(projectId);
            }
        });
    });

    // Close modal
    closeModalBtn.addEventListener('click', closeProjectModal);
    closeProjectModalBtn.addEventListener('click', closeProjectModal);
    closeLightboxBtn.addEventListener('click', closeLightbox);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeProjectModal();
        }
    });

    // Close lightbox when clicking outside
    lightboxModal.addEventListener('click', function(e) {
        if (e.target === lightboxModal) {
            closeLightbox();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            if (!lightboxModal.classList.contains('hidden')) {
                closeLightbox();
            } else if (!modal.classList.contains('hidden')) {
                closeProjectModal();
            }
        }
    });

    function openProjectModal(projectId) {
        const project = projectsData[projectId];
        if (!project) return;

        // Update modal content
        document.getElementById('modal-title').textContent = project.title;
        
        // Update project gallery
        const gallery = document.getElementById('project-gallery').querySelector('.grid');
        gallery.innerHTML = '';
        project.images.forEach((media, index) => {
            const mediaDiv = document.createElement('div');
            mediaDiv.className = 'relative group cursor-pointer';
            
            // Check if the file is a video
            const isVideo = media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.webm') || media.toLowerCase().endsWith('.mov');
            
            if (isVideo) {
                mediaDiv.innerHTML = `
                    <video class="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" muted loop>
                        <source src="${media}" type="video/mp4">
                        Browser Anda tidak mendukung tag video.
                    </video>
                    <div class="w-full h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-lg flex items-center justify-center" style="display: none;">
                        <i class="fas fa-video text-4xl text-cyber-blue"></i>
                    </div>
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <div class="text-center">
                            <i class="fas fa-play text-2xl text-white mb-1"></i>
                            <p class="text-white text-sm">Putar Video</p>
                        </div>
                    </div>
                `;
                
                // Add hover effect to play video preview
                const video = mediaDiv.querySelector('video');
                mediaDiv.addEventListener('mouseenter', function() {
                    video.play();
                });
                mediaDiv.addEventListener('mouseleave', function() {
                    video.pause();
                    video.currentTime = 0;
                });
                
                // Add click event for video lightbox
                mediaDiv.addEventListener('click', function() {
                    openVideoLightbox(media, `${project.title} - Video ${index + 1}`);
                });
            } else {
                mediaDiv.innerHTML = `
                    <img src="${media}" alt="${project.title} - Image ${index + 1}" 
                         class="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="w-full h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-lg flex items-center justify-center" style="display: none;">
                        <i class="fas fa-image text-4xl text-cyber-blue"></i>
                    </div>
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                        <i class="fas fa-search-plus text-2xl text-white"></i>
                    </div>
                `;
                
                // Add click event for image lightbox
                mediaDiv.addEventListener('click', function() {
                    openLightbox(media, `${project.title} - Image ${index + 1}`);
                });
            }
            
            gallery.appendChild(mediaDiv);
        });

        // Update description
        const description = document.getElementById('project-description');
        description.innerHTML = '';
        project.description.forEach(paragraph => {
            const p = document.createElement('p');
            p.textContent = paragraph;
            description.appendChild(p);
        });

        // Update tech stack
        const techStack = document.getElementById('project-tech-stack');
        techStack.innerHTML = '';
        project.techStack.forEach(tech => {
            const span = document.createElement('span');
            span.className = 'px-3 py-1 bg-cyber-blue/20 text-cyber-blue rounded-full text-sm';
            span.textContent = tech;
            techStack.appendChild(span);
        });

        // Update features
        const features = document.getElementById('project-features');
        features.innerHTML = '';
        project.features.forEach(feature => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="fas fa-check text-cyber-blue mr-2"></i>${feature}`;
            features.appendChild(li);
        });

        // Show modal
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        
        // Reset scroll position to top
        const modalContent = modal.querySelector('.overflow-y-auto');
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
        
        // Alternative method to ensure scroll reset
        setTimeout(() => {
            if (modalContent) {
                modalContent.scrollTop = 0;
            }
        }, 50);
    }

    function closeProjectModal() {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }

    function openLightbox(imageSrc, caption) {
        const lightboxModal = document.getElementById('image-lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        // Hide video container if exists
        const videoContainer = lightboxModal.querySelector('.video-container');
        if (videoContainer) {
            videoContainer.style.display = 'none';
        }
        
        // Show image container
        lightboxImage.style.display = 'block';
        lightboxImage.src = imageSrc;
        lightboxCaption.textContent = caption;
        lightboxModal.classList.remove('hidden');
    }

    function openVideoLightbox(videoSrc, caption) {
        const lightboxModal = document.getElementById('image-lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxCaption = document.getElementById('lightbox-caption');
        
        // Hide image
        lightboxImage.style.display = 'none';
        
        // Create or update video container
        let videoContainer = lightboxModal.querySelector('.video-container');
        if (!videoContainer) {
            videoContainer = document.createElement('div');
            videoContainer.className = 'video-container w-full max-h-[80vh] flex items-center justify-center';
            videoContainer.innerHTML = `
                <video class="w-full h-auto max-h-[80vh] object-contain rounded-lg" controls autoplay>
                    <source src="" type="video/mp4">
                    Browser Anda tidak mendukung tag video.
                </video>
            `;
            lightboxImage.parentNode.insertBefore(videoContainer, lightboxImage);
        }
        
        // Update video source and show container
        const video = videoContainer.querySelector('video');
        video.querySelector('source').src = videoSrc;
        video.load(); // Reload the video with new source
        videoContainer.style.display = 'flex';
        
        lightboxCaption.textContent = caption;
        lightboxModal.classList.remove('hidden');
    }

    function closeLightbox() {
        const lightboxModal = document.getElementById('image-lightbox');
        
        // Stop video if playing
        const videoContainer = lightboxModal.querySelector('.video-container');
        if (videoContainer) {
            const video = videoContainer.querySelector('video');
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        }
        
        lightboxModal.classList.add('hidden');
    }
});

// Function to setup event listeners for additional projects
function setupAdditionalProjectListeners() {
    const additionalProjectAreas = document.querySelectorAll('#additional-projects .view-project-area');
    
    additionalProjectAreas.forEach(card => {
        // Remove existing listeners to avoid duplicates
        card.removeEventListener('click', handleProjectAreaClick);
        // Add new listener
        card.addEventListener('click', handleProjectAreaClick);
    });
}

// Separate function for handling project area clicks
function handleProjectAreaClick(e) {
    // Only trigger if the click wasn't on a button
    if (!e.target.closest('button') && !e.target.closest('a')) {
        const projectId = this.getAttribute('data-project');
        // Get the modal elements directly since we're outside the DOMContentLoaded scope
        const modal = document.getElementById('project-modal');
        if (modal && projectsData[projectId]) {
            openProjectModalExternal(projectId);
        }
    }
}

// External version of openProjectModal that can be called from outside DOMContentLoaded
function openProjectModalExternal(projectId) {
    const project = projectsData[projectId];
    if (!project) return;

    const modal = document.getElementById('project-modal');
    
    // Update modal content
    document.getElementById('modal-title').textContent = project.title;
    
    // Update project gallery
    const gallery = document.getElementById('project-gallery').querySelector('.grid');
    gallery.innerHTML = '';
    project.images.forEach((media, index) => {
        const mediaDiv = document.createElement('div');
        mediaDiv.className = 'relative group cursor-pointer';
        
        // Check if the file is a video
        const isVideo = media.toLowerCase().endsWith('.mp4') || media.toLowerCase().endsWith('.webm') || media.toLowerCase().endsWith('.mov');
        
        if (isVideo) {
            mediaDiv.innerHTML = `
                <video class="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300" muted loop>
                    <source src="${media}" type="video/mp4">
                    Browser Anda tidak mendukung tag video.
                </video>
                <div class="w-full h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-lg flex items-center justify-center" style="display: none;">
                    <i class="fas fa-video text-4xl text-cyber-blue"></i>
                </div>
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <div class="text-center">
                        <i class="fas fa-play text-2xl text-white mb-1"></i>
                        <p class="text-white text-sm">Putar Video</p>
                    </div>
                </div>
            `;
            
            // Add hover effect to play video preview
            const video = mediaDiv.querySelector('video');
            mediaDiv.addEventListener('mouseenter', function() {
                video.play();
            });
            mediaDiv.addEventListener('mouseleave', function() {
                video.pause();
                video.currentTime = 0;
            });
            
            // Add click event for video lightbox
            mediaDiv.addEventListener('click', function() {
                openVideoLightboxExternal(media, `${project.title} - Video ${index + 1}`);
            });
        } else {
            mediaDiv.innerHTML = `
                <img src="${media}" alt="${project.title} - Image ${index + 1}" 
                     class="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                     onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="w-full h-48 bg-gradient-to-br from-cyber-blue/20 to-cyber-purple/20 rounded-lg flex items-center justify-center" style="display: none;">
                    <i class="fas fa-image text-4xl text-cyber-blue"></i>
                </div>
                <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                    <i class="fas fa-search-plus text-2xl text-white"></i>
                </div>
            `;
            
            // Add click event for image lightbox
            mediaDiv.addEventListener('click', function() {
                openLightboxExternal(media, `${project.title} - Image ${index + 1}`);
            });
        }
        
        gallery.appendChild(mediaDiv);
    });

    // Update description
    const description = document.getElementById('project-description');
    description.innerHTML = '';
    project.description.forEach(paragraph => {
        const p = document.createElement('p');
        p.textContent = paragraph;
        description.appendChild(p);
    });

    // Update tech stack
    const techStack = document.getElementById('project-tech-stack');
    techStack.innerHTML = '';
    project.techStack.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'px-3 py-1 bg-cyber-blue/20 text-cyber-blue rounded-full text-sm';
        span.textContent = tech;
        techStack.appendChild(span);
    });

    // Update features
    const features = document.getElementById('project-features');
    features.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check text-cyber-blue mr-2"></i>${feature}`;
        features.appendChild(li);
    });

    // Show modal
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    
    // Reset scroll position to top
    const modalContent = modal.querySelector('.overflow-y-auto');
    if (modalContent) {
        modalContent.scrollTop = 0;
    }
    
    // Alternative method to ensure scroll reset
    setTimeout(() => {
        if (modalContent) {
            modalContent.scrollTop = 0;
        }
    }, 50);
}

// External version of openLightbox
function openLightboxExternal(imageSrc, caption) {
    const lightboxModal = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Hide video container if exists
    const videoContainer = lightboxModal.querySelector('.video-container');
    if (videoContainer) {
        videoContainer.style.display = 'none';
    }
    
    // Show image container
    lightboxImage.style.display = 'block';
    lightboxImage.src = imageSrc;
    lightboxCaption.textContent = caption;
    lightboxModal.classList.remove('hidden');
}

// External version of openVideoLightbox
function openVideoLightboxExternal(videoSrc, caption) {
    const lightboxModal = document.getElementById('image-lightbox');
    const lightboxImage = document.getElementById('lightbox-image');
    const lightboxCaption = document.getElementById('lightbox-caption');
    
    // Hide image
    lightboxImage.style.display = 'none';
    
    // Create or update video container
    let videoContainer = lightboxModal.querySelector('.video-container');
    if (!videoContainer) {
        videoContainer = document.createElement('div');
        videoContainer.className = 'video-container w-full max-h-[80vh] flex items-center justify-center';
        videoContainer.innerHTML = `
            <video class="w-full h-auto max-h-[80vh] object-contain rounded-lg" controls autoplay>
                <source src="" type="video/mp4">
                Browser Anda tidak mendukung tag video.
            </video>
        `;
        lightboxImage.parentNode.insertBefore(videoContainer, lightboxImage);
    }
    
    // Update video source and show container
    const video = videoContainer.querySelector('video');
    video.querySelector('source').src = videoSrc;
    video.load(); // Reload the video with new source
    videoContainer.style.display = 'flex';
    
    lightboxCaption.textContent = caption;
    lightboxModal.classList.remove('hidden');
}

