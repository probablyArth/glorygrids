import { type Dispatch, type FC, type SetStateAction, useState } from "react";

const DEFAULT_COUNT = 5;
const DEFAULT_ICON = "★";
const DEFAULT_UNSELECTED_COLOR = "text-[gray]";
const DEFAULT_COLOR = "text-primary";

const Rating: FC<{
  currRating: number;
  setRating: Dispatch<SetStateAction<number>>;
  disabled?: boolean;
  size?: number;
}> = ({ setRating, currRating: rating, disabled, size }) => {
  const [temporaryRating, setTemporaryRating] = useState(0);

  const stars = Array(DEFAULT_COUNT).fill(DEFAULT_ICON);

  const handleClick = (rating: number) => {
    setRating(rating);
  };

  return (
    <div className="starsContainer">
      {stars.map((item, index) => {
        const isActiveColor =
          (rating || temporaryRating) &&
          (index < rating || index < temporaryRating);

        let elementColor = "";

        if (isActiveColor) {
          elementColor = DEFAULT_COLOR;
        } else {
          elementColor = DEFAULT_UNSELECTED_COLOR;
        }

        return (
          <div
            className={`star text-[${size ?? 20}px] ${elementColor}`}
            key={index}
            style={{
              filter: `${isActiveColor ? "grayscale(0%)" : "grayscale(100%)"}`,
            }}
            onMouseEnter={() => !disabled && setTemporaryRating(index + 1)}
            onMouseLeave={() => !disabled && setTemporaryRating(0)}
            onClick={() => !disabled && handleClick(index + 1)}
          >
            {DEFAULT_ICON}
          </div>
        );
      })}
    </div>
  );
};

export default Rating;
