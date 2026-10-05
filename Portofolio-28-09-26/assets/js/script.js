/**
 * Portfolio Script
 * 1. Navigation & Scroll Spy
 * 2. Interactive Character Mouse Tracking (9 Directions)
 */

document.addEventListener('DOMContentLoaded', () => {
    // -------------------------------------------------------------------------
    // 1. Navigation & Scroll Spy
    // -------------------------------------------------------------------------
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    // Handle click on navigation link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const targetId = link.getAttribute('href');
            if (targetId && targetId.startsWith('#')) {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    navLinks.forEach(item => item.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });

    // Update active link on scroll using IntersectionObserver
    const observerOptions = {
        root: null,
        rootMargin: '-30% 0px -60% 0px',
        threshold: 0
    };

    let hasTypedAbout = false;

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    const href = link.getAttribute('href').replace('#', '');
                    if (href === currentId) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });

                // 1. Animasi typing baru dimulai saat section #about terlihat
                // 2. Jalankan hanya satu kali
                if (currentId === 'about' && !hasTypedAbout) {
                    hasTypedAbout = true;
                    startAboutTyping();
                }
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        sectionObserver.observe(section);
    });

    // -------------------------------------------------------------------------
    // 2. Character Mouse Tracking (9 Directions)
    // -------------------------------------------------------------------------
    const characterImg = document.getElementById('hero-character');

    if (characterImg) {
        // Path ke 9 gambar arah karakter
        const characterImages = {
            'center': 'asset/image/character-center.png',
            'up': 'asset/image/character-up.png',
            'down': 'asset/image/character-down.png',
            'left': 'asset/image/character-left.png',
            'right': 'asset/image/character-right.png',
            'up-left': 'asset/image/character-up-left.png',
            'up-right': 'asset/image/character-up-right.png',
            'down-left': 'asset/image/character-down-left.png',
            'down-right': 'asset/image/character-down-right.png'
        };

        // 7. Preload semua 9 gambar agar tidak berkedip saat pergantian
        const preloadedImages = {};
        Object.entries(characterImages).forEach(([direction, path]) => {
            const img = new Image();
            img.src = path;
            preloadedImages[direction] = img;
        });

        let currentDirection = 'center';
        let animationFrameId = null;

        // 6. Threshold jarak (dead-zone) di sekitar titik tengah karakter
        const DEAD_ZONE_RADIUS = 75;

        const handleMouseMove = (e) => {
            // Optimasi performa menggunakan requestAnimationFrame
            if (animationFrameId) return;

            animationFrameId = window.requestAnimationFrame(() => {
                animationFrameId = null;

                // 1. Ambil posisi tengah karakter (area fokus wajah/mata)
                const rect = characterImg.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height * 0.36;

                // 2. Bandingkan posisi mouse dengan posisi tengah karakter
                const deltaX = e.clientX - centerX;
                const deltaY = e.clientY - centerY;
                const distance = Math.hypot(deltaX, deltaY);

                let nextDirection = 'center';

                // 4. Jika mouse berada dekat tengah (dalam radius threshold), pakai character-center.png
                if (distance > DEAD_ZONE_RADIUS) {
                    // 3. Bagi area menjadi 8 arah sudut luar + 1 tengah
                    // Sudut dalam derajat (-180 sampai 180)
                    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

                    // 5. Tentukan arah gambar berdasarkan sudut
                    if (angle >= -22.5 && angle < 22.5) {
                        nextDirection = 'right';
                    } else if (angle >= 22.5 && angle < 67.5) {
                        nextDirection = 'down-right';
                    } else if (angle >= 67.5 && angle < 112.5) {
                        nextDirection = 'down';
                    } else if (angle >= 112.5 && angle < 157.5) {
                        nextDirection = 'down-left';
                    } else if (angle >= 157.5 || angle < -157.5) {
                        nextDirection = 'left';
                    } else if (angle >= -157.5 && angle < -112.5) {
                        nextDirection = 'up-left';
                    } else if (angle >= -112.5 && angle < -67.5) {
                        nextDirection = 'up';
                    } else if (angle >= -67.5 && angle < -22.5) {
                        nextDirection = 'up-right';
                    }
                }

                // 8. Jangan menggerakkan posisi karakter. Hanya ganti src gambar.
                // 9. Hindari update src jika gambar yang dibutuhkan masih sama.
                if (nextDirection !== currentDirection) {
                    currentDirection = nextDirection;
                    const targetSrc = characterImages[nextDirection];
                    if (targetSrc) {
                        characterImg.src = targetSrc;
                    }
                }
            });
        };

        // Pasang event listener mousemove pada window
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // Kembalikan ke tengah saat mouse meninggalkan jendela browser
        document.addEventListener('mouseleave', () => {
            if (currentDirection !== 'center') {
                currentDirection = 'center';
                characterImg.src = characterImages['center'];
            }
        });
    }

    // -------------------------------------------------------------------------
    // 3. About Heading Typing Animation
    // -------------------------------------------------------------------------
    const textTarget = "Hi, I'm Lael Putriyadi";
    const typingTextEl = document.querySelector('.typing-text');
    const cursorEl = document.querySelector('.typing-cursor');

    function startAboutTyping() {
        if (!typingTextEl) return;

        let charIndex = 0;
        typingTextEl.textContent = '';

        // 3. Ketik karakter satu per satu
        // 4. Kecepatan sekitar 70-90 ms per karakter (80 ms)
        const typeInterval = setInterval(() => {
            if (charIndex < textTarget.length) {
                typingTextEl.textContent += textTarget.charAt(charIndex);
                charIndex++;
            } else {
                clearInterval(typeInterval);
                // 5. Setelah selesai, tampilkan cursor | yang berkedip
                if (cursorEl) {
                    cursorEl.classList.add('blink');
                }
            }
        }, 80);
    }

    // -------------------------------------------------------------------------
    // 4. Interactive Draggable Lanyard Physics (Mouse & Touch)
    // -------------------------------------------------------------------------
    const lanyardEl = document.querySelector('.about-lanyard');
    const lanyardImg = lanyardEl ? lanyardEl.querySelector('.lanyard-img') : null;

    if (lanyardEl) {
        // 3. Cegah native image drag / ghost image
        if (lanyardImg) {
            lanyardImg.addEventListener('dragstart', (e) => e.preventDefault());
        }

        let isDragging = false;
        let startPointerX = 0;
        let startPointerY = 0;
        let initialX = 0;
        let initialY = 0;
        let currentX = 0;
        let currentY = 0;

        let lastPointerX = 0;
        let lastPointerTime = 0;
        let currentRotation = 0;
        let targetRotation = 0;
        let animFrameId = null;

        const onPointerDown = (e) => {
            // Hanya tangani klik kiri atau sentuhan primer
            if (e.button !== undefined && e.button !== 0) return;

            isDragging = true;
            lanyardEl.setPointerCapture(e.pointerId);
            // 9. Cursor berubah dari grab menjadi grabbing
            lanyardEl.classList.add('is-dragging');
            document.body.style.userSelect = 'none';

            // Hapus transisi saat drag aktif agar responsif 1:1 tanpa jeda
            lanyardEl.style.transition = 'none';

            // 4. Saat mulai drag, simpan offset titik klik supaya gambar tidak loncat
            startPointerX = e.clientX;
            startPointerY = e.clientY;
            initialX = currentX;
            initialY = currentY;

            lastPointerX = e.clientX;
            lastPointerTime = performance.now();
            currentRotation = 0;
            targetRotation = 0;
        };

        const onPointerMove = (e) => {
            if (!isDragging) return;

            const now = performance.now();
            const dt = Math.max(1, now - lastPointerTime);
            const dx = e.clientX - lastPointerX;

            // 6. Rotasi mengikuti kecepatan horizontal mouse
            const velocityX = dx / dt; // pixel per ms
            const rawRotation = velocityX * 18;

            // 7. Batasi rotasi maksimum sekitar -30 sampai 30 derajat
            targetRotation = Math.max(-30, Math.min(30, rawRotation));

            // Haluskan rotasi dengan interpolasi
            currentRotation += (targetRotation - currentRotation) * 0.35;
            const clampedRotation = Math.max(-30, Math.min(30, currentRotation));

            // 5. Izinkan translate X dan Y
            currentX = initialX + (e.clientX - startPointerX);
            currentY = initialY + (e.clientY - startPointerY);

            lastPointerX = e.clientX;
            lastPointerTime = now;

            if (!animFrameId) {
                animFrameId = window.requestAnimationFrame(() => {
                    animFrameId = null;
                    lanyardEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotate(${clampedRotation.toFixed(2)}deg)`;
                });
            }
        };

        const onPointerUp = (e) => {
            if (!isDragging) return;
            isDragging = false;

            if (e && e.pointerId) {
                try {
                    lanyardEl.releasePointerCapture(e.pointerId);
                } catch (_) {}
            }

            // 9. Kembalikan cursor ke grab
            lanyardEl.classList.remove('is-dragging');
            document.body.style.userSelect = '';

            if (animFrameId) {
                window.cancelAnimationFrame(animFrameId);
                animFrameId = null;
            }

            // 8. Saat mouse/touch dilepas:
            // - posisi terakhir tetap (currentX & currentY disimpan)
            // - rotasi kembali ke 0 derajat
            // - gunakan easing elastic/spring-like yang halus
            lanyardEl.style.transition = 'transform 0.65s cubic-bezier(0.34, 1.56, 0.64, 1)';
            lanyardEl.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) rotate(0deg)`;

            currentRotation = 0;
            targetRotation = 0;
        };

        // 1 & 2. Dukung mouse dan touch secara unified melalui Pointer Events
        lanyardEl.addEventListener('pointerdown', onPointerDown);
        lanyardEl.addEventListener('pointermove', onPointerMove);
        lanyardEl.addEventListener('pointerup', onPointerUp);
        lanyardEl.addEventListener('pointercancel', onPointerUp);
    }

    // -------------------------------------------------------------------------
    // 5. Project Slider (Vanilla JS + CSS Scroll-Snap + scrollBy)
    // -------------------------------------------------------------------------
    const projectSlider = document.getElementById('project-slider');
    const projectPrevBtn = document.getElementById('project-prev-btn');
    const projectNextBtn = document.getElementById('project-next-btn');
    let wasJustDragging = false;

    if (projectSlider && projectPrevBtn && projectNextBtn) {
        // Hitung jarak scroll berdasarkan lebar card + gap antar card
        const getScrollDistance = () => {
            const card = projectSlider.querySelector('.project-card');
            if (!card) return projectSlider.clientWidth * 0.85;
            const style = window.getComputedStyle(projectSlider);
            const gap = parseFloat(style.gap) || 24;
            return card.offsetWidth + gap;
        };

        // Tombol Next: scroll ke kanan (atau loop ke awal jika di ujung akhir)
        projectNextBtn.addEventListener('click', () => {
            const distance = getScrollDistance();
            const maxScroll = projectSlider.scrollWidth - projectSlider.clientWidth;
            if (projectSlider.scrollLeft >= maxScroll - 15) {
                projectSlider.scrollTo({ left: 0, behavior: 'smooth' });
            } else {
                projectSlider.scrollBy({ left: distance, behavior: 'smooth' });
            }
        });

        // Tombol Prev: scroll ke kiri (atau loop ke ujung jika di awal)
        projectPrevBtn.addEventListener('click', () => {
            const distance = getScrollDistance();
            if (projectSlider.scrollLeft <= 15) {
                const maxScroll = projectSlider.scrollWidth - projectSlider.clientWidth;
                projectSlider.scrollTo({ left: maxScroll, behavior: 'smooth' });
            } else {
                projectSlider.scrollBy({ left: -distance, behavior: 'smooth' });
            }
        });

        // Navigasi Keyboard (Panah Kiri dan Panah Kanan)
        projectSlider.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                projectNextBtn.click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                projectPrevBtn.click();
            }
        });

        // Mouse Drag-to-Scroll untuk Desktop
        let isMouseDown = false;
        let startX = 0;
        let startScrollLeft = 0;
        let hasDragged = false;

        projectSlider.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Hanya klik kiri
            isMouseDown = true;
            hasDragged = false;
            startX = e.pageX;
            startScrollLeft = projectSlider.scrollLeft;
            projectSlider.style.cursor = 'grabbing';
            projectSlider.style.userSelect = 'none';
        });

        window.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            const deltaX = e.pageX - startX;
            if (Math.abs(deltaX) > 6) {
                hasDragged = true;
                // Lepas snap sementara saat digeser mouse agar fluid 1:1
                projectSlider.style.scrollSnapType = 'none';
                projectSlider.scrollLeft = startScrollLeft - deltaX;
            }
        });

        const stopMouseDrag = () => {
            if (!isMouseDown) return;
            isMouseDown = false;
            projectSlider.style.cursor = '';
            projectSlider.style.removeProperty('user-select');
            // Kembalikan CSS scroll-snap agar otomatis snap ke posisi card terdekat
            projectSlider.style.scrollSnapType = 'x mandatory';
            if (hasDragged) {
                wasJustDragging = true;
                setTimeout(() => {
                    wasJustDragging = false;
                }, 120);
            }
        };

        window.addEventListener('mouseup', stopMouseDrag);
    }

    // -------------------------------------------------------------------------
    // 6. Project Preview Modal Popup
    // -------------------------------------------------------------------------
    const projectModal = document.getElementById('project-modal');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalImgWrapper = document.getElementById('modal-img-wrapper');
    const modalNumber = document.getElementById('modal-number');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const projectImgBoxes = document.querySelectorAll('.project-card .project-img-box');

    let activeModalTrigger = null;

    const openProjectModal = (imgBox) => {
        if (!projectModal) return;
        const card = imgBox.closest('.project-card');
        if (!card) return;

        activeModalTrigger = imgBox;

        const numText = card.querySelector('.project-number')?.textContent.trim() || '';
        const titleText = card.querySelector('.project-name')?.textContent.trim() || '';
        const catText = card.querySelector('.project-category')?.textContent.trim() || '';
        const iconEl = imgBox.querySelector('.project-icon');
        const imgEl = imgBox.querySelector('img');

        if (modalNumber) modalNumber.textContent = numText;
        if (modalTitle) modalTitle.textContent = titleText;
        if (modalCategory) modalCategory.textContent = catText;

        if (modalImgWrapper) {
            modalImgWrapper.innerHTML = '';
            if (imgEl) {
                const newImg = document.createElement('img');
                newImg.src = imgEl.src;
                newImg.alt = imgEl.alt || titleText;
                modalImgWrapper.appendChild(newImg);
            } else if (iconEl) {
                const newIcon = document.createElement('i');
                newIcon.className = iconEl.className;
                newIcon.classList.remove('project-icon');
                newIcon.classList.add('modal-large-icon');
                newIcon.setAttribute('aria-hidden', 'true');
                modalImgWrapper.appendChild(newIcon);
            }
        }

        // Buka modal dengan animasi fade + scale
        projectModal.classList.add('is-active');
        projectModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        // Fokus ke tombol close untuk accessibility
        if (modalCloseBtn) {
            modalCloseBtn.focus();
        }
    };

    const closeProjectModal = () => {
        if (!projectModal || !projectModal.classList.contains('is-active')) return;

        projectModal.classList.remove('is-active');
        projectModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';

        // Kembalikan fokus ke elemen pemicu sebelumnya
        if (activeModalTrigger) {
            activeModalTrigger.focus();
            activeModalTrigger = null;
        }
    };

    // 1. Klik area gambar project card untuk membuka modal
    projectImgBoxes.forEach((imgBox) => {
        imgBox.setAttribute('role', 'button');
        imgBox.setAttribute('tabindex', '0');
        imgBox.setAttribute('aria-haspopup', 'dialog');
        imgBox.setAttribute('title', 'Klik untuk melihat preview lebih besar');

        imgBox.addEventListener('click', (e) => {
            e.stopPropagation();
            if (wasJustDragging) return;
            openProjectModal(imgBox);
        });

        imgBox.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                openProjectModal(imgBox);
            }
        });
    });

    // 2. Tutup dengan klik tombol X
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeProjectModal();
        });
    }

    // 3. Tutup dengan klik area overlay di luar content
    if (projectModal) {
        projectModal.addEventListener('click', (e) => {
            if (!e.target.closest('.project-modal-dialog')) {
                closeProjectModal();
            }
        });
    }

    // 4. Tutup dengan tombol Escape pada keyboard
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && projectModal && projectModal.classList.contains('is-active')) {
            closeProjectModal();
        }
    });

    // -------------------------------------------------------------------------
    // 7. Interactive Envelope CTA Toggle (Mobile Tap & Focus Support)
    // -------------------------------------------------------------------------
    const envelopeContainer = document.querySelector('.envelope-container');
    if (envelopeContainer) {
        envelopeContainer.addEventListener('click', (e) => {
            // Jika user langsung mengklik tombol "Send Me an Email", biarkan mailto link berjalan
            if (e.target.closest('.envelope-btn')) return;
            envelopeContainer.classList.toggle('is-open');
        });
    }
});


