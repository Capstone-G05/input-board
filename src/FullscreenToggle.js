import { useState, useEffect } from "react";
import './FullscreenToggle.css';

const FullscreenToggle = () => 
{
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => 
  {
    if (!document.fullscreenElement) 
    {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } 
    else if (document.exitFullscreen) 
    {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => 
  {
    const handleFullscreenChange = () => 
    {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  return (
    <button onClick={toggleFullscreen} className = "fullscreen-button">
      {isFullscreen ? "⛶" : "⛶"}
    </button>
  );
};

export default FullscreenToggle;
