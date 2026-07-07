import { Button } from "@monoriz/ui/components/button";
import { Card, CardContent } from "@monoriz/ui/components/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@monoriz/ui/components/collapsible";
import { ChevronRightIcon, FileIcon, FolderIcon } from "lucide-react";
import React, { ComponentType, ReactNode, isValidElement } from "react";

// Base properties yang shared oleh semua item
interface FileTreeBaseItem {
  name: string;
  key: string;
  level?: number;
  action?: ReactNode;
  icon?: ComponentType<{ className?: string }> | ReactNode;
  metadata?: Record<string, unknown>;
  className?: string;
  isActive?: boolean;
  disabled?: boolean;
}

export interface FileTreeFolder extends FileTreeBaseItem {
  type: "folder";
  items: FileTreeItem[];
  parentId?: string;
  defaultOpen?: boolean;
  isLoading?: boolean;
  isActive?: boolean;
  onFolderClick?: (folder: FileTreeFolder, isOpen: boolean) => void;
}

// File item tanpa children
export interface FileTreeFile extends FileTreeBaseItem {
  type: "file";
  extension?: string;
  onFileClick?: (file: FileTreeFile) => void;
}

// Union type untuk semua item types
export type FileTreeItem = FileTreeFolder | FileTreeFile;

// Props untuk komponen utama
interface CollapsibleFileTreeProps {
  fileTreeProps?: FileTreeItem[];
  onFolderClick?: (folder: FileTreeFolder, isOpen: boolean) => void;
  onFileClick?: (file: FileTreeFile) => void;
  className?: string;
}

export function CollapsibleFileTree({
  fileTreeProps,
  onFolderClick,
  onFileClick,
  className,
}: CollapsibleFileTreeProps) {
  const renderItem = (fileItem: FileTreeItem, depth: number = 0) => {
    const itemLevel = fileItem.level ?? depth;
    const indentStyle = { paddingLeft: `${itemLevel * 16}px` };
    // Render folder
    if (fileItem.type === "folder") {
      const handleFolderToggle = (isOpen: boolean) => {
        // Call item-specific handler first
        fileItem.onFolderClick?.(fileItem, isOpen);
        // Then call global handler
        onFolderClick?.(fileItem, isOpen);
      };

      const renderFolderIcon = () => {
        if (!fileItem.icon) {
          return <FolderIcon className={fileItem.isLoading ? "animate-pulse" : ""} />;
        }
        // Check if it's already a valid React element
        if (isValidElement(fileItem.icon)) {
          return fileItem.icon;
        }
        // Check if it's a component (function or class)
        if (typeof fileItem.icon === "function") {
          const IconComponent = fileItem.icon;
          return <IconComponent className={fileItem.isLoading ? "animate-spin" : ""} />;
        }
        // Fallback to default icon
        return <FolderIcon className={fileItem.isLoading ? "animate-pulse" : ""} />;
      };

      return (
        <Collapsible
          key={fileItem.key}
          defaultOpen={fileItem.defaultOpen}
          onOpenChange={handleFolderToggle}
        >
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              style={indentStyle}
              className={`group hover:bg-accent hover:text-accent-foreground w-full justify-between transition-none ${fileItem.isActive ? "bg-accent text-accent-foreground" : ""} ${fileItem.className || ""}`}
              disabled={fileItem.disabled || fileItem.isLoading}
            >
              <div className="flex items-center gap-2">
                <ChevronRightIcon
                  className={`transition-transform duration-200 ease-in-out mr-1 ${fileItem.isLoading ? "animate-spin" : ""} group-data-[state=open]:rotate-90`}
                />
                {renderFolderIcon()}
                {fileItem.name}
                {fileItem.isLoading && (
                  <span className="ml-auto text-xs text-muted-foreground">Loading...</span>
                )}
              </div>
              {fileItem.action}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-1">
            <div className="flex flex-col">
              {fileItem.isLoading ? (
                <div
                  className="text-muted-foreground py-2 text-center text-sm"
                  style={{ paddingLeft: `${(itemLevel + 1) * 16}px` }}
                >
                  Loading...
                </div>
              ) : fileItem.items.length > 0 ? (
                fileItem.items.map((child) => renderItem(child, itemLevel + 1))
              ) : null}
            </div>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Render file
    const handleFileClick = () => {
      fileItem.onFileClick?.(fileItem);
      onFileClick?.(fileItem);
    };

    const renderFileIcon = () => {
      if (!fileItem.icon) {
        return <FileIcon />;
      }

      if (isValidElement(fileItem.icon)) {
        return fileItem.icon;
      }

      if (typeof fileItem.icon === "function") {
        const IconComponent = fileItem.icon;
        return <IconComponent />;
      }
      // Fallback to default icon
      return <FileIcon />;
    };

    return (
      <Button
        key={fileItem.key}
        variant="link"
        size="sm"
        style={indentStyle}
        className={`text-foreground w-full justify-start gap-2 ${fileItem.className || ""}`}
        disabled={fileItem.disabled}
        onClick={handleFileClick}
      >
        {renderFileIcon()}
        <span>{fileItem.name}</span>
        {fileItem.extension && (
          <span className="text-muted-foreground text-xs">.{fileItem.extension}</span>
        )}
      </Button>
    );
  };

  return (
    <Card className={`mx-auto w-full max-w-[16rem] gap-2 ${className || ""}`} size="sm">
      <CardContent>
        <div className="flex flex-col gap-1">{fileTreeProps?.map((item) => renderItem(item))}</div>
      </CardContent>
    </Card>
  );
}
