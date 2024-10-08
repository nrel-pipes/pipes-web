const DirectoryCard = ({ title, description, onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer block no-underline">
      <div className="card bg-base-100 w-96 shadow-xl hover:shadow-2xl hover:bg-gray-200 transition-transform transform hover:scale-105 duration-300">
        {/* Title Section */}
        <div className="card-title bg-[#0079C2] hover:bg-[#0064A8] h-[15px] text-white p-4 transition-colors duration-300">
          <h4 className="text-left">{title}</h4>
        </div>
        
        {/* Body Section */}
        <div className="card-body">
          <p className="text-[#36454F] text-left h-[50px] overflow-hidden text-ellipsis whitespace-normal" style={{ display: '-webkit-box', WebkitLineClamp: 5, WebkitBoxOrient: 'vertical' }}>
            {description}
          </p>

          <div className="card-actions justify-start">
          </div>
        </div>
      </div>
    </div>
  );
};

export default DirectoryCard;
