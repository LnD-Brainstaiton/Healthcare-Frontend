export function Button({ children, type = "button", onClick, className }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`bg-tealBlueHover w-full text-2xl text-white hover:bg-tealBlue font-bold p-2 rounded-xl hover:shadow-lg hover:scale-105 transform transition-all duration-200 ${className}`}
      >
        {children}
      </button>
    );
  }
  