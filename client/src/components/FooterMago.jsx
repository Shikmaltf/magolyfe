import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-green-900 text-white py-5 mt-5">
        <div className="container mx-auto my-auto text-center">
            <p className="text-sm mb-2">© {new Date().getFullYear()} Magolyfe x KSM Watesa Jamaras 02</p>
        </div>
        </footer>
    );
};

export default Footer;