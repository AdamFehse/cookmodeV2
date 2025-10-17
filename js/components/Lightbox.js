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
        className: 'fixed inset-0 bg-black/90 flex items-center justify-center z-[2000] p-10',
        onClick: closeLightbox
    }, [
        React.createElement('div', {
            key: 'container',
            className: 'relative max-w-[90vw] max-h-[90vh]',
            onClick: (e) => e.stopPropagation()
        }, [
            // Close button
            React.createElement('button', {
                key: 'close',
                className: 'absolute -top-9 right-0 bg-white hover:bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center text-2xl',
                onClick: closeLightbox
            }, '×'),

            // Main image
            React.createElement('img', {
                key: 'image',
                src: lightboxImage[lightboxIndex],
                alt: 'Full size',
                className: 'max-w-full max-h-[90vh] rounded-lg'
            }),

            // Navigation buttons (only if multiple images)
            lightboxImage.length > 1 && [
                React.createElement('button', {
                    key: 'prev',
                    className: 'absolute top-1/2 -translate-y-1/2 -left-14 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center text-3xl',
                    onClick: prevImage
                }, '‹'),
                React.createElement('button', {
                    key: 'next',
                    className: 'absolute top-1/2 -translate-y-1/2 -right-14 bg-white/90 hover:bg-white rounded-full w-12 h-12 flex items-center justify-center text-3xl',
                    onClick: nextImage
                }, '›')
            ]
        ].filter(Boolean))
    ]);
};

// Export to global scope
window.Lightbox = Lightbox;