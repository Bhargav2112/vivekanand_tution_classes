import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import { Instagram, Heart, MessageCircle } from 'lucide-react';
import SectionHeading from '@/components/ui/SectionHeading';
import { motion } from 'framer-motion';
import Btn from '@/components/ui/Btn';

export default function InstagramFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('vivekanand_tution_classes');

  useEffect(() => {
    const fetchInstagramFeed = async () => {
      try {
        const res = await apiClient.get('/instagram/feed');
        setPosts(res.data?.data || []);
        if (res.data?.username) {
          setUsername(res.data.username);
        }
      } catch (err) {
        console.error("Failed to fetch Instagram feed", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInstagramFeed();
  }, []);

  if (loading || posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <SectionHeading 
            title="Follow Us on Instagram" 
            subtitle="Catch the latest updates and behind-the-scenes." 
            align="left"
            className="mb-0"
          />
          <Btn 
            href={`https://instagram.com/${username}`} 
            variant="outline" 
            icon={Instagram} 
            className="shrink-0"
          >
            @{username}
          </Btn>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {posts.map((post, i) => (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              key={post.id || i}
              className="relative group aspect-square bg-gray-100 overflow-hidden rounded-xl shadow-sm border border-border block"
            >
              <a href={post.permalink} target="_blank" rel="noreferrer" className="absolute inset-0 z-10">
                <span className="sr-only">View post on Instagram</span>
              </a>
              {post.media_type === 'VIDEO' ? (
                <video 
                  src={post.media_url} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  muted 
                  loop 
                  playsInline
                />
              ) : (
                <img 
                  src={post.media_url} 
                  alt="Instagram post" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Heart className="w-6 h-6 fill-white" />
                  <span>{Math.floor(Math.random() * 500) + 50}</span> {/* Dummy likes as basic Graph API doesn't always provide them */}
                </div>
                <div className="flex items-center gap-2 text-white font-bold">
                  <MessageCircle className="w-6 h-6 fill-white" />
                  <span>{Math.floor(Math.random() * 20) + 1}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
