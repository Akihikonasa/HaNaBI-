const gallery = document.getElementById('gallery-grid');
const count = document.getElementById('photo-count');

const lightbox = document.getElementById('lightbox');
const lightboxImage = document.getElementById('lightbox-image');
const lightboxCaption = document.getElementById('lightbox-caption');

/**
 * @typedef {{ src: string, caption?: string }} Photo
 */

/** @type {Photo[]} */
const photos = Array.isArray(window.AFTERGLOW_PHOTOS)
  ? window.AFTERGLOW_PHOTOS
  : [];

let currentIndex = 0;

function renderGallery() {
  gallery.innerHTML = '';

  count.textContent =
    `${photos.length} ${photos.length === 1 ? 'memory' : 'memories'}`;

  if (photos.length === 0) {
    gallery.innerHTML =
      '<p class="empty-gallery">Your memories will appear here once you add photos in config.js.</p>';
    return;
  }

  photos.forEach((photo, index) => {
    const card = document.createElement('article');
    card.className = 'photo-card';
    card.tabIndex = 0;

    const image = document.createElement('img');
    image.src = photo.src;
    image.alt = photo.caption || 'Afterglow memory';
    image.loading = 'lazy';

    image.onerror = () => {
      card.remove();
      count.textContent = `${gallery.children.length} memories`;
    };

    const caption = document.createElement('p');
    caption.className = 'photo-caption';
    caption.textContent = photo.caption || 'A little moment';

    card.append(image, caption);

    card.addEventListener('click', () => openPhoto(index));

    card.addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openPhoto(index);
      }
    });

    gallery.appendChild(card);
  });
}

/** @param {number} index */
function openPhoto(index) {
  if (photos.length === 0) return;

  currentIndex = (index + photos.length) % photos.length;

  const photo = photos[currentIndex];

  lightboxImage.src = photo.src;
  lightboxImage.alt = photo.caption || 'Afterglow memory';
  lightboxCaption.textContent = photo.caption || 'A little moment';

  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closePhoto() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  lightboxImage.src = '';
}

document.getElementById('close-lightbox')
  .addEventListener('click', closePhoto);

document.getElementById('prev-photo')
  .addEventListener('click', () => openPhoto(currentIndex - 1));

document.getElementById('next-photo')
  .addEventListener('click', () => openPhoto(currentIndex + 1));

lightbox.addEventListener('click', event => {
  if (event.target === lightbox) closePhoto();
});

document.addEventListener('keydown', event => {
  if (!lightbox.classList.contains('open')) return;

  if (event.key === 'Escape') closePhoto();
  if (event.key === 'ArrowLeft') openPhoto(currentIndex - 1);
  if (event.key === 'ArrowRight') openPhoto(currentIndex + 1);
});

renderGallery();