'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Code2, X, Github } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeSwitch } from '../theme/switch';

type InstallOutcome = 'idle' | 'prompting' | 'installed' | 'dismissed';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function FloatingCredits() {
  const [isOpen, setIsOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [installState, setInstallState] = useState<InstallOutcome>('idle');

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
      setInstallState('idle');
    };

    const handleAppInstalled = () => {
      setInstallPrompt(null);
      setInstallState('installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    setInstallState('prompting');
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      setInstallState(choice.outcome === 'accepted' ? 'installed' : 'dismissed');
      if (choice.outcome === 'accepted') {
        setInstallPrompt(null);
      }
    } catch (error) {
      console.error('[PWA] Install prompt failed', error);
      setInstallState('dismissed');
    }
  };

  return (
    <>
      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className="fixed bottom-6 right-6 h-8 w-8 rounded-full shadow-lg hover:shadow-xl transition-all z-50 bg-primary hover:bg-primary/90"
        aria-label="View Credits"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Code2 className="h-6 w-6" />
        )}
      </Button>

      {/* Credits Card */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-80 shadow-2xl z-50 animate-in slide-in-from-bottom-5 duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <Image
                src="https://avatars.githubusercontent.com/u/132731058?v=4"
                alt="Mr-Potatoe"
                className="w-16 h-16 rounded-full border-2 border-primary"
                decoding="async"
                loading="lazy"
                width={48}
                height={48}
                priority
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg">Developed by</h3>
                <p className="text-sm text-muted-foreground">Mr-Potatoe</p>
              </div>
            </div>

            <div className="space-y-2">
              {/* <p className="text-sm text-muted-foreground">
                Interactive learning platform for Data Structures & Algorithms
              </p> */}

              <div className="flex gap-2">
                <a
                  href="https://github.com/Mr-Potatoe"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full" size="sm">
                    <Github className="h-4 w-4 mr-2" />
                    GitHub Profile
                  </Button>
                </a>
                <Button
                  variant="default"
                  className="flex-1"
                  size="sm"
                  onClick={handleInstallClick}
                  disabled={!installPrompt || installState === 'installed'}
                >
                  {installState === 'installed' ? 'Installed' : 'Install App'}
                </Button>
              </div>

              {installState === 'dismissed' && (
                <p className="text-xs text-muted-foreground">
                  Install dismissed — reopen this card to try again later.
                </p>
              )}
              {installState === 'installed' && (
                <p className="text-xs text-green-600 dark:text-green-400">
                  App installed! You can now launch it from your device.
                </p>
              )}

              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Built with Next.js & React</span>
                  <ThemeSwitch />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 animate-in fade-in duration-300"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}