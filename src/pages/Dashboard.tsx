
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { getAllUserMedia, MediaType, deleteMedia } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarIcon, Clock, Trash2, Upload } from "lucide-react";
import { format } from "date-fns";

const Dashboard = () => {
  const { user } = useAuthStore();
  const [mediaItems, setMediaItems] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadUserMedia();
    }
  }, [user]);

  const loadUserMedia = async () => {
    try {
      const media = await getAllUserMedia(user!.id);
      setMediaItems(media);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your media files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (media: MediaType) => {
    setSelectedMedia(media);
    setDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedMedia) return;
    
    try {
      const success = await deleteMedia(selectedMedia.id);
      if (success) {
        toast({
          title: "Success",
          description: "Media deleted successfully",
        });
        setMediaItems((prev) => prev.filter((item) => item.id !== selectedMedia.id));
      } else {
        toast({
          title: "Error",
          description: "Failed to delete media",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during deletion",
        variant: "destructive",
      });
    } finally {
      setDialogOpen(false);
      setSelectedMedia(null);
    }
  };

  const isActive = (media: MediaType) => {
    const now = new Date();
    return new Date(media.startDate) <= now && new Date(media.endDate) >= now;
  };

  const getMediaPreview = (media: MediaType) => {
    if (media.fileType.startsWith("image/")) {
      return <img src={media.url} alt={media.filename} className="w-full h-40 object-cover rounded-t-lg" />;
    } else if (media.fileType.startsWith("video/")) {
      return <video src={media.url} className="w-full h-40 object-cover rounded-t-lg" controls />;
    } else if (media.fileType === "application/pdf") {
      return (
        <div className="w-full h-40 flex flex-col items-center justify-center rounded-t-lg bg-secondary">
          <svg className="w-12 h-12 text-red-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" />
          </svg>
          <span className="text-sm font-medium">PDF Document</span>
        </div>
      );
    } else if (media.fileType.includes("powerpoint") || media.fileType.includes("presentation")) {
      return (
        <div className="w-full h-40 flex flex-col items-center justify-center rounded-t-lg bg-secondary">
          <svg className="w-12 h-12 text-orange-500 mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm6 2a1 1 0 11-2 0v6a1 1 0 102 0V6z" />
          </svg>
          <span className="text-sm font-medium">PPT Presentation</span>
        </div>
      );
    } else {
      return (
        <div className="w-full h-40 flex flex-col items-center justify-center rounded-t-lg bg-secondary">
          <svg className="w-12 h-12 text-muted-foreground mb-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
          </svg>
          <span className="text-sm font-medium">File</span>
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8 flex-col sm:flex-row gap-4">
        <h1 className="text-3xl font-bold">Your Media Library</h1>
        <Link to="/upload">
          <Button className="scale-hover flex items-center gap-2">
            <Upload size={18} /> Upload New Media
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-40" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : mediaItems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((media) => (
            <Card key={media.id} className="overflow-hidden card-shadow">
              {getMediaPreview(media)}
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <div className="truncate">{media.filename}</div>
                  <div className={`text-xs px-2 py-1 rounded-full ${
                    isActive(media) ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100'
                  }`}>
                    {isActive(media) ? 'Active' : 'Scheduled'}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} className="text-muted-foreground" />
                  <span>
                    {format(new Date(media.startDate), 'MMM d, yyyy')} - {format(new Date(media.endDate), 'MMM d, yyyy')}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>Display for {media.displayDuration} seconds</span>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="destructive" 
                  className="w-full"
                  onClick={() => handleDeleteClick(media)}
                >
                  <Trash2 size={16} className="mr-2" /> Delete Media
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-card rounded-lg border card-shadow">
          <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-primary/10 mb-4">
            <Upload size={24} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold mb-2">No Media Files Yet</h2>
          <p className="text-muted-foreground mb-6">Start by uploading your first media file</p>
          <Link to="/upload">
            <Button className="scale-hover">Upload Media</Button>
          </Link>
        </div>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{selectedMedia?.filename}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
