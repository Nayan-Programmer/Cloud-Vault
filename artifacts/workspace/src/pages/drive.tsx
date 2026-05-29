import { Show, useClerk } from "@clerk/react";
import { Redirect } from "wouter";
import { useListFiles, useGetStorageStats, getListFilesQueryKey, getGetStorageStatsQueryKey, useCreateFile, useRequestUploadUrl, useDeleteFile, useUpdateFile } from "@workspace/api-client-react";
import { formatBytes } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText, Upload, MoreVertical, Search, LogOut, HardDrive, Image as ImageIcon, FileArchive, FileAudio, FileVideo } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

export default function DriveGuard() {
  return (
    <>
      <Show when="signed-in">
        <DriveWorkspace />
      </Show>
      <Show when="signed-out">
        <Redirect to="/" />
      </Show>
    </>
  );
}

function DriveWorkspace() {
  const { signOut } = useClerk();
  const queryClient = useQueryClient();

  const { data: files, isLoading } = useListFiles({}, {
    query: {
      enabled: true,
      queryKey: getListFilesQueryKey({})
    }
  });

  const { data: stats } = useGetStorageStats({
    query: {
      enabled: true,
      queryKey: getGetStorageStatsQueryKey()
    }
  });

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = useMemo(() => {
    if (!Array.isArray(files)) return [];
    if (!searchQuery) return files;
    return files.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [files, searchQuery]);

  return (
    <div className="flex h-[100dvh] bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/40 bg-card/30 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-border/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <HardDrive className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Workspace</span>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start gap-2 h-10 shadow-none bg-secondary/50">
              <HardDrive className="w-4 h-4" />
              My Drive
            </Button>
          </div>

          {stats && (
            <div className="mt-8 px-2">
              <h3 className="text-xs font-medium text-muted-foreground mb-4 uppercase tracking-wider">Storage</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Used</span>
                  <span className="font-medium">{formatBytes(stats.totalSizeBytes)}</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${Math.min(100, (stats.totalSizeBytes / (5 * 1024 * 1024 * 1024)) * 100)}%` }} />
                </div>
                <div className="text-xs text-muted-foreground pt-1">
                  {stats.totalFiles} files
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border/40">
          <Button variant="ghost" className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground" onClick={() => signOut()}>
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 flex items-center px-4 md:px-8 border-b border-border/40 gap-4">
          <div className="flex-1 max-w-xl relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-muted/30 border-none shadow-none h-10 rounded-full focus-visible:ring-1"
            />
          </div>
          <UploadButton />
        </header>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <h2 className="text-sm font-medium text-muted-foreground mb-6">My Files</h2>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="rounded-xl border border-border/40 p-4 h-32 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <Skeleton className="w-8 h-8 rounded" />
                    <Skeleton className="w-4 h-4 rounded" />
                  </div>
                  <Skeleton className="h-4 w-3/4 mt-auto" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-center max-w-sm mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-6">
                <HardDrive className="w-8 h-8 text-muted-foreground" />
              </div>
              <h2 className="text-xl font-semibold mb-2">No files yet</h2>
              <p className="text-muted-foreground">Upload files to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredFiles.map((file) => (
                <FileCard key={file.id} file={file} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function UploadButton() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const requestUrl = useRequestUploadUrl();
  const createFile = useCreateFile();
  const queryClient = useQueryClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      toast.loading(`Uploading ${file.name}...`, { id: "upload" });

      const { uploadURL, objectPath } = await requestUrl.mutateAsync({
        data: {
          name: file.name,
          size: file.size,
          contentType: file.type || "application/octet-stream"
        }
      });

      const res = await fetch(uploadURL, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type || "application/octet-stream" }
      });

      if (!res.ok) throw new Error("Failed to upload to storage");

      await createFile.mutateAsync({
        data: {
          name: file.name,
          size: file.size,
          mimeType: file.type || "application/octet-stream",
          objectPath,
          parentId: null
        }
      });

      queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({}) });
      queryClient.invalidateQueries({ queryKey: getGetStorageStatsQueryKey() });
      toast.success("Upload complete", { id: "upload" });
    } catch (err) {
      console.error(err);
      toast.error("Upload failed", { id: "upload" });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <>
      <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="rounded-full shadow-sm"
      >
        <Upload className="w-4 h-4 mr-2" />
        Upload
      </Button>
    </>
  );
}

function FileCard({ file }: { file: any }) {
  const deleteFile = useDeleteFile();
  const updateFile = useUpdateFile();
  const queryClient = useQueryClient();
  const [renameOpen, setRenameOpen] = useState(false);
  const [newName, setNewName] = useState(file.name);

  const getIcon = () => {
    if (file.mimeType?.startsWith("image/")) return <ImageIcon className="w-8 h-8 text-emerald-500" />;
    if (file.mimeType?.startsWith("video/")) return <FileVideo className="w-8 h-8 text-rose-500" />;
    if (file.mimeType?.startsWith("audio/")) return <FileAudio className="w-8 h-8 text-amber-500" />;
    if (file.mimeType?.includes("zip") || file.mimeType?.includes("tar")) return <FileArchive className="w-8 h-8 text-indigo-500" />;
    return <FileText className="w-8 h-8 text-slate-500" />;
  };

  const handleRename = async () => {
    if (!newName.trim() || newName === file.name) return;
    try {
      await updateFile.mutateAsync({ id: file.id, data: { name: newName } });
      queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({}) });
      setRenameOpen(false);
      toast.success("Renamed successfully");
    } catch {
      toast.error("Failed to rename");
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${file.name}"?`)) return;
    try {
      await deleteFile.mutateAsync({ id: file.id });
      queryClient.invalidateQueries({ queryKey: getListFilesQueryKey({}) });
      queryClient.invalidateQueries({ queryKey: getGetStorageStatsQueryKey() });
      toast.success("Deleted successfully");
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <>
      <div
        className="group relative flex flex-col p-4 rounded-xl border border-border/40 bg-card hover:bg-accent/50 hover:border-accent-foreground/10 transition-all cursor-pointer shadow-sm"
        onClick={() => file.objectPath && window.open(`/api/storage${file.objectPath}`, "_blank")}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-2 rounded-lg bg-background border border-border/40 shadow-sm">
            {getIcon()}
          </div>
          <div onClick={(e) => e.stopPropagation()}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="w-4 h-4 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {file.objectPath && (
                  <DropdownMenuItem onClick={() => window.open(`/api/storage${file.objectPath}`, "_blank")}>
                    Download
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => setRenameOpen(true)}>Rename</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive focus:bg-destructive/10" onClick={handleDelete}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-auto">
          <h4 className="font-medium text-sm truncate" title={file.name}>{file.name}</h4>
          <div className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
            <span>{new Date(file.createdAt).toLocaleDateString()}</span>
            {file.size ? <span>{formatBytes(file.size)}</span> : null}
          </div>
        </div>
      </div>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRename} disabled={!newName.trim() || newName === file.name || updateFile.isPending}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
