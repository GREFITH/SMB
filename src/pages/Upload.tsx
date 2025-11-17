import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useAuthStore } from "@/store/auth-store";
import { uploadMedia } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon, FilePlus, UploadCloud } from "lucide-react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

type DateRange = {
  from: Date;
  to: Date;
};

const formSchema = z.object({
  displayDuration: z.number().min(1, {
    message: "Display duration must be at least 1 second.",
  }),
  date: z.object({
    from: z.date({
      required_error: "A start date is required.",
    }),
    to: z.date({
      required_error: "A end date is required.",
    }),
  }),
  screenNumber: z.number({
    required_error: "Please select a screen",
  }),
});

const Upload = () => {
  const { user } = useAuthStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      displayDuration: 5,
      date: {
        from: new Date(),
        to: new Date(),
      },
      screenNumber: 1,
    },
  });

  const handleDrop = (acceptedFiles: File[]) => {
    setSelectedFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'video/*': ['.mp4'],
      'application/pdf': ['.pdf'],
      'application/vnd.ms-powerpoint': ['.ppt'],
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx']
    },
    maxFiles: 1,
  });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedFile || !user) {
      toast({
        title: "Error",
        description: "Please select a file and ensure you're logged in",
        variant: "destructive",
      });
      return;
    }

    const { date, displayDuration, screenNumber } = form.getValues();
    
    if (!date?.from || !date?.to) {
      toast({
        title: "Error",
        description: "Please select both start and end dates.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await uploadMedia(selectedFile, user.id, date.from, date.to, displayDuration, screenNumber);

      toast({
        title: "Success",
        description: "Media uploaded successfully!",
      });
      setSelectedFile(null);
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload media",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-bold mb-4">Upload Media</h1>

      <Form {...form}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div {...getRootProps()} className={cn(
            "border-2 border-dashed rounded-md p-6 text-center cursor-pointer",
            isDragActive ? "border-primary" : "border-muted-foreground"
          )}>
            <input {...getInputProps()} />
            {selectedFile ? (
              <div className="flex items-center justify-center space-x-2">
                <FilePlus className="h-4 w-4" />
                <p className="text-sm">{selectedFile.name}</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2">
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {isDragActive ? "Drop the file here..." : "Drag 'n' drop a file here, or click to select a file"}
                </p>
              </div>
            )}
          </div>

          <FormField
            control={form.control}
            name="screenNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Screen</FormLabel>
                <Select onValueChange={(value) => field.onChange(Number(value))} value={String(field.value)}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a screen" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="1">Screen 1</SelectItem>
                    <SelectItem value="2">Screen 2</SelectItem>
                    <SelectItem value="3">Screen 3</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Choose which screen will display this media
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="displayDuration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Display Duration (seconds)</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="5" {...field} />
                </FormControl>
                <FormDescription>
                  The duration for which the media will be displayed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date Range</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[240px] pl-3 text-left font-normal",
                          !field.value ? "text-muted-foreground" : ""
                        )}
                      >
                        {field.value?.from ? (
                          field.value?.to ? (
                            `${format(field.value.from, "MMM dd, yyyy")} - ${format(
                              field.value.to,
                              "MMM dd, yyyy"
                            )}`
                          ) : (
                            format(field.value.from, "MMM dd, yyyy")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="range"
                      defaultMonth={field.value?.from}
                      selected={field.value as DateRange}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date("2030-01-01") || date < new Date("2023-01-01")
                      }
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  The period during which the media will be displayed.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Upload;
