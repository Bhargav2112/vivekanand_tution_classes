import { useState, useEffect } from 'react';
import { Bell } from 'lucide-react';
import { apiClient } from '@/api/apiClient';

const publicVapidKey = import.meta.env.VITE_VAPID_PUBLIC_KEY; // Need to make sure this is set, but can fallback or handle errors gracefully

export default function PushNotificationPrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if service workers and push are supported
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      return;
    }

    // Check if already subscribed or denied
    if (Notification.permission === 'granted' || Notification.permission === 'denied') {
      return;
    }

    const hasPrompted = localStorage.getItem('push_prompted');
    if (!hasPrompted) {
      // Delay showing the prompt by a few seconds
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSubscribe = async () => {
    setShowPrompt(false);
    localStorage.setItem('push_prompted', 'true');

    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') return;

      if (!publicVapidKey) {
        console.warn('VAPID public key not found. Push notifications cannot be subscribed.');
        return;
      }

      const registration = await navigator.serviceWorker.register('/sw.js');
      
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });

      // Send to backend
      await apiClient.post('/push/subscribe', subscription);
      console.log('Successfully subscribed to push notifications.');
    } catch (err) {
      console.error('Failed to subscribe to push notifications', err);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('push_prompted', 'true');
  };

  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-24 right-4 z-50 bg-white border-2 border-accent shadow-xl rounded-2xl p-5 max-w-sm w-[calc(100%-2rem)] animate-in slide-in-from-bottom-5">
      <div className="flex items-start gap-4">
        <div className="bg-accent/10 p-3 rounded-full text-accent shrink-0">
          <Bell className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h4 className="font-heading font-bold text-foreground mb-1 text-lg">Never Miss an Update!</h4>
          <p className="font-body text-sm text-muted-foreground mb-4">
            Enable notifications to get immediate alerts for admission dates, new batches, and results.
          </p>
          <div className="flex gap-2">
            <button 
              onClick={handleSubscribe}
              className="bg-accent hover:bg-accent/90 text-white px-4 py-2 rounded-lg text-sm font-bold flex-1 transition-colors"
            >
              Enable
            </button>
            <button 
              onClick={handleDismiss}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
            >
              Maybe Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}
