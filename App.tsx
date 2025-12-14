import React, { useState, useRef, useEffect } from 'react';
import { 
  ShoppingBag, Heart, Search, User, Menu, X, Star, Trash2, 
  Plus, Minus, ArrowRight, Upload, Sparkles, Mic, Send, 
  LayoutDashboard, Package, Tag, LogOut, ChevronRight,
  Leaf, FlaskConical, Globe, Award, Calendar, Edit, Save, XCircle, Image as ImageIcon,
  Clock, CheckCircle, Truck, PackageOpen, Camera
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Cell
} from 'recharts';
import { INITIAL_PRODUCTS, INITIAL_CATEGORIES, MOCK_REVIEWS, PROVINCES, TRANSLATIONS, MOCK_ORDERS } from './constants';
import { Product, Category, CartItem, Order, ChatMessage } from './types';
import { generateChatResponse, analyzeSkinImage } from './services/geminiService';
import FlyingImage from './components/FlyingImage';

// --- Sub-Components ---

// 1. HEADER
const Header = ({ cartCount, onOpenCart, onOpenMobileMenu, navigate, view, lang, setLang, t, wishlistCount, onOpenWishlist }: any) => (
  <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/80 border-b border-pink-100 shadow-sm transition-all duration-300">
    <div className="container mx-auto px-4 h-16 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button className="md:hidden p-2 text-gray-600 hover:text-pink-600" onClick={onOpenMobileMenu}>
          <Menu size={24} />
        </button>
        <div 
          onClick={() => navigate('home')}
          className="text-2xl font-serif font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-600 to-purple-600 cursor-pointer flex items-center gap-2"
        >
          <div className="w-8 h-8 bg-pink-600 rounded-full text-white flex items-center justify-center font-bold font-sans text-sm">C</div>
          <span className="hidden sm:block">CYRA</span>
        </div>
      </div>

      <nav className="hidden md:flex items-center gap-8 font-medium text-gray-600">
        <button onClick={() => navigate('home')} className={`hover:text-pink-600 transition ${view === 'home' ? 'text-pink-600' : ''}`}>{t('nav.home')}</button>
        <button onClick={() => navigate('products')} className={`hover:text-pink-600 transition ${view === 'products' ? 'text-pink-600' : ''}`}>{t('nav.products')}</button>
        <button onClick={() => navigate('story')} className={`hover:text-pink-600 transition ${view === 'story' ? 'text-pink-600' : ''}`}>{t('nav.story')}</button>
        <button onClick={() => navigate('dashboard')} className={`hover:text-pink-600 transition ${view === 'dashboard' ? 'text-pink-600' : ''}`}>{t('nav.dashboard')}</button>
      </nav>

      <div className="flex items-center gap-2 sm:gap-4">
        <button 
          onClick={() => setLang(lang === 'en' ? 'km' : 'en')}
          className="flex items-center gap-1 px-2 py-1 rounded-md bg-pink-50 text-pink-700 hover:bg-pink-100 font-bold text-xs sm:text-sm transition uppercase"
        >
          <Globe size={16} /> {lang === 'en' ? 'English' : 'ខ្មែរ'}
        </button>
        <button className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition hidden sm:block"><Search size={20} /></button>
        <button onClick={() => navigate('profile')} className={`p-2 hover:text-pink-600 hover:bg-pink-50 rounded-full transition hidden sm:block ${view === 'profile' ? 'text-pink-600 bg-pink-50' : 'text-gray-600'}`}><User size={20} /></button>
        <button onClick={onOpenWishlist} className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition relative">
          <Heart size={20} />
          {wishlistCount > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-pink-500 rounded-full animate-ping"></span>
          )}
        </button>
        <button 
          id="cart-btn"
          onClick={onOpenCart}
          className="p-2 text-gray-600 hover:text-pink-600 hover:bg-pink-50 rounded-full transition relative group"
        >
          <ShoppingBag size={20} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-pink-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md group-hover:scale-110 transition">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </div>
  </header>
);

// 2. HERO
const Hero = ({ onShopNow, t }: { onShopNow: () => void, t: any }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const slides = [
    { title: "Khmer Radiance", sub: t('hero.sub'), img: "https://picsum.photos/id/338/1920/800" },
    { title: "Night Repair", sub: t('story.vision'), img: "https://picsum.photos/id/326/1920/800" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setActiveSlide(prev => (prev + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[500px] md:h-[600px] overflow-hidden bg-pink-50">
      {slides.map((slide, index) => (
        <div 
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${index === activeSlide ? 'opacity-100' : 'opacity-0'}`}
        >
          <img src={slide.img} alt={slide.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-pink-900/40 to-transparent flex items-center">
            <div className="container mx-auto px-6 md:px-12 text-white">
              <h2 className="text-xl md:text-2xl font-light mb-2 animate-fadeInUp uppercase tracking-widest">{slide.sub}</h2>
              <h1 className="text-4xl md:text-7xl font-bold font-serif mb-8 animate-fadeInUp delay-100">{slide.title}</h1>
              <button 
                onClick={onShopNow}
                className="bg-white/90 text-pink-900 px-8 py-3 rounded-full font-bold hover:bg-pink-500 hover:text-white transition-all transform hover:scale-105 shadow-lg flex items-center gap-2 animate-fadeInUp delay-200"
              >
                {t('hero.shop')} <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// 3. PRODUCT CARD
const ProductCard = ({ product, onAdd, onView, isWishlist, onToggleWishlist, lang, t }: any) => {
  const imgRef = useRef<HTMLImageElement>(null);
  
  // Translation Helper
  const getName = () => (lang === 'km' && product.nameKm) ? product.nameKm : product.name;
  const getCategory = () => (lang === 'km' && product.categoryKm) ? product.categoryKm : product.category;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (imgRef.current) {
      const rect = imgRef.current.getBoundingClientRect();
      onAdd(product, rect);
    }
  };

  return (
    <div 
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-pink-50 cursor-pointer transform hover:-translate-y-2"
      onClick={() => onView(product)}
    >
      <div className="relative aspect-square overflow-hidden bg-gray-100">
        <img 
          ref={imgRef}
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        {product.isNewArrival && (
          <span className="absolute top-3 left-3 bg-pink-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            {t('common.new')}
          </span>
        )}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleWishlist(product.id); }}
          className={`absolute top-3 right-3 p-2 rounded-full transition opacity-0 group-hover:opacity-100 shadow-md ${isWishlist ? 'bg-pink-500 text-white opacity-100' : 'bg-white/80 text-pink-400 hover:text-pink-600 hover:bg-white'}`}
        >
          <Heart size={18} fill={isWishlist ? "currentColor" : "none"} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center gap-1 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={12} className={i < Math.floor(product.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
          ))}
          <span className="text-xs text-gray-400 ml-1">({product.reviews})</span>
        </div>
        <h3 className="font-bold text-gray-800 mb-1 truncate">{getName()}</h3>
        <p className="text-sm text-gray-500 mb-3">{getCategory()}</p>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-pink-600">${product.price.toFixed(2)}</span>
          <button 
            onClick={handleAdd}
            className="bg-gray-900 text-white p-2 rounded-full hover:bg-pink-600 transition shadow-lg active:scale-90"
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// 4. OUR STORY PAGE
const StorySection = ({ navigate, t, lang }: { navigate: (view: any) => void, t: any, lang: string }) => {
  const MILESTONES = [
    { year: "2018", title: t('story.vision'), desc: t('story.vision_desc'), icon: <Globe size={20} /> },
    { year: "2019", title: t('story.research'), desc: t('story.research_desc'), icon: <Leaf size={20} /> },
    { year: "2021", title: t('story.formula'), desc: t('story.formula_desc'), icon: <FlaskConical size={20} /> },
    { year: "2023", title: t('story.launch'), desc: t('story.launch_desc'), icon: <Star size={20} /> },
  ];

  return (
    <div className="bg-white min-h-screen animate-fadeIn">
      {/* Hero */}
      <div className="relative h-[60vh] w-full overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed transform scale-105 transition-transform duration-1000" 
            style={{backgroundImage: 'url("https://picsum.photos/id/28/1920/1080")'}} 
          ></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-white/95"></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
              <span className="text-white text-sm md:text-base font-bold tracking-[0.3em] uppercase mb-4 animate-fadeInUp">{t('story.est')}</span>
              <h1 className="text-5xl md:text-8xl font-serif text-white font-bold mb-6 drop-shadow-2xl animate-fadeInUp delay-100">
                {t('story.legacy_prefix')} <span className="italic font-light">{t('story.legacy_suffix')}</span>
              </h1>
          </div>
      </div>

      {/* Mission Statement */}
      <section className="py-24 px-6 container mx-auto text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 leading-tight mb-8">
            "{t('story.quote_start')} <span className="text-pink-600 italic">{t('story.quote_highlight1')}</span> {t('story.quote_mid')} <span className="text-pink-600 italic">{t('story.quote_highlight2')}</span>."
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-pink-300 to-purple-300 mx-auto rounded-full"></div>
      </section>

      {/* The Fusion - Split Layout */}
      <section className="py-20 bg-pink-50 overflow-hidden">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row items-center gap-16">
                  <div className="w-full md:w-1/2 relative group">
                      <div className="absolute -top-4 -left-4 w-full h-full border-2 border-pink-200 rounded-2xl group-hover:top-4 group-hover:left-4 transition-all duration-500"></div>
                      <img 
                        src="https://picsum.photos/id/60/800/1000" 
                        alt="Italian Laboratory" 
                        className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[4/5] transform group-hover:scale-105 transition duration-700"
                      />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6">
                      <span className="text-pink-600 font-bold tracking-widest text-sm uppercase flex items-center gap-2">
                        <FlaskConical size={18}/> {t('story.italy_title')}
                      </span>
                      <h3 className="text-4xl font-serif font-bold text-gray-900">{t('story.italy_sub')}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {t('story.italy_desc')}
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Khmer Soul - Reverse Split */}
      <section className="py-20 bg-white overflow-hidden">
          <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row-reverse items-center gap-16">
                  <div className="w-full md:w-1/2 relative group">
                      <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-green-100 rounded-2xl group-hover:bottom-4 group-hover:right-4 transition-all duration-500"></div>
                      <img 
                        src="https://picsum.photos/id/292/800/1000" 
                        alt="Cambodian Nature" 
                        className="rounded-2xl shadow-2xl relative z-10 w-full object-cover aspect-[4/5] transform group-hover:scale-105 transition duration-700"
                      />
                  </div>
                  <div className="w-full md:w-1/2 space-y-6 md:text-right">
                      <span className="text-green-600 font-bold tracking-widest text-sm uppercase flex items-center justify-end gap-2">
                        {t('story.khmer_title')} <Leaf size={18}/>
                      </span>
                      <h3 className="text-4xl font-serif font-bold text-gray-900">{t('story.khmer_sub')}</h3>
                      <p className="text-gray-600 leading-relaxed text-lg">
                        {t('story.khmer_desc')}
                      </p>
                  </div>
              </div>
          </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-gradient-to-b from-white to-pink-50/50">
          <div className="container mx-auto px-6">
              <div className="text-center mb-16">
                  <span className="text-pink-600 font-bold tracking-widest text-xs uppercase">{t('story.history')}</span>
                  <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mt-2">{t('story.journey')}</h2>
                  <div className="w-24 h-1 bg-pink-200 mx-auto rounded-full mt-4"></div>
              </div>

              <div className="relative max-w-5xl mx-auto">
                  {/* Vertical Line */}
                  <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-0.5 h-full bg-pink-200"></div>

                  {MILESTONES.map((item, index) => (
                      <div key={index} className={`relative flex items-center justify-between mb-12 md:mb-24 ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                          <div className="hidden md:block w-5/12"></div>
                          <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 rounded-full bg-white border-4 border-pink-100 shadow-sm z-10">
                              <div className="text-pink-600">{item.icon}</div>
                          </div>
                          <div className={`w-full pl-24 md:pl-0 md:w-5/12 ${index % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                              <div className="group cursor-default hover:-translate-y-1 transition duration-300">
                                  <span className="inline-block px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-xs font-bold mb-3 group-hover:bg-pink-600 group-hover:text-white transition-colors duration-300">
                                      {item.year}
                                  </span>
                                  <h3 className="text-xl font-serif font-bold text-gray-900 mb-2">{item.title}</h3>
                                  <p className="text-gray-600 leading-relaxed text-sm md:text-base">{item.desc}</p>
                              </div>
                          </div>
                      </div>
                  ))}
              </div>
          </div>
      </section>
    </div>
  );
};

// 5. PRODUCT FORM COMPONENT
interface ProductFormProps {
  initialData?: Product | null;
  onSave: (data: Product) => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Partial<Product>>(
    initialData || {
      name: '',
      nameKm: '',
      description: '',
      descriptionKm: '',
      price: 0,
      costPrice: 0,
      category: 'Face Care',
      categoryKm: 'ថែរក្សាមុខ',
      image: 'https://picsum.photos/id/100/600/600',
      rating: 5,
      reviews: 0,
      isNewArrival: true
    }
  );

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'English Name is required';
    if (!formData.nameKm) newErrors.nameKm = 'Khmer Name is required';
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.costPrice || Number(formData.costPrice) <= 0) newErrors.costPrice = 'Valid cost price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.image) newErrors.image = 'Image URL is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
       const productToSave: Product = {
         id: formData.id || Date.now().toString(),
         name: formData.name!,
         nameKm: formData.nameKm,
         description: formData.description || '',
         descriptionKm: formData.descriptionKm,
         price: Number(formData.price),
         costPrice: Number(formData.costPrice),
         category: formData.category!,
         categoryKm: formData.categoryKm,
         image: formData.image!,
         rating: formData.rating || 5,
         reviews: formData.reviews || 0,
         isNewArrival: formData.isNewArrival
       };
       onSave(productToSave); 
    }
  };

  const handleChange = (field: keyof Product, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[field];
        return newErrs;
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col">
        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
           <h2 className="text-xl font-bold font-serif text-gray-800">{initialData ? 'Edit Product' : 'Add New Product'}</h2>
           <button onClick={onCancel} className="text-gray-400 hover:text-gray-600"><XCircle size={24}/></button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Image Preview */}
            <div className="col-span-1 md:col-span-2 flex justify-center mb-4">
               <div className="relative w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 bg-gray-50 group">
                  {formData.image ? (
                    <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                       <ImageIcon size={24} />
                       <span className="text-xs mt-1">No Image</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-xs cursor-pointer">Change</div>
               </div>
            </div>
            
            {/* Basic Info */}
            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Product Name (EN)</label>
                 <input 
                    type="text" 
                    value={formData.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 outline-none ${errors.name ? 'border-red-500 ring-red-100' : 'border-gray-200 ring-pink-100'}`}
                    placeholder="e.g. Night Cream"
                 />
                 {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Price ($)</label>
                 <input 
                    type="number" 
                    value={formData.price} 
                    onChange={e => handleChange('price', e.target.value)}
                    className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 outline-none ${errors.price ? 'border-red-500 ring-red-100' : 'border-gray-200 ring-pink-100'}`}
                 />
                 {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Category (EN)</label>
                 <select 
                    value={formData.category} 
                    onChange={e => handleChange('category', e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 border-gray-200 ring-pink-100 outline-none"
                 >
                   {INITIAL_CATEGORIES.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                 </select>
               </div>
            </div>

            <div className="space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Product Name (KM)</label>
                 <input 
                    type="text" 
                    value={formData.nameKm} 
                    onChange={e => handleChange('nameKm', e.target.value)}
                    className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 outline-none ${errors.nameKm ? 'border-red-500 ring-red-100' : 'border-gray-200 ring-pink-100'}`}
                    placeholder="e.g. ក្រែមលាបមុខ"
                 />
                 {errors.nameKm && <p className="text-red-500 text-xs mt-1">{errors.nameKm}</p>}
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Cost Price ($)</label>
                 <input 
                    type="number" 
                    value={formData.costPrice} 
                    onChange={e => handleChange('costPrice', e.target.value)}
                    className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 outline-none ${errors.costPrice ? 'border-red-500 ring-red-100' : 'border-gray-200 ring-pink-100'}`}
                 />
                 {errors.costPrice && <p className="text-red-500 text-xs mt-1">{errors.costPrice}</p>}
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Category (KM)</label>
                 <input 
                    type="text" 
                    value={formData.categoryKm} 
                    onChange={e => handleChange('categoryKm', e.target.value)}
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 border-gray-200 ring-pink-100 outline-none"
                 />
               </div>
            </div>

            <div className="col-span-1 md:col-span-2 space-y-4">
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Image URL</label>
                 <input 
                    type="text" 
                    value={formData.image} 
                    onChange={e => handleChange('image', e.target.value)}
                    className={`w-full border rounded-lg p-2.5 text-sm focus:ring-2 outline-none ${errors.image ? 'border-red-500 ring-red-100' : 'border-gray-200 ring-pink-100'}`}
                 />
                 {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Description (EN)</label>
                 <textarea 
                    value={formData.description} 
                    onChange={e => handleChange('description', e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 border-gray-200 ring-pink-100 outline-none"
                 />
               </div>
               <div>
                 <label className="block text-xs font-bold text-gray-500 mb-1">Description (KM)</label>
                 <textarea 
                    value={formData.descriptionKm} 
                    onChange={e => handleChange('descriptionKm', e.target.value)}
                    rows={3}
                    className="w-full border rounded-lg p-2.5 text-sm focus:ring-2 border-gray-200 ring-pink-100 outline-none"
                 />
               </div>
               <div className="flex items-center gap-2">
                 <input 
                    type="checkbox" 
                    id="isNew"
                    checked={formData.isNewArrival} 
                    onChange={e => handleChange('isNewArrival', e.target.checked)}
                    className="w-4 h-4 text-pink-600 border-gray-300 rounded focus:ring-pink-500"
                 />
                 <label htmlFor="isNew" className="text-sm font-medium text-gray-700">Mark as New Arrival</label>
               </div>
            </div>
          </div>
        </form>

        <div className="p-4 border-t bg-gray-50 flex justify-end gap-3">
           <button onClick={onCancel} className="px-6 py-2 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition">Cancel</button>
           <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-pink-600 text-white font-bold hover:bg-pink-700 transition flex items-center gap-2">
             <Save size={18} /> Save Product
           </button>
        </div>
      </div>
    </div>
  );
};

// 6. User Profile Component
const UserProfile = ({ t, lang }: { t: any, lang: string }) => {
  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Sidebar / User Info */}
        <div className="w-full lg:w-1/3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-pink-100 mb-4 flex items-center justify-center text-pink-600 font-bold text-3xl">
              S
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-1">Sokha Dara</h2>
            <p className="text-gray-500 mb-4">sokha.dara@example.com</p>
            <div className="flex items-center gap-2 text-sm text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
               <Calendar size={14} />
               <span>{t('profile.member')} 2023</span>
            </div>
          </div>
        </div>

        {/* Order History */}
        <div className="w-full lg:w-2/3">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-6 flex items-center gap-2">
            <PackageOpen size={24} className="text-pink-600"/>
            {t('profile.orders')}
          </h2>
          
          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => {
              const statusColor = 
                order.status === 'Shipped' ? 'bg-green-100 text-green-700' :
                order.status === 'Processing' ? 'bg-blue-100 text-blue-700' :
                'bg-yellow-100 text-yellow-700';
              
              const statusIcon =
                order.status === 'Shipped' ? <CheckCircle size={16} /> :
                order.status === 'Processing' ? <Truck size={16} /> :
                <Clock size={16} />;

              return (
                <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-50 flex flex-wrap justify-between items-center gap-4">
                    <div>
                       <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-lg text-gray-800">{order.id}</span>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${statusColor}`}>
                             {statusIcon}
                             {t(`status.${order.status}`)}
                          </span>
                       </div>
                       <p className="text-sm text-gray-500 flex items-center gap-2">
                          <Calendar size={14}/> {order.date}
                       </p>
                    </div>
                    <div className="text-right">
                       <p className="text-sm text-gray-500">{t('order.total')}</p>
                       <p className="text-xl font-bold text-pink-600">${order.total.toFixed(2)}</p>
                    </div>
                  </div>
                  
                  {/* Order Items */}
                  <div className="p-6 bg-gray-50/50">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{t('order.items')}</p>
                    <div className="space-y-3">
                       {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4">
                             <div className="w-12 h-12 rounded bg-white border border-gray-200 overflow-hidden">
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover"/>
                             </div>
                             <div className="flex-1">
                                <p className="font-bold text-sm text-gray-800">{lang === 'km' && item.nameKm ? item.nameKm : item.name}</p>
                                <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.price.toFixed(2)}</p>
                             </div>
                          </div>
                       ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

// 7. MAIN APP
const App = () => {
  const [view, setView] = useState<'home' | 'products' | 'story' | 'dashboard' | 'profile'>('home');
  const [lang, setLang] = useState<'en' | 'km'>('en');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [checkoutStep, setCheckoutStep] = useState(0); // 0: closed, 1: review, 2: ship, 3: pay
  const [flyingImages, setFlyingImages] = useState<{id: number, src: string, start: DOMRect, target: DOMRect}[]>([]);
  const [isAiOpen, setIsAiOpen] = useState(false);
  
  // Checkout State
  const [shippingInfo, setShippingInfo] = useState({ name: '', phone: '', address: '', province: '' });

  // Dashboard State
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Translation function
  const t = (key: string) => {
    // @ts-ignore
    return TRANSLATIONS[lang]?.[key] || key;
  };

  // Cart Logic
  const addToCart = (product: Product, startRect?: DOMRect) => {
    if (startRect) {
      const cartBtn = document.getElementById('cart-btn');
      if (cartBtn) {
        const targetRect = cartBtn.getBoundingClientRect();
        const id = Date.now();
        setFlyingImages(prev => [...prev, { id, src: product.image, start: startRect, target: targetRect }]);
      }
    }

    setCart(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Wishlist Logic
  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  // Helper for names
  const getProductName = (p: Product) => (lang === 'km' && p.nameKm) ? p.nameKm : p.name;
  const getProductDesc = (p: Product) => (lang === 'km' && p.descriptionKm) ? p.descriptionKm : p.description;
  const getCatName = (c: Category) => (lang === 'km' && c.nameKm) ? c.nameKm : c.name;

  // Admin Handlers
  const handleSaveProduct = (product: Product) => {
    if (editingProduct) {
      setProducts(prev => prev.map(p => p.id === product.id ? product : p));
    } else {
      setProducts(prev => [...prev, product]);
    }
    setIsProductFormOpen(false);
    setEditingProduct(null);
  };

  const handleDeleteProduct = (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(prev => prev.filter(p => p.id !== id));
    }
  };

  const openEditProduct = (product: Product) => {
    setEditingProduct(product);
    setIsProductFormOpen(true);
  };

  const openAddProduct = () => {
    setEditingProduct(null);
    setIsProductFormOpen(true);
  };

  // AI Assistant Component
  const AiAssistant = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([
      { role: 'model', text: lang === 'km' ? "សួស្តី! ខ្ញុំគឺ CYRA AI។ តើខ្ញុំអាចជួយអ្នកឱ្យស្បែកភ្លឺថ្លាដោយរបៀបណា?" : "Suasdey! I'm CYRA AI. How can I help you achieve glowing skin today?" }
    ]);
    const [input, setInput] = useState('');
    const [mode, setMode] = useState<'chat' | 'skin'>('chat');
    const [loading, setLoading] = useState(false);
    const [skinAnalysisImage, setSkinAnalysisImage] = useState<string | null>(null);
    const chatEndRef = useRef<HTMLDivElement>(null);
    
    // Camera State
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const handleSend = async () => {
      if (!input.trim() && !skinAnalysisImage) return;

      const userMsg: ChatMessage = { role: 'user', text: input, image: skinAnalysisImage || undefined };
      setMessages(prev => [...prev, userMsg]);
      setInput('');
      setLoading(true);

      if (mode === 'skin' && skinAnalysisImage) {
        // Skin doctor analysis (returns string currently)
        const responseText = await analyzeSkinImage(skinAnalysisImage.split(',')[1], products);
        setMessages(prev => [...prev, { role: 'model', text: responseText }]);
        setSkinAnalysisImage(null);
      } else {
        // Chat mode with structured history and response
        const history = messages.map(m => ({ role: m.role, text: m.text }));
        const { text, recommendedProductIds } = await generateChatResponse(history, userMsg.text, products);
        
        setMessages(prev => [...prev, { 
           role: 'model', 
           text, 
           isProductRecommendation: recommendedProductIds.length > 0,
           recommendedProductIds
        }]);
      }
      setLoading(false);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          setSkinAnalysisImage(ev.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    
    // Camera Functions
    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            setStream(mediaStream);
            setIsCameraOpen(true);
            setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.srcObject = mediaStream;
                    videoRef.current.play();
                }
            }, 100);
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("Unable to access camera. Please check permissions.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                const imageDataUrl = canvas.toDataURL('image/jpeg');
                setSkinAnalysisImage(imageDataUrl);
                stopCamera();
            }
        }
    };

    useEffect(() => {
        return () => {
            if (stream) stream.getTracks().forEach(track => track.stop());
        };
    }, [stream]);

    useEffect(() => {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
      <div className="fixed bottom-20 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden border border-pink-100 animate-slideIn">
        {/* Camera Overlay */}
        {isCameraOpen && (
            <div className="absolute inset-0 bg-black z-50 flex flex-col animate-fadeIn">
                <div className="flex justify-between items-center p-4 text-white">
                    <h3 className="font-bold">Take Photo</h3>
                    <button onClick={stopCamera}><X size={24}/></button>
                </div>
                <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
                    <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                </div>
                <div className="p-4 bg-black flex justify-center pb-8">
                    <button 
                        onClick={capturePhoto} 
                        className="w-16 h-16 bg-white rounded-full border-4 border-gray-300 flex items-center justify-center active:scale-95 transition"
                    >
                        <div className="w-14 h-14 bg-white rounded-full border-2 border-black"></div>
                    </button>
                </div>
            </div>
        )}

        <div className="bg-gradient-to-r from-pink-600 to-purple-600 p-4 text-white flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h3 className="font-bold">{t('ai.title')}</h3>
          </div>
          <button onClick={() => setIsAiOpen(false)}><X size={18} /></button>
        </div>
        
        <div className="flex border-b">
          <button 
            onClick={() => setMode('chat')} 
            className={`flex-1 p-3 text-sm font-medium ${mode === 'chat' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
          >
            {t('ai.chat')}
          </button>
          <button 
            onClick={() => setMode('skin')} 
            className={`flex-1 p-3 text-sm font-medium ${mode === 'skin' ? 'text-pink-600 border-b-2 border-pink-600' : 'text-gray-500'}`}
          >
             {t('ai.doctor')}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[90%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-pink-600 text-white rounded-tr-none' : 'bg-white text-gray-800 shadow-sm rounded-tl-none border border-gray-100'}`}>
                {msg.image && <img src={msg.image} className="w-full rounded-lg mb-2" alt="upload" />}
                <p className="whitespace-pre-wrap">{msg.text}</p>
                
                {/* Render Recommended Products */}
                {msg.recommendedProductIds && msg.recommendedProductIds.length > 0 && (
                   <div className="mt-3 space-y-3">
                      {msg.recommendedProductIds.map(id => {
                          const p = products.find(prod => prod.id === id);
                          if (!p) return null;
                          const pName = lang === 'km' && p.nameKm ? p.nameKm : p.name;
                          const pDesc = lang === 'km' && p.descriptionKm ? p.descriptionKm : p.description;

                          return (
                              <div key={id} className="bg-white p-3 rounded-xl border border-pink-100 shadow-sm flex gap-3 hover:shadow-md transition items-start">
                                  <img src={p.image} className="w-16 h-16 object-cover rounded-lg bg-gray-100 shrink-0" />
                                  <div className="flex-1 min-w-0">
                                      <div className="text-sm font-bold text-gray-800 leading-tight mb-1">{pName}</div>
                                      <div className="text-xs text-gray-500 line-clamp-2 mb-2">{pDesc}</div>
                                      <div className="flex justify-between items-center">
                                          <div className="text-pink-600 font-bold text-sm">${p.price}</div>
                                          <button 
                                              onClick={(e) => addToCart(p, e.currentTarget.getBoundingClientRect())}
                                              className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-full hover:bg-pink-600 transition flex items-center gap-1 shadow-sm"
                                          >
                                              <ShoppingBag size={12} /> {t('btn.add')}
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          )
                      })}
                   </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-2">
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-100"></div>
                <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce delay-200"></div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div className="p-3 bg-white border-t">
          {mode === 'skin' && !skinAnalysisImage && !isCameraOpen && (
            <div className="flex gap-2 mb-2">
              <label className="flex-1 flex items-center justify-center gap-2 p-2 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 text-pink-600 text-sm font-medium">
                <Upload size={16} /> {t('ai.upload')}
                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
              </label>
              <button 
                  onClick={startCamera}
                  className="flex-1 flex items-center justify-center gap-2 p-2 border-2 border-dashed border-pink-200 rounded-lg cursor-pointer hover:bg-pink-50 text-pink-600 text-sm font-medium"
              >
                  <Camera size={16} /> {t('ai.camera')}
              </button>
            </div>
          )}
          {mode === 'skin' && skinAnalysisImage && (
            <div className="mb-2 relative w-16 h-16">
               <img src={skinAnalysisImage} className="w-full h-full object-cover rounded-lg" />
               <button onClick={() => setSkinAnalysisImage(null)} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-0.5"><X size={12}/></button>
            </div>
          )}
          <div className="flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={mode === 'chat' ? t('ai.placeholder') : t('ai.placeholder_skin')}
              className="flex-1 bg-gray-100 border-0 rounded-full px-4 text-sm focus:ring-2 focus:ring-pink-300 outline-none"
            />
            <button onClick={handleSend} className="bg-pink-600 text-white p-2 rounded-full hover:bg-pink-700 transition">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render Logic
  return (
    <div className={`min-h-screen font-sans text-gray-800 bg-gray-50 ${lang === 'km' ? 'font-khmer' : ''}`}>
      {/* HEADER */}
      <Header 
        cartCount={cart.reduce((a, b) => a + b.quantity, 0)} 
        onOpenCart={() => setIsCartOpen(true)} 
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
        navigate={setView}
        view={view}
        lang={lang}
        setLang={setLang}
        t={t}
      />

      {/* FLYING IMAGES */}
      {flyingImages.map((img) => (
        <FlyingImage 
          key={img.id} 
          src={img.src} 
          startRect={img.start} 
          targetRect={img.target} 
          onComplete={() => setFlyingImages(prev => prev.filter(i => i.id !== img.id))} 
        />
      ))}

      {/* VIEWS */}
      <main className="pb-20">
        {view === 'home' && (
          <>
            <Hero onShopNow={() => setView('products')} t={t} />
            
            {/* Categories */}
            <section className="py-12 container mx-auto px-4">
              <h2 className="text-2xl font-serif font-bold text-center mb-8">{t('cat.shop')}</h2>
              <div className="flex justify-center gap-4 md:gap-8 overflow-x-auto pb-4 no-scrollbar">
                {INITIAL_CATEGORIES.map(cat => (
                  <div key={cat.id} className="flex flex-col items-center gap-3 min-w-[100px] cursor-pointer group" onClick={() => { setActiveCategory(cat.name); setView('products'); }}>
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-[2px] bg-gradient-to-tr from-yellow-400 to-pink-600">
                      <div className="w-full h-full rounded-full border-2 border-white overflow-hidden">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition" />
                      </div>
                    </div>
                    <span className="text-sm font-medium">{getCatName(cat)}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured Products */}
            <section className="py-12 bg-white">
              <div className="container mx-auto px-4">
                <h2 className="text-3xl font-serif font-bold text-center mb-12">{t('sect.newArrivals')}</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {products.slice(0, 4).map(product => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      onAdd={addToCart} 
                      onView={setSelectedProduct} 
                      isWishlist={wishlist.includes(product.id)}
                      onToggleWishlist={toggleWishlist}
                      lang={lang} 
                      t={t} 
                    />
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {view === 'products' && (
          <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-serif font-bold mb-8 text-center">{t('sect.ourCollection')}</h1>
            
            {/* Filter Tabs - Modern & Visual */}
            <div className="sticky top-16 z-30 bg-gray-50/95 backdrop-blur-sm py-4 -mx-4 px-4 mb-6 border-b border-gray-200/50">
              <div className="flex justify-start md:justify-center gap-3 overflow-x-auto no-scrollbar pb-2">
                  <button 
                    onClick={() => setActiveCategory('all')} 
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-all shadow-sm whitespace-nowrap border shrink-0 ${activeCategory === 'all' ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-200 scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-600'}`}
                  >
                    <LayoutDashboard size={18} />
                    {t('btn.all')}
                  </button>
                  {INITIAL_CATEGORIES.map(c => (
                    <button 
                      key={c.id} 
                      onClick={() => setActiveCategory(c.name)}
                      className={`flex items-center gap-3 pl-2 pr-6 py-2 rounded-full text-sm font-bold transition-all shadow-sm whitespace-nowrap border shrink-0 ${activeCategory === c.name ? 'bg-pink-600 text-white border-pink-600 shadow-lg shadow-pink-200 scale-105' : 'bg-white text-gray-600 border-gray-200 hover:border-pink-300 hover:text-pink-600'}`}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/50 shadow-sm">
                        <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                      </div>
                      {getCatName(c)}
                    </button>
                  ))}
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.filter(p => activeCategory === 'all' || p.category === activeCategory).map(product => (
                <ProductCard 
                  key={product.id} 
                  product={product} 
                  onAdd={addToCart} 
                  onView={setSelectedProduct}
                  isWishlist={wishlist.includes(product.id)}
                  onToggleWishlist={toggleWishlist} 
                  lang={lang} 
                  t={t} 
                />
              ))}
            </div>
          </div>
        )}

        {view === 'story' && (
          <StorySection navigate={setView} t={t} lang={lang} />
        )}

        {view === 'profile' && (
           <UserProfile t={t} lang={lang} />
        )}

        {view === 'dashboard' && (
          <div className="min-h-screen bg-gray-100 p-6">
            {!isAdmin ? (
               <div className="flex justify-center items-center h-[60vh]">
                 <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
                   <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
                   <input type="password" placeholder="Password (123)" className="w-full p-3 border rounded-lg mb-4" onChange={(e) => setAdminPass(e.target.value)} />
                   <button onClick={() => { if(adminPass === '123') setIsAdmin(true); }} className="w-full bg-pink-600 text-white p-3 rounded-lg hover:bg-pink-700 font-bold">{t('btn.login')}</button>
                 </div>
               </div>
            ) : (
              <div className="container mx-auto">
                <div className="flex justify-between items-center mb-8">
                   <h1 className="text-2xl font-bold flex items-center gap-2"><LayoutDashboard /> Admin Dashboard</h1>
                   <button onClick={() => setIsAdmin(false)} className="text-red-500 hover:bg-red-50 p-2 rounded flex items-center gap-2"><LogOut size={16}/> Logout</button>
                </div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm font-medium mb-1">Total Sales</h3>
                      <p className="text-3xl font-bold text-gray-800">$12,450.00</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm font-medium mb-1">Orders</h3>
                      <p className="text-3xl font-bold text-gray-800">342</p>
                   </div>
                   <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                      <h3 className="text-gray-500 text-sm font-medium mb-1">Customers</h3>
                      <p className="text-3xl font-bold text-gray-800">1,209</p>
                   </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 h-80">
                  <h3 className="font-bold mb-4">Sales Overview</h3>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      {name: 'Jan', uv: 4000}, {name: 'Feb', uv: 3000}, {name: 'Mar', uv: 2000},
                      {name: 'Apr', uv: 2780}, {name: 'May', uv: 1890}, {name: 'Jun', uv: 2390},
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee"/>
                      <XAxis dataKey="name" axisLine={false} tickLine={false} />
                      <YAxis axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                      <Area type="monotone" dataKey="uv" stroke="#EC4899" fill="#FCE7F3" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* PRODUCT MANAGEMENT SECTION */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                   <div className="p-6 border-b flex justify-between items-center">
                      <h3 className="font-bold text-lg">Product Management</h3>
                      <button 
                        onClick={openAddProduct}
                        className="bg-pink-600 text-white px-4 py-2 rounded-lg font-bold text-sm hover:bg-pink-700 transition flex items-center gap-2"
                      >
                        <Plus size={18} /> Add Product
                      </button>
                   </div>
                   <div className="overflow-x-auto">
                     <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase tracking-wider">
                           <tr>
                              <th className="p-4 font-medium">Product</th>
                              <th className="p-4 font-medium">Category</th>
                              <th className="p-4 font-medium">Price</th>
                              <th className="p-4 font-medium">Cost</th>
                              <th className="p-4 font-medium">Status</th>
                              <th className="p-4 font-medium text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                           {products.map(p => (
                             <tr key={p.id} className="hover:bg-pink-50/30 transition">
                                <td className="p-4">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                                         <img src={p.image} className="w-full h-full object-cover"/>
                                      </div>
                                      <div>
                                         <p className="font-bold text-gray-800 text-sm">{p.name}</p>
                                         <p className="text-xs text-gray-400">{p.nameKm}</p>
                                      </div>
                                   </div>
                                </td>
                                <td className="p-4 text-sm text-gray-600">
                                   {p.category}
                                   <div className="text-xs text-gray-400">{p.categoryKm}</div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">${p.price.toFixed(2)}</td>
                                <td className="p-4 text-sm text-gray-500">${p.costPrice.toFixed(2)}</td>
                                <td className="p-4">
                                   {p.isNewArrival && <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">New</span>}
                                </td>
                                <td className="p-4 text-right">
                                   <div className="flex items-center justify-end gap-2">
                                      <button 
                                        onClick={() => openEditProduct(p)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                                      >
                                         <Edit size={16}/>
                                      </button>
                                      <button 
                                        onClick={() => handleDeleteProduct(p.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition"
                                      >
                                         <Trash2 size={16}/>
                                      </button>
                                   </div>
                                </td>
                             </tr>
                           ))}
                        </tbody>
                     </table>
                   </div>
                </div>

                {isProductFormOpen && (
                  <ProductForm 
                    initialData={editingProduct} 
                    onSave={handleSaveProduct} 
                    onCancel={() => { setIsProductFormOpen(false); setEditingProduct(null); }}
                  />
                )}
              </div>
            )}
          </div>
        )}
      </main>

      {/* AI FAB */}
      <button 
        onClick={() => setIsAiOpen(!isAiOpen)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition z-50 animate-bounce-slow"
      >
        <Sparkles size={24} />
      </button>

      {isAiOpen && <AiAssistant />}

      {/* MODALS */}
      
      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-2xl">
             <div className="w-full md:w-1/2 relative bg-gray-100">
               <img src={selectedProduct.image} className="w-full h-full object-cover" />
               <button onClick={() => setSelectedProduct(null)} className="absolute top-4 left-4 bg-white/50 p-2 rounded-full md:hidden"><X size={20}/></button>
             </div>
             <div className="w-full md:w-1/2 p-8 relative">
               <button onClick={() => setSelectedProduct(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 hidden md:block"><X size={24}/></button>
               <span className="text-pink-600 font-bold text-sm tracking-wider uppercase mb-2 block">{selectedProduct.category}</span>
               <h2 className="text-3xl font-serif font-bold mb-4">{getProductName(selectedProduct)}</h2>
               
               <div className="flex items-center gap-4 mb-6">
                 <span className="text-2xl font-bold text-gray-900">${selectedProduct.price.toFixed(2)}</span>
                 <div className="flex items-center gap-1 text-yellow-400">
                   {[...Array(5)].map((_, i) => <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} />)}
                   <span className="text-gray-400 text-sm ml-2">({selectedProduct.reviews} {t('common.reviews')})</span>
                 </div>
               </div>

               <p className="text-gray-600 leading-relaxed mb-8">{getProductDesc(selectedProduct)}</p>

               <div className="flex gap-4 mb-8">
                 <button 
                   onClick={(e) => { 
                      addToCart(selectedProduct, (e.target as HTMLElement).getBoundingClientRect()); 
                      setSelectedProduct(null); 
                   }}
                   className="flex-1 bg-gray-900 text-white py-4 rounded-full font-bold hover:bg-pink-600 transition shadow-xl"
                 >
                   {t('btn.addToCart')}
                 </button>
                 <button 
                   onClick={() => toggleWishlist(selectedProduct.id)}
                   className={`p-4 border rounded-full transition ${wishlist.includes(selectedProduct.id) ? 'bg-pink-500 text-white border-pink-500' : 'border-gray-200 hover:bg-pink-50 hover:text-pink-600'}`}
                 >
                   <Heart size={24} fill={wishlist.includes(selectedProduct.id) ? "currentColor" : "none"}/>
                 </button>
               </div>

               {/* Reviews */}
               <div className="border-t pt-8">
                 <h3 className="font-serif font-bold text-xl mb-6 flex items-center justify-between">
                    {t('common.reviews')} 
                    <span className="text-sm font-sans font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{selectedProduct.reviews} {t('common.verified')}</span>
                 </h3>
                 
                 {/* Rating Chart */}
                 <div className="flex flex-col sm:flex-row items-center gap-8 mb-8 bg-gray-50 p-6 rounded-2xl">
                    <div className="text-center min-w-[120px]">
                       <div className="text-5xl font-serif font-bold text-gray-900 mb-2">{selectedProduct.rating}</div>
                       <div className="flex justify-center gap-1 text-yellow-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                             <Star key={i} size={16} fill={i < Math.floor(selectedProduct.rating) ? "currentColor" : "none"} className={i >= Math.floor(selectedProduct.rating) ? "text-gray-300" : ""} />
                          ))}
                       </div>
                    </div>
                    <div className="flex-1 w-full h-32">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart 
                                layout="vertical" 
                                data={[
                                    { name: '5', value: 78 },
                                    { name: '4', value: 12 },
                                    { name: '3', value: 6 },
                                    { name: '2', value: 3 },
                                    { name: '1', value: 1 },
                                ]} 
                                margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                            >
                                <XAxis type="number" hide />
                                <YAxis dataKey="name" type="category" width={30} axisLine={false} tickLine={false} tickFormatter={(val) => `${val} ★`} tick={{fontSize: 12, fill: '#6b7280'}} />
                                <Bar dataKey="value" barSize={8} radius={[4, 4, 4, 4]} background={{ fill: '#e5e7eb', radius: 4 }}>
                                    {[78, 12, 6, 3, 1].map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={`rgba(236, 72, 153, ${1 - (index * 0.15)})`} />
                                    ))}
                                </Bar>
                                <Tooltip cursor={{fill: 'transparent'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </div>

                 <div className="space-y-6">
                   {MOCK_REVIEWS.map((r, i) => (
                     <div key={i} className="border-b border-gray-100 pb-6 last:border-0 last:pb-0">
                       <div className="flex justify-between items-start mb-2">
                         <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold">
                                {r.user.charAt(0)}
                            </div>
                            <div>
                                <span className="font-bold text-gray-900 block">{r.user}</span>
                                <div className="flex text-yellow-400 text-xs">
                                    {[...Array(5)].map((_, j) => (
                                        <Star key={j} size={12} fill={j < r.rating ? "currentColor" : "none"} className={j >= r.rating ? "text-gray-200" : ""} />
                                    ))}
                                </div>
                            </div>
                         </div>
                         <span className="text-xs text-gray-400">{r.date}</span>
                       </div>
                       <p className="text-gray-600 text-sm leading-relaxed mt-2 pl-13 ml-13">"{r.comment}"</p>
                     </div>
                   ))}
                 </div>
               </div>
             </div>
          </div>
        </div>
      )}

      {/* Cart Drawer */}
      {isCartOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-serif font-bold text-xl">{t('cart.title')} ({cart.length})</h2>
              <button onClick={() => setIsCartOpen(false)}><X size={24} className="text-gray-500"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <ShoppingBag size={48} className="mx-auto mb-4 opacity-50"/>
                  <p>{t('cart.empty')}</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{lang === 'km' && item.nameKm ? item.nameKm : item.name}</h4>
                      <p className="text-gray-500 text-xs mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-pink-600">${item.price}</span>
                        <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-2 py-1">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:text-pink-600"><Minus size={12}/></button>
                          <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:text-pink-600"><Plus size={12}/></button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="text-gray-300 hover:text-red-500 self-start"><X size={16}/></button>
                  </div>
                ))
              )}
            </div>

            <div className="p-6 border-t bg-gray-50">
              <div className="flex justify-between mb-4 text-lg font-bold">
                <span>{t('cart.subtotal')}</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => { setIsCartOpen(false); setCheckoutStep(1); }}
                disabled={cart.length === 0}
                className="w-full bg-pink-600 text-white py-4 rounded-xl font-bold hover:bg-pink-700 transition disabled:opacity-50"
              >
                {t('btn.checkout')}
              </button>
            </div>
          </div>
        </>
      )}

       {/* Wishlist Drawer */}
       {isWishlistOpen && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm" onClick={() => setIsWishlistOpen(false)}></div>
          <div className="fixed top-0 right-0 h-full w-full md:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 flex flex-col">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h2 className="font-serif font-bold text-xl">{t('wishlist.title')} ({wishlist.length})</h2>
              <button onClick={() => setIsWishlistOpen(false)}><X size={24} className="text-gray-500"/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {wishlistProducts.length === 0 ? (
                <div className="text-center text-gray-400 mt-20">
                  <Heart size={48} className="mx-auto mb-4 opacity-50"/>
                  <p>{t('wishlist.empty')}</p>
                </div>
              ) : (
                wishlistProducts.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <img src={item.image} className="w-20 h-20 rounded-lg object-cover bg-gray-100" />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm text-gray-800 line-clamp-1">{lang === 'km' && item.nameKm ? item.nameKm : item.name}</h4>
                      <p className="text-gray-500 text-xs mb-2">{item.category}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-bold text-pink-600">${item.price}</span>
                        <div className="flex items-center gap-2">
                           <button onClick={(e) => addToCart(item, (e.target as HTMLElement).getBoundingClientRect())} className="bg-gray-900 text-white p-1.5 rounded hover:bg-pink-600 text-xs flex items-center gap-1">
                              <Plus size={12} /> {t('btn.add')}
                           </button>
                        </div>
                      </div>
                    </div>
                    <button onClick={() => toggleWishlist(item.id)} className="text-gray-300 hover:text-red-500 self-start"><X size={16}/></button>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}

      {/* Checkout Modal */}
      {checkoutStep > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              {/* Header */}
              <div className="bg-gradient-to-r from-pink-50 to-white p-6 border-b flex justify-between items-center">
                 <div>
                    <h2 className="text-2xl font-serif font-bold text-gray-800">{t('checkout.title')}</h2>
                    <div className="flex gap-2 mt-2">
                       <div className={`h-1 w-12 rounded-full ${checkoutStep >= 1 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                       <div className={`h-1 w-12 rounded-full ${checkoutStep >= 2 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                       <div className={`h-1 w-12 rounded-full ${checkoutStep >= 3 ? 'bg-pink-600' : 'bg-gray-200'}`}></div>
                    </div>
                 </div>
                 <button onClick={() => setCheckoutStep(0)} className="text-gray-400 hover:text-gray-600"><X size={24}/></button>
              </div>

              {/* Body */}
              <div className="p-8 overflow-y-auto flex-1">
                 {checkoutStep === 1 && (
                    <div className="space-y-4">
                       <h3 className="font-bold text-lg mb-4">{t('checkout.step1')}</h3>
                       {cart.map(item => (
                          <div key={item.id} className="flex justify-between items-center border-b pb-2">
                             <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-md bg-gray-100 overflow-hidden">
                                   <img src={item.image} className="w-full h-full object-cover"/>
                                </div>
                                <div>
                                   <p className="font-medium">{lang === 'km' && item.nameKm ? item.nameKm : item.name}</p>
                                   <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                </div>
                             </div>
                             <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                       ))}
                       <div className="flex justify-between font-bold text-xl mt-6">
                          <span>{t('checkout.total')}</span>
                          <span className="text-pink-600">${cartTotal.toFixed(2)}</span>
                       </div>
                    </div>
                 )}

                 {checkoutStep === 2 && (
                    <div className="space-y-4">
                       <h3 className="font-bold text-lg mb-4">{t('checkout.step2')}</h3>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="col-span-2 md:col-span-1">
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t('form.name')}</label>
                             <input type="text" className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 ring-pink-200 outline-none" placeholder="Sok Dara" onChange={e => setShippingInfo({...shippingInfo, name: e.target.value})} />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t('form.phone')}</label>
                             <input type="tel" className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 ring-pink-200 outline-none" placeholder="012 345 678" onChange={e => setShippingInfo({...shippingInfo, phone: e.target.value})} />
                          </div>
                          <div className="col-span-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t('form.province')}</label>
                             <select className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 ring-pink-200 outline-none" onChange={e => setShippingInfo({...shippingInfo, province: e.target.value})}>
                                <option value="">{t('checkout.select_province')}</option>
                                {/* @ts-ignore */}
                                {PROVINCES[lang].map(p => <option key={p} value={p}>{p}</option>)}
                             </select>
                          </div>
                          <div className="col-span-2">
                             <label className="block text-xs font-bold text-gray-500 mb-1">{t('form.address')}</label>
                             <textarea className="w-full border rounded-lg p-3 bg-gray-50 focus:ring-2 ring-pink-200 outline-none" rows={3} placeholder="Street, House No, Sangkat..." onChange={e => setShippingInfo({...shippingInfo, address: e.target.value})}></textarea>
                          </div>
                       </div>
                    </div>
                 )}

                 {checkoutStep === 3 && (
                    <div className="text-center">
                       <h3 className="font-bold text-lg mb-6">{t('checkout.step3')}</h3>
                       <div className="grid grid-cols-3 gap-4 mb-8">
                          <button className="border-2 border-pink-600 bg-pink-50 p-4 rounded-xl flex flex-col items-center justify-center gap-2">
                             <div className="w-10 h-10 bg-blue-900 rounded-lg flex items-center justify-center text-white font-bold text-xs">ABA</div>
                             <span className="text-sm font-bold">ABA Pay</span>
                          </button>
                          <button className="border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50">
                             <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center text-white font-bold text-xs">P</div>
                             <span className="text-sm">PayPal</span>
                          </button>
                          <button className="border border-gray-200 p-4 rounded-xl flex flex-col items-center justify-center gap-2 opacity-50">
                             <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">$$</div>
                             <span className="text-sm">Cash</span>
                          </button>
                       </div>
                       
                       <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-8 mb-4 w-64 h-64 mx-auto flex items-center justify-center">
                          <div className="text-center">
                             <div className="bg-black w-40 h-40 mx-auto mb-2"></div>
                             <p className="text-xs text-gray-400">{t('checkout.scan')} ${cartTotal.toFixed(2)}</p>
                          </div>
                       </div>
                    </div>
                 )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-gray-50 flex justify-between">
                 {checkoutStep > 1 ? (
                    <button onClick={() => setCheckoutStep(s => s - 1)} className="px-6 py-3 text-gray-600 font-bold hover:text-gray-900">{t('checkout.back')}</button>
                 ) : (
                    <div></div>
                 )}
                 <button 
                    onClick={() => {
                       if (checkoutStep < 3) setCheckoutStep(s => s + 1);
                       else {
                          alert('Order Placed Successfully!');
                          setCart([]);
                          setCheckoutStep(0);
                       }
                    }}
                    className="px-8 py-3 bg-pink-600 text-white rounded-xl font-bold hover:bg-pink-700 shadow-lg"
                 >
                    {checkoutStep === 3 ? t('checkout.confirm') : t('checkout.next')}
                 </button>
              </div>
           </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-white p-6 animate-slideIn">
           <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-bold font-serif text-pink-600">CYRA</h2>
              <button onClick={() => setIsMobileMenuOpen(false)}><X size={32}/></button>
           </div>
           <nav className="flex flex-col gap-6 text-xl font-medium">
              <button onClick={() => { setView('home'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b">{t('nav.home')}</button>
              <button onClick={() => { setView('products'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b">{t('nav.products')}</button>
              <button onClick={() => { setView('story'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b">{t('nav.story')}</button>
              <button onClick={() => { setView('dashboard'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b">{t('nav.dashboard')}</button>
              <button onClick={() => { setView('profile'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b">{t('profile.title')}</button>
              <button onClick={() => { setLang(lang === 'en' ? 'km' : 'en'); setIsMobileMenuOpen(false); }} className="text-left py-2 border-b text-pink-600">
                Switch Language ({lang === 'en' ? 'Khmer' : 'English'})
              </button>
           </nav>
        </div>
      )}

    </div>
  );
};

export default App;