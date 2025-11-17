import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getAllUserMedia, MediaType } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MonitorCheck, Maximize, Minimize, Play, Pause, SkipForward, SkipBack } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";

const Screens = () => {
  const { user } = useAuthStore();
  const [mediaItems, setMediaItems] = useState<MediaType[]>([]);
  const { toast } = useToast();
  const screens = [1, 2, 3];
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [currentActiveScreen, setCurrentActiveScreen] = useState(1);
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      getAllUserMedia(user.id)
        .then((media) => {
          setMediaItems(media);
          setIsLoading(false);
        })
        .catch((error) => {
          toast({
            title: "Error",
            description: "Failed to load media items",
            variant: "destructive",
          });
          setIsLoading(false);
        });
    }
  }, [user, toast]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isLoading) {
      const currentScreenMedia = getMediaForScreen(currentActiveScreen);
      if (currentScreenMedia.length > 0) {
        const currentMedia = currentScreenMedia[currentMediaIndex];
        if (currentMedia) {
          setSelectedMedia(currentMedia);
          setIsFullScreen(true);
          
          timerRef.current = setTimeout(() => {
            const nextIndex = (currentMediaIndex + 1) % currentScreenMedia.length;
            setCurrentMediaIndex(nextIndex);
          }, currentMedia.displayDuration * 1000);
        }
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isAutoPlaying, currentMediaIndex, currentActiveScreen, isLoading]);

  const getMediaForScreen = (screenNumber: number) => {
    return mediaItems.filter(media => media.screenNumber === screenNumber);
  };

  const handleCardClick = (media: MediaType) => {
    setIsAutoPlaying(false);
    setSelectedMedia(media);
    setIsFullScreen(true);
  };

  const startAutoPlay = (screenNumber: number) => {
    const screenMedia = getMediaForScreen(screenNumber);
    if (screenMedia.length > 0) {
      setCurrentActiveScreen(screenNumber);
      setCurrentMediaIndex(0);
      setIsAutoPlaying(true);
    }
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    setIsFullScreen(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const nextMedia = () => {
    const screenMedia = getMediaForScreen(currentActiveScreen);
    const nextIndex = (currentMediaIndex + 1) % screenMedia.length;
    setCurrentMediaIndex(nextIndex);
  };

  const previousMedia = () => {
    const screenMedia = getMediaForScreen(currentActiveScreen);
    const prevIndex = currentMediaIndex === 0 ? screenMedia.length - 1 : currentMediaIndex - 1;
    setCurrentMediaIndex(prevIndex);
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex items-center gap-2 mb-8">
        <MonitorCheck size={32} className="text-primary" />
        <h1 className="text-3xl font-bold">Screen Views</h1>
      </div>

      <Tabs defaultValue="1" className="w-full">
        <TabsList className="mb-4">
          {screens.map((screen) => (
            <TabsTrigger key={screen} value={screen.toString()}>
              Screen {screen}
            </TabsTrigger>
          ))}
        </TabsList>

        {screens.map((screen) => (
          <TabsContent key={screen} value={screen.toString()}>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle>Screen {screen} Content</CardTitle>
                <div className="flex gap-2">
                  {!isAutoPlaying || currentActiveScreen !== screen ? (
                    <Button
                      onClick={() => startAutoPlay(screen)}
                      disabled={getMediaForScreen(screen).length === 0}
                      size="sm"
                    >
                      <Play className="h-4 w-4 mr-1" />
                      Auto Play
                    </Button>
                  ) : (
                    <Button
                      onClick={stopAutoPlay}
                      variant="destructive"
                      size="sm"
                    >
                      <Pause className="h-4 w-4 mr-1" />
                      Stop
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <p className="text-center py-8">Loading content...</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {getMediaForScreen(screen).length > 0 ? (
                      getMediaForScreen(screen).map((media, index) => (
                        <Card 
                          key={media.id} 
                          className={`cursor-pointer hover:shadow-lg transition-shadow ${
                            isAutoPlaying && currentActiveScreen === screen && index === currentMediaIndex 
                              ? 'ring-2 ring-primary' 
                              : ''
                          }`}
                          onClick={() => handleCardClick(media)}
                        >
                          <CardContent className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-medium">{media.filename}</h3>
                              <Maximize className="h-4 w-4" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Display Duration: {media.displayDuration}s
                            </p>
                          </CardContent>
                        </Card>
                      ))
                    ) : (
                      <p className="col-span-full text-center py-8">No media assigned to this screen.</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={isFullScreen} onOpenChange={(open) => {
        setIsFullScreen(open);
        if (!open) {
          setIsAutoPlaying(false);
        }
      }}>
        <DialogContent className="max-w-screen-lg w-full p-0">
          {selectedMedia && (
            <div className="relative">
              {/* Hidden title for accessibility */}
              <div className="sr-only">
                <h2>{selectedMedia.filename}</h2>
                <p>Media preview for {selectedMedia.fileType}</p>
              </div>
              
              {/* Control buttons */}
              <div className="absolute top-2 right-2 z-10 flex gap-1">
                {isAutoPlaying && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/20 hover:bg-black/40"
                      onClick={previousMedia}
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/20 hover:bg-black/40"
                      onClick={nextMedia}
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="bg-black/20 hover:bg-black/40"
                      onClick={stopAutoPlay}
                    >
                      <Pause className="h-4 w-4" />
                    </Button>
                  </>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-black/20 hover:bg-black/40"
                  onClick={() => setIsFullScreen(false)}
                >
                  <Minimize className="h-4 w-4" />
                </Button>
              </div>
              
              {selectedMedia.fileType.startsWith('image/') ? (
                <img
                  src={selectedMedia.url}
                  alt={selectedMedia.filename}
                  className="w-full h-auto"
                />
              ) : selectedMedia.fileType.startsWith('video/') ? (
                <video
                  src={selectedMedia.url}
                  controls
                  className="w-full h-auto"
                >
                  Your browser does not support the video tag.
                </video>
              ) : selectedMedia.fileType === 'application/pdf' ? (
                <div className="w-full h-[80vh]">
                  <iframe
                    src={selectedMedia.url}
                    className="w-full h-full border-0"
                    title={selectedMedia.filename}
                  />
                </div>
              ) : (selectedMedia.fileType.includes("powerpoint") || selectedMedia.fileType.includes("presentation")) ? (
                <div className="w-full h-[80vh]">
                  <iframe
                    src={`https://docs.google.com/gview?url=${encodeURIComponent(selectedMedia.url)}&embedded=true`}
                    className="w-full h-full border-0"
                    title={selectedMedia.filename}
                  />
                </div>
              ) : (
                <div className="w-full h-[80vh] flex flex-col items-center justify-center bg-secondary p-8">
                  <svg className="w-24 h-24 text-blue-500 mb-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 2a1 1 0 11-2 0v6a1 1 0 102 0V6z" />
                  </svg>
                  <h3 className="text-xl font-medium mb-2">{selectedMedia.filename}</h3>
                  <p className="text-muted-foreground mb-6">File - Click to download and view</p>
                  <Button onClick={() => {
                    const link = document.createElement('a');
                    link.href = selectedMedia.url;
                    link.download = selectedMedia.filename;
                    link.click();
                  }}>
                    Download File
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Screens;
