const Lightbox = ({ lightboxImage, lightboxIndex, setLightboxImage, setLightboxIndex }) => {
    if (!lightboxImage) return null;

    const closeLightbox = () => {
        setLightboxImage(null);
        setLightboxIndex(0);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % lightboxImage.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + lightboxImage.length) % lightboxImage.length);
    };

    return React.createElement('div', {
        className: 'lightbox-overlay',
        onClick: closeLightbox
    }, [
        React.createElement('button', {
            key: 'close',
            className: 'lightbox-close',
            onClick: (e) => {
                e.stopPropagation();
                closeLightbox();
            }
        }, '×'),

        React.createElement('img', {
            key: 'image',
            src: lightboxImage[lightboxIndex],
            alt: 'Full size',
            className: 'lightbox-image',
            onClick: (e) => e.stopPropagation()
        }),

        lightboxImage.length > 1 && React.createElement('button', {
            key: 'prev',
            className: 'lightbox-nav lightbox-nav-prev',
            onClick: (e) => {
                e.stopPropagation();
                prevImage();
            }
        }, '‹'),

        lightboxImage.length > 1 && React.createElement('button', {
            key: 'next',
            className: 'lightbox-nav lightbox-nav-next',
            onClick: (e) => {
                e.stopPropagation();
                nextImage();
            }
        }, '›')
    ].filter(Boolean));
};

window.Lightbox = Lightbox;
