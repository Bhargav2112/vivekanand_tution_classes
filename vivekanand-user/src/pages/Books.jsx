import { useState, useEffect } from 'react';
import { apiClient } from '@/api/apiClient';
import PageHero from '@/components/site/PageHero';
import { Search, Filter, BookOpen, Download, ShoppingCart } from 'lucide-react';
import Btn from '@/components/ui/Btn';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export default function Books() {
  const { t } = useTranslation();
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLang, setSelectedLang] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, catRes] = await Promise.all([
          apiClient.get('/books'),
          apiClient.get('/bookcategories')
        ]);
        
        setBooks(Array.isArray(booksRes.data) ? booksRes.data : (booksRes.data?.data || []));
        setCategories(Array.isArray(catRes.data) ? catRes.data : (catRes.data?.data || []));
      } catch (err) {
        console.error("Failed to fetch books", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredBooks = books.filter(book => {
    if (search && !book.title.toLowerCase().includes(search.toLowerCase())) return false;
    if (selectedCategory && book.category?._id !== selectedCategory) return false;
    if (selectedLang && book.language !== selectedLang) return false;
    return true;
  });

  return (
    <>
      <PageHero title="Online Book Store" subtitle="Prepare for your exams with our premium materials." />
      
      <section className="py-20 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-4 lg:px-8">
          
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10 bg-white p-5 rounded-2xl shadow-sm border border-border">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search books by title..." 
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-border focus:outline-none focus:border-accent transition-colors"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <select 
              className="py-3 px-4 rounded-xl border border-border focus:outline-none focus:border-accent bg-white"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
            <select 
              className="py-3 px-4 rounded-xl border border-border focus:outline-none focus:border-accent bg-white"
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
            >
              <option value="">All Languages</option>
              <option value="Gujarati">Gujarati</option>
              <option value="English">English</option>
              <option value="Hindi">Hindi</option>
            </select>
          </div>

          {/* Book Grid */}
          {loading ? (
            <div className="text-center py-20">Loading books...</div>
          ) : filteredBooks.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">No books found matching your criteria.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {filteredBooks.map((book, i) => (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={book._id} 
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all group flex flex-col h-full border border-border"
                >
                  <div className="aspect-[3/4] bg-gray-100 relative overflow-hidden">
                    {book.thumbnail_url ? (
                      <img src={book.thumbnail_url} alt={book.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <BookOpen className="w-16 h-16" />
                      </div>
                    )}
                    {book.isBestSeller && (
                      <div className="absolute top-4 left-4 bg-[#FF6600] text-white text-xs font-bold px-3 py-1 rounded-full">Best Seller</div>
                    )}
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="text-xs text-muted-foreground font-semibold mb-2 uppercase tracking-wider">{book.category?.name || 'Book'}</div>
                    <h3 className="font-heading font-bold text-lg leading-tight mb-2 line-clamp-2">{book.title}</h3>
                    {book.author && <p className="text-sm text-muted-foreground mb-4">{book.author}</p>}
                    
                    <div className="mt-auto pt-4 border-t border-border flex items-center justify-between">
                      <div>
                        {book.discount_price ? (
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-accent text-xl">₹{book.discount_price}</span>
                            <span className="text-muted-foreground line-through text-sm">₹{book.price}</span>
                          </div>
                        ) : (
                          <span className="font-display font-bold text-accent text-xl">₹{book.price}</span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {book.pdf_preview_url && (
                          <a 
                            href={book.pdf_preview_url} 
                            target="_blank" 
                            rel="noreferrer"
                            className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-colors"
                            title="PDF Preview"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                        )}
                        <Link
                          to={`/contact?subject=Book Inquiry: ${encodeURIComponent(book.title)}`}
                          className="px-4 py-2 bg-[#FF6600] text-white rounded-lg text-sm font-bold flex items-center gap-2 hover:bg-[#E65100] transition-colors"
                        >
                          <ShoppingCart className="w-4 h-4" /> {t("home.buy_now")}
                        </Link>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
