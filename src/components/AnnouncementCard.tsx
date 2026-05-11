import { Calendar, Clock, MapPin, ExternalLink, Users, Award } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Announcement } from '@/types';
import { getCategoryConfig } from './CategoryFilter';
import { cn } from '@/lib/utils';


interface AnnouncementCardProps {
  announcement: Announcement;
  onClick?: () => void;
  className?: string;
  highlight?: boolean;
}

export function AnnouncementCard({ announcement, onClick, className, highlight }: AnnouncementCardProps) {
  const categoryConfig = getCategoryConfig(announcement.category);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isDeadlineSoon = () => {
    if (!announcement.deadline) return false;
    const deadline = new Date(announcement.deadline);
    const now = new Date();
    const daysDiff = (deadline.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return daysDiff <= 7 && daysDiff > 0;
  };

  const isUpcoming = () => {
    if (!announcement.releaseDate) return false;

    const release = new Date(announcement.releaseDate).getTime();
    const now = Date.now();

    return release > now;
  };



  return (
    <div
      id={announcement.id}
      className={cn(
        "announcement-card cursor-pointer group relative overflow-hidden transition-all duration-500",
        isUpcoming() && "opacity-60 pointer-events-none",
        highlight && "ring-4 ring-emerald-400 shadow-2xl scale-[1.02]",
        className
      )}

      onClick={onClick}
    >

      {isUpcoming() && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-md z-20 rounded-xl">
          <span className="text-sm font-semibold">
            Upcoming — Available Soon
          </span>
        </div>
      )}

      {/* Featured indicator */}
      {announcement.featured && (
        <div className="absolute top-4 right-4 z-10">
          <div className="flex items-center gap-1 bg-warning text-warning-foreground px-2 py-1 rounded-full text-xs font-medium">
            <Award className="w-3 h-3" />
            Featured
          </div>
        </div>
      )}

      {/* Category + Status */}
      <div className="mb-3 space-y-2">
        {/* Category */}
        <Badge
          variant="secondary"
          className={cn("text-xs font-medium border border-border/50", categoryConfig.color)}
        >
          {categoryConfig.name}
        </Badge>

        {/* Status indicators */}
        <div className="flex gap-2">
          {isDeadlineSoon() && (
            <Badge variant="destructive" className="text-xs">
              <Clock className="w-3 h-3 mr-1" />
              Deadline Soon
            </Badge>
          )}
          {isUpcoming() && (
            <Badge variant="default" className="text-xs bg-success text-success-foreground">
              <Calendar className="w-3 h-3 mr-1" />
              Upcoming
            </Badge>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-foreground mb-3 line-clamp-2 group-hover:text-accent transition-colors">
        {announcement.title}
      </h3>

      {/* Summary */}
      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
        {announcement.summary}
      </p>

      {/* Metadata */}
      <div className="space-y-2 mb-4">
        {/* Organizer */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Users className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">{announcement.organizer.name}</span>
          <span className="text-muted-foreground/70">•</span>
          <span className="truncate">{announcement.organizer.orgUnit}</span>
        </div>

        {/* Date/Time info */}
        {announcement.startDateTime && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3 flex-shrink-0" />
            <span>{formatDateTime(announcement.startDateTime)}</span>
            {announcement.endDateTime && (
              <>
                <span>-</span>
                <span>{formatDateTime(announcement.endDateTime)}</span>
              </>
            )}
          </div>
        )}

        {/* Location */}
        {announcement.location && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">
              {announcement.location.type === 'online' ? 'Online Event' :
                announcement.location.type === 'hybrid' ? 'Hybrid Event' :
                  announcement.location.address || 'TBA'}
            </span>
          </div>
        )}

        {/* Deadline */}
        {announcement.deadline && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span>Deadline: {formatDate(announcement.deadline)}</span>
          </div>
        )}
      </div>

      {/* Tags */}
      {announcement.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {announcement.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
          {announcement.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{announcement.tags.length - 3} more
            </Badge>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs text-muted-foreground">
          {formatDate(announcement.releaseDate || announcement.createdAt)}
        </div>

        {announcement.externalLinks.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-8 px-3 hover:bg-accent hover:text-accent-foreground"
            onClick={(e) => {
              e.stopPropagation();
              window.open(announcement.externalLinks[0].url, '_blank');
            }}
          >
            <ExternalLink className="w-3 h-3 mr-1" />
            {announcement.externalLinks[0].label}
          </Button>
        )}
      </div>


      {/* Hover overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-transparent group-hover:from-accent/5 group-hover:via-transparent group-hover:to-transparent transition-all duration-300 pointer-events-none" />
    </div>
  );
}

