const Card = ({ text }) => {
    return (
      <div className="card w-[300px] shadow-xl overflow-hidden">
        <div className="card-body bg-[#0079C2] text-white flex flex-col items-center">
          <h2 className="card-title text-center">{text}</h2>
        </div>
        <figure className="h-[150px] w-[150px] mx-auto">
          <img
            src="images/figmaDb.png"
            alt="Card Image"
            className="w-full h-full object-cover"
          />
        </figure>
      </div>
    );
  };
  
  export default Card;
  