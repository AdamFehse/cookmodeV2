const Lightbox = ({ lightboxImage, lightboxIndex, setLightboxImage, setLightboxIndex }) => {
    const { useRef, useEffect } = React;
    const dialogRef = useRef(null);

    // Use native dialog.showModal() API
    useEffect(() => {
        if (lightboxImage && dialogRef.current) {
            dialogRef.current.showModal();
        }
    }, [lightboxImage]);

    if (!lightboxImage) return null;

    const closeLightbox = () => {
        if (dialogRef.current) {
            dialogRef.current.close();
        }
        setLightboxImage(null);
        setLightboxIndex(0);
    };

    const nextImage = () => {
        setLightboxIndex((prev) => (prev + 1) % lightboxImage.length);
    };

    const prevImage = () => {
        setLightboxIndex((prev) => (prev - 1 + lightboxImage.length) % lightboxImage.length);
    };

    // Handle backdrop click
    const handleDialogClick = (e) => {
        if (e.target === dialogRef.current) {
            closeLightbox();
        }
    };

    return React.createElement('dialog', {
        ref: dialogRef,
        className: 'modal lightbox',
        onClick: handleDialogClick,
        onClose: closeLightbox
    }, [
        React.createElement('article', { key: 'content', className: 'lightbox-content' }, [
            React.createElement('a', {
                key: 'close',
                href: '#close',
                className: 'close',
                'aria-label': 'Close lightbox',
                onClick: (event) => {
                    event.preventDefault();
                    closeLightbox();
                }
            }),

            React.createElement('img', {
                key: 'image',
                src: lightboxImage[lightboxIndex],
                alt: 'Full size',
                className: 'lightbox-image'
            }),

            lightboxImage.length > 1 && React.createElement('button', {
                key: 'prev',
                className: 'lightbox-nav lightbox-nav-prev',
                type: 'button',
                onClick: prevImage
            }, '‹'),

            lightboxImage.length > 1 && React.createElement('button', {
                key: 'next',
                className: 'lightbox-nav lightbox-nav-next',
                type: 'button',
                onClick: nextImage
            }, '›')
        ].filter(Boolean))
    ]);
};

window.Lightbox = Lightbox;
