type ArrowProps = {
    onClick?: () => void;
};

const NextArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer z-50 hover:scale-115 transition-transform" onClick={onClick}>
        <svg className="w-8 h-8 text-white hover:text-blue-300" viewBox="0 0 24 24" fill="none">
            <path d="M8 5l8 7-8 7" stroke="currentColor" strokeWidth="2" />
        </svg>
    </div>
);

const NextArrowDark: React.FC<ArrowProps> = ({ onClick }) => (
    <div className="absolute top-1/2 right-4 transform -translate-y-1/2 cursor-pointer z-50 hover:scale-115 transition-transform" onClick={onClick}>
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none">
            <path d="M8 5l8 7-8 7" stroke="lightgray" strokeWidth="2" />
        </svg>
    </div>
);

const PrevArrow: React.FC<ArrowProps> = ({ onClick }) => (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer z-50 hover:scale-115 transition-transform" onClick={onClick}>
        <svg className="w-8 h-8 text-white hover:text-blue-300" viewBox="0 0 24 24" fill="none">
            <path d="M16 5l-8 7 8 7" stroke="currentColor" strokeWidth="2" />
        </svg>
    </div>
);

const PrevArrowDark: React.FC<ArrowProps> = ({ onClick }) => (
    <div className="absolute top-1/2 left-4 transform -translate-y-1/2 cursor-pointer z-50 hover:scale-115 transition-transform" onClick={onClick}>
        <svg className="w-8 h-8 text-black" viewBox="0 0 24 24" fill="none">
            <path d="M16 5l-8 7 8 7" stroke="black" strokeWidth="2" />
        </svg>
    </div>
);

export { NextArrow, PrevArrow, NextArrowDark, PrevArrowDark };