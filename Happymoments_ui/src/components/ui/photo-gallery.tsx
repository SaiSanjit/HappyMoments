import { motion } from "framer-motion";
import { useState } from "react";

const photos = [
  "/images/birthday-celebration.jpg",
  "/images/celebrations.jpeg",
  "/images/vendor.jpeg",
  "/images/birthday-celebration.jpg",
  "/images/celebrations.jpeg",
  "/images/vendor.jpeg",
  "/images/birthday-celebration.jpg",
  "/images/celebrations.jpeg",
  "/images/vendor.jpeg",
];

interface PhotoGalleryProps {
  media: string[];
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ media }) => {
  const [unmutedIndex, setUnmutedIndex] = useState<number | null>(null);

   const shareVideo = async (videoUrl) => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: "Check out this video!",
            text: "Watch this amazing video",
            url: videoUrl,
          });
        } catch (error) {
          console.error("Error sharing:", error);
        }
      } else {
        alert("Sharing is not supported in this browser.");
      }
    };

  return (
    <div className="p-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {media.map((videoSrc, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="overflow-hidden rounded-lg shadow-lg bg-gray-900"
          >
            <video
              className="w-full h-[36rem] object-cover rounded-xl"
              src={videoSrc}
              autoPlay
              loop
              muted={unmutedIndex !== index} // Unmute only the hovered video
              onMouseEnter={() => setUnmutedIndex(index)}
              onMouseLeave={() => setUnmutedIndex(null)}
            />
            
          </motion.div>
        ))}
      </div>
    </div>
  );
};



export default PhotoGallery;
