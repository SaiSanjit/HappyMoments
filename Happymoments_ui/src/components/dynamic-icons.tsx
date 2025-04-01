import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt, faHome, faInr, faStar } from "@fortawesome/free-solid-svg-icons";

const iconMap = {
  map_marker: faMapMarkerAlt,
  rupee:faInr,
  home: faHome, 
  star:faStar
};

import { SizeProp } from "@fortawesome/fontawesome-svg-core";

const DynamicIcon: React.FC<{ name: string; size: SizeProp,color:string }> = ({ name, size, color }) => {
  return <FontAwesomeIcon icon={iconMap[name]} color={color} size={size} />;
};

export default DynamicIcon;
