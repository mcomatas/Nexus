import Image from 'next/image';
import { useState, useEffect } from 'react';

export const ImageModal = ({ thmb, full }) => {
    const [isOpen, setIsOpen] = useState(false);
    //const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add("overflow-hidden");
        } else {
            document.body.classList.remove("overflow-hidden");
        }

        return () => document.body.classList.remove("overflow-hidden");
    }, [isOpen]);
    
    const openModal = () => {
        //setSelectedImage(imgSrc);
        setIsOpen(true);
    };

    const closeModal = () => {
        setIsOpen(false);
        //setSelectedImage("");
    }
    
    return (
        <div>
            <Image
                src={thmb}
                alt="thumbnail"
                height={350}
                width={263}
                quality={100}
                className="rounded-lg border-black border-solid border-2 hover:scale-105 transition"
                onClick={openModal}
            />

            {isOpen && (
                <div
                    className="fixed inset-0 flex items-center justify-center bg-stone-900/80 backdrop-blur-xl z-50"
                    onClick={closeModal}
                >
                    <Image
                        src={thmb}
                        alt="Full size"
                        height={700}
                        width={500}
                        quality={100}
                        className="rounded-lg"
                    />
                </div>
            )}

        </div>
    )
}