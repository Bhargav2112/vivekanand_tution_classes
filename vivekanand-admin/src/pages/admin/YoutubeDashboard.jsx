import React, { useState, useEffect } from "react";
import { api } from "@/api/axios";
import { Loader2, Youtube, RefreshCw, AlertCircle, Video, Film, CheckCircle2, AlertTriangle, Calendar } from "lucide-react";

export default function YoutubeDashboard() {
  const [channel, setChannel] = useState(null);
  const [videosCount, setVideosCount] = useState(0);
  const [shortsCount, setShortsCount] = useState(0);
  const [logs, setLogs] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState("");
  const [syncSuccess, setSyncSuccess] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [channelRes, videosRes, shortsRes, logsRes] = await Promise.all([
        api.get('/youtube/channel').catch(e => null),
        api.get('/youtube/videos').catch(e => ({ count: 0 })),
        api.get('/youtube/shorts').catch(e => ({ count: 0 })),
        api.get('/youtube/logs').catch(e => ({ data: [] }))
      ]);

      if (channelRes && channelRes.success) setChannel(channelRes.data);
      setVideosCount(videosRes.count || 0);
      setShortsCount(shortsRes.count || 0);
      setLogs(logsRes.data || []);
      
    } catch (err) {
      console.error(err);
      setError("માહિતી લાવવામાં ભૂલ થઈ. (Failed to load data)");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSync = async () => {
    if (!window.confirm("શું તમે ખરેખર યુટ્યુબ વિડિઓ સિંક કરવા માંગો છો? આ પ્રક્રિયામાં થોડો સમય લાગી શકે છે.")) return;
    
    try {
      setSyncing(true);
      setError("");
      setSyncSuccess("");
      
      const res = await api.post('/youtube/sync');
      if (res.success) {
        setSyncSuccess(`સિંક સફળ! ${res.data.videosAdded} નવા વિડિઓ અને ${res.data.shortsAdded} નવા શોર્ટ્સ ઉમેરાયા.`);
        fetchData(); // Refresh data
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "સિંક કરવામાં ભૂલ થઈ. કૃપા કરીને API કી ચેક કરો.");
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-heading text-foreground">યુટ્યુબ સિંક (YouTube Sync)</h1>
          <p className="text-muted-foreground mt-1">તમારી યુટ્યુબ ચેનલને આપમેળે વેબસાઇટ સાથે જોડો.</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="bg-[#FF0000] hover:bg-[#CC0000] text-white px-4 py-2 rounded flex items-center gap-2 disabled:opacity-50 transition-colors"
        >
          {syncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <RefreshCw className="w-5 h-5" />}
          {syncing ? "સિંક થઈ રહ્યું છે..." : "અત્યારે સિંક કરો (Sync Now)"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex items-start gap-3 rounded">
          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-red-800">ભૂલ (Error)</h3>
            <p className="text-red-700 mt-1">{error}</p>
          </div>
        </div>
      )}

      {syncSuccess && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 flex items-start gap-3 rounded">
          <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5" />
          <div>
            <h3 className="font-bold text-green-800">સફળતા (Success)</h3>
            <p className="text-green-700 mt-1">{syncSuccess}</p>
          </div>
        </div>
      )}

      {!channel && !error && (
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg text-center">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-3" />
          <h2 className="text-lg font-bold text-amber-800">કોઈ ચેનલ ડેટા મળ્યો નથી</h2>
          <p className="text-amber-700 mt-2">
            તમારી યુટ્યુબ ચેનલનો ડેટા હજી સિંક થયો નથી. કૃપા કરીને ઉપર "અત્યારે સિંક કરો" બટન દબાવો. <br/>
            (નોંધ: બેકએન્ડમાં YOUTUBE_API_KEY અને YOUTUBE_CHANNEL_ID હોવા જરૂરી છે).
          </p>
        </div>
      )}

      {channel && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Channel Card */}
          <div className="md:col-span-1 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
            {channel.bannerUrl && (
              <div 
                className="h-24 bg-cover bg-center" 
                style={{ backgroundImage: `url(${channel.bannerUrl})` }} 
              />
            )}
            <div className="p-6 text-center relative">
              {channel.thumbnailUrl && (
                <img 
                  src={channel.thumbnailUrl} 
                  alt={channel.title} 
                  className={`w-20 h-20 rounded-full mx-auto border-4 border-card bg-white ${channel.bannerUrl ? '-mt-16' : ''} mb-4`} 
                />
              )}
              <h2 className="text-xl font-bold font-heading">{channel.title}</h2>
              <p className="text-muted-foreground text-sm mt-1 mb-4">{channel.customUrl}</p>
              
              <div className="grid grid-cols-2 gap-4 text-sm mt-6 border-t pt-4">
                <div>
                  <div className="font-bold text-lg">{parseInt(channel.subscriberCount).toLocaleString('en-IN')}</div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">Subscribers</div>
                </div>
                <div>
                  <div className="font-bold text-lg">{parseInt(channel.viewCount).toLocaleString('en-IN')}</div>
                  <div className="text-muted-foreground text-xs uppercase tracking-wider">Views</div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-center items-center shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <Video className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold font-heading mb-1">{videosCount}</div>
              <div className="text-muted-foreground">સામાન્ય વિડિઓઝ (Normal Videos)</div>
            </div>
            
            <div className="bg-card rounded-xl border border-border p-6 flex flex-col justify-center items-center shadow-sm">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <Film className="w-6 h-6" />
              </div>
              <div className="text-4xl font-bold font-heading mb-1">{shortsCount}</div>
              <div className="text-muted-foreground">યુટ્યુબ શોર્ટ્સ (YouTube Shorts)</div>
            </div>
          </div>
        </div>
      )}

      {/* Sync Logs */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h2 className="font-bold font-heading text-lg">તાજેતરના સિંક લોગ્સ (Recent Sync Logs)</h2>
          <span className="text-xs text-muted-foreground bg-secondary px-2 py-1 rounded">દર ૩૦ મિનિટે ઓટો-સિંક ચાલુ છે</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary">
              <tr>
                <th className="px-6 py-3">સમય (Time)</th>
                <th className="px-6 py-3">પ્રકાર (Type)</th>
                <th className="px-6 py-3">સ્ટેટસ (Status)</th>
                <th className="px-6 py-3">નવા વિડિઓ (New Videos)</th>
                <th className="px-6 py-3">નવા શોર્ટ્સ (New Shorts)</th>
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    કોઈ લોગ મળ્યા નથી. (No logs found)
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="border-b last:border-0 hover:bg-secondary/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        {new Date(log.startedAt).toLocaleString('en-IN', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="capitalize">{log.syncType}</span>
                    </td>
                    <td className="px-6 py-4">
                      {log.status === 'success' ? (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium flex w-max items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> સફળ
                        </span>
                      ) : (
                        <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full font-medium flex w-max items-center gap-1">
                          <AlertCircle className="w-3 h-3" /> નિષ્ફળ
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 font-medium">{log.videosAdded}</td>
                    <td className="px-6 py-4 font-medium">{log.shortsAdded}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
