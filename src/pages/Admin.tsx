
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getAllMedia, MediaType, deleteMedia } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Trash2, Calendar, Clock } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

const Admin = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mediaItems, setMediaItems] = useState<MediaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaType | null>(null);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "You do not have permission to view this page",
        variant: "destructive",
      });
      navigate("/");
    } else {
      loadAllMedia();
    }
  }, [user, navigate, toast]);

  const loadAllMedia = async () => {
    try {
      const media = await getAllMedia();
      setMediaItems(media);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load media files",
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

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8">Admin Panel</h1>

      <Tabs defaultValue="media" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="media">Media Management</TabsTrigger>
          <TabsTrigger value="users">User Management</TabsTrigger>
        </TabsList>
        
        {/* Media Management Tab */}
        <TabsContent value="media" className="card-shadow rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Media Files</h2>
          
          {loading ? (
            <div className="text-center py-12">Loading...</div>
          ) : mediaItems.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Filename</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mediaItems.map((media) => (
                    <TableRow key={media.id}>
                      <TableCell className="font-medium truncate max-w-[150px]">
                        {media.filename}
                      </TableCell>
                      <TableCell>{media.fileType.split('/')[0]}</TableCell>
                      <TableCell>
                        <Badge variant={isActive(media) ? "default" : "outline"}>
                          {isActive(media) ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(media.startDate), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {format(new Date(media.endDate), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {media.displayDuration}s
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:bg-destructive/10"
                          onClick={() => handleDeleteClick(media)}
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No media files found
            </div>
          )}
        </TabsContent>
        
        {/* User Management Tab */}
        <TabsContent value="users" className="card-shadow rounded-lg border bg-card p-6">
          <h2 className="text-xl font-semibold mb-4">Users</h2>
          <div className="text-center py-12 text-muted-foreground">
            User management functionality will be implemented in a future version.
          </div>
        </TabsContent>
      </Tabs>

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

export default Admin;
