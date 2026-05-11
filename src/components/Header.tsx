import { Search, Moon, Sun, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';                    // baru
import { useAnnouncements } from '@/context/AnnouncementContext';
import logoPU from "@/assets/PU_Logo.png";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";


interface HeaderProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  onLogoClick?: () => void;                                    //baru
}

{/*export function Header({ onSearch, searchQuery = '' }: HeaderProps) { */ }
export function Header({ onSearch, searchQuery = '', onLogoClick }: HeaderProps) {              //baru
  const [isDark, setIsDark] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [openNotif, setOpenNotif] = useState(false);                                        //baru
  const { announcements } = useAnnouncements();                                             //baru
  const [readIds, setReadIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("readAnnouncements");
    return saved ? JSON.parse(saved) : [];
  });                                                                                        //baru

  useEffect(() => {
    localStorage.setItem("readAnnouncements", JSON.stringify(readIds));
  }, [readIds]);


  useEffect(() => {
    // Check for saved theme or system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;
    setIsDark(newIsDark);

    if (newIsDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localQuery);
  };

  const now = new Date();
  const newAnnouncements = announcements.filter(a => {

    const release = new Date(a.releaseDate || a.createdAt);
    const updated = new Date(a.updatedAt || a.createdAt);

    // belum rilis
    if (release > now) return false;

    // sudah dibaca
    if (readIds.includes(a.id)) return false;

    const diffDays =
      (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);

    // hanya 7 hari terakhir
    return diffDays <= 7;
  });

  const sortedAnnouncements = [...newAnnouncements].sort(
    (a, b) =>
      new Date(b.releaseDate || b.createdAt).getTime() -
      new Date(a.releaseDate || a.createdAt).getTime()
  );

  const visibleAnnouncements = sortedAnnouncements.slice(0, 5);
  const remainingCount = sortedAnnouncements.length - visibleAnnouncements.length;

  const navigate = useNavigate();
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };



  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            {
              /*
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-hero">
                <span className="text-lg font-bold text-white">PU</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">President University</h1>
                <p className="text-sm text-muted-foreground">Announcements Hub</p>
              </div>
            </div>
            */
            }

            <Link to="/hub" onClick={onLogoClick} className="flex items-center space-x-3 cursor-pointer">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg overflow-hidden bg-white">
                <img
                  src={logoPU}
                  alt="President University Logo"
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-semibold text-foreground">President University</h1>
                <p className="text-sm text-muted-foreground">Announcements Hub</p>
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search announcements..."
                value={localQuery}
                onChange={(e) => setLocalQuery(e.target.value)}
                className="w-full pl-10 pr-4"
              />
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            { /*}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                3
              </span>
            </Button>
            */}




            {/*NOTIF BELL CODE*/}
            <Button                                                               // baru until line 136
              variant="ghost"
              size="icon"
              className="relative"
              title="Notifications"
              onClick={() => {
                setOpenNotif(prev => {
                  const next = !prev;

                  if (!next) {
                    setReadIds(prev => [
                      ...new Set([
                        ...prev,
                        ...visibleAnnouncements.map(a => a.id)
                      ])
                    ]);
                  }
                  return next;
                });
              }}
            >
              <Bell className="h-4 w-4" />

              {sortedAnnouncements.length > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-accent text-[10px] font-medium text-accent-foreground flex items-center justify-center">
                  {sortedAnnouncements.length}
                </span>
              )}
            </Button>



            {/*DARK AND LIGHT MODE CODE*/}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>

            <Button variant="ghost" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>





            {openNotif && (
              <div className="absolute right-4 top-16 w-80 rounded-lg border bg-background shadow-lg p-3 z-50">
                <h4 className="font-semibold mb-2">New Updates</h4>

                {sortedAnnouncements.length > 0 ? (
                  <>
                    <ul className="space-y-2 max-h-64 overflow-auto">
                      {visibleAnnouncements.map(a => (
                        <li
                          key={a.id}
                          className="p-2 rounded hover:bg-muted cursor-pointer"
                          onClick={() => setOpenNotif(false)}
                        >
                          <p className="text-sm font-medium">{a.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {a.category} • {new Date(a.updatedAt || a.createdAt).toLocaleString(undefined, {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </li>
                      ))}
                    </ul>

                    {remainingCount > 0 && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        +{remainingCount} more announcements
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No new announcements
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}