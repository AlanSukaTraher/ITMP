import fire from '../assets/icons/fire.png';
import flood from '../assets/icons/flood.png';
import storm from '../assets/icons/storm.png';
import earthquake from '../assets/icons/earthquake.png';
import firstAid from '../assets/icons/first_aid.png';
import gamepad from '../assets/icons/gamepad.png';
import hourglass from '../assets/icons/hourglass.png';
import shield from '../assets/icons/shield.png';
import starFull from '../assets/icons/star-full.png';
import starEmpty from '../assets/icons/star-empty.png';
import medal from '../assets/icons/medal.png';

// Icons supplied by the multimedia team. Decorative (alt=""), because each
// place that uses one already has a text label next to it.
const ICONS = {
  fire,
  flood,
  storm,
  earthquake,
  first_aid: firstAid,
  scenario: gamepad,
  timed: hourglass,
  survival: shield,
  medal,
};

export function Icon({ name, className = '' }) {
  const src = ICONS[name];
  if (!src) return null;
  return <img className={`icon ${className}`.trim()} src={src} alt="" draggable="false" />;
}

// Row of 3 stars; the first `count` are filled.
export function StarRow({ count, className = '' }) {
  return (
    <span className={`stars ${className}`.trim()} role="img" aria-label={`${count} out of 3 stars`}>
      {[1, 2, 3].map((n) => (
        <img
          key={n}
          className={n <= count ? 'star on' : 'star'}
          src={n <= count ? starFull : starEmpty}
          alt=""
          draggable="false"
        />
      ))}
    </span>
  );
}
