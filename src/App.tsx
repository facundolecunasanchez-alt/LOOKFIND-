/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  X,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  Globe,
  Settings,
  Image as ImageIcon,
  Video,
  Newspaper,
  BookOpen,
  MapPin,
  ShoppingBag,
  Clock,
  ExternalLink,
  SlidersHorizontal,
  Check,
  Zap,
  Mic,
  Camera
} from 'lucide-react';

interface SearchResult {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
  date?: string;
  cached?: string;
  similar?: string;
  sponsored?: boolean;
}

export default function App() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [activeSidebarFilter, setActiveSidebarFilter] = useState<'todo' | 'imagenes' | 'videos' | 'noticias' | 'libros' | 'lugares'>('todo');
  const [timeFilter, setTimeFilter] = useState<'any' | 'hour' | 'day' | 'week' | 'year'>('any');
  const [instantSearch, setInstantSearch] = useState(true);
  const [showClear, setShowClear] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showLensModal, setShowLensModal] = useState(false);
  const [luckyToast, setLuckyToast] = useState<string | null>(null);
  const [statsTime, setStatsTime] = useState('0.18');
  const [statsCount, setStatsCount] = useState('18.400.000');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isMasDropdownOpen, setIsMasDropdownOpen] = useState(false);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const sharedBaseUrl = 'https://ais-pre-ta6fayocctoaaoffvjyz4i-299946243351.us-east1.run.app';

  const inputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const masDropdownRef = useRef<HTMLDivElement>(null);

  // Sync URL on initial mount and browser back/forward (popstate)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const initialQ = params.get('q');
    const initialTab = params.get('tab') as any;

    if (initialQ) {
      setQuery(initialQ);
      setIsSearching(true);
      if (initialTab && ['todo', 'imagenes', 'videos', 'noticias', 'libros', 'lugares'].includes(initialTab)) {
        setActiveSidebarFilter(initialTab);
      }
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const popQ = p.get('q');
      const popTab = p.get('tab') as any;

      if (popQ) {
        setQuery(popQ);
        setIsSearching(true);
        if (popTab) setActiveSidebarFilter(popTab);
      } else {
        setQuery('');
        setIsSearching(false);
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  useEffect(() => {
    setShowClear(query.length > 0);
  }, [query]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
      if (masDropdownRef.current && !masDropdownRef.current.contains(e.target as Node)) {
        setIsMasDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (customQuery?: string, tabOverride?: string) => {
    const finalQ = (customQuery !== undefined ? customQuery : query).trim();
    if (!finalQ) return;
    const targetTab = tabOverride || activeSidebarFilter;
    setQuery(finalQ);
    setShowSuggestions(false);
    setIsSearching(true);
    setStatsTime((Math.random() * 0.14 + 0.08).toFixed(2));
    setStatsCount((Math.floor(Math.random() * 85000000) + 4500000).toLocaleString('es-ES'));

    // Update Browser Address Bar URL with query parameters
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('q', finalQ);
      if (targetTab && targetTab !== 'todo') {
        newUrl.searchParams.set('tab', targetTab);
      } else {
        newUrl.searchParams.delete('tab');
      }
      window.history.pushState({}, '', newUrl.toString());
    } catch {
      // Fallback
    }

    console.log(`[LookFind 2010 Redesign] Búsqueda: "${finalQ}" en categoría: ${targetTab}`);
  };

  const handleGoHome = () => {
    setIsSearching(false);
    setQuery('');
    try {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('q');
      newUrl.searchParams.delete('tab');
      window.history.pushState({}, '', newUrl.pathname);
    } catch {
      // Fallback
    }
  };

  const getPageUrl = () => {
    if (query.trim()) {
      return `${sharedBaseUrl}?q=${encodeURIComponent(query.trim())}${activeSidebarFilter !== 'todo' ? `&tab=${activeSidebarFilter}` : ''}`;
    }
    return sharedBaseUrl;
  };

  const handleCopyUrl = () => {
    const url = getPageUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        setCopiedUrl(true);
        setTimeout(() => setCopiedUrl(false), 2000);
      });
    }
    setLuckyToast('¡URL copiada al portapapeles!');
    setTimeout(() => setLuckyToast(null), 2500);
  };

  const handleClear = () => {
    setQuery('');
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleFeelingLucky = () => {
    const luckyList = [
      'LookFind Instant: La velocidad de la búsqueda en 2010',
      'Diseño web en la era de HTML5 y CSS3',
      'El rediseño de Google de mayo de 2010',
      'Tipografía Catull y la historia del logotipo',
      'Innovaciones de los motores de búsqueda',
    ];
    const picked = luckyList[Math.floor(Math.random() * luckyList.length)];
    setQuery(picked);
    setLuckyToast(`¡Voy a tener suerte! Saltando directamente a: ${picked}...`);
    setTimeout(() => {
      setLuckyToast(null);
      handleSearch(picked);
    }, 1000);
  };

  const trendingQueries = [
    'noticias de tecnología 2010',
    'lanzamiento de LookFind Instant',
    'aprender html5 y jquery',
    'mejores smartphones del año',
    'traductor online inglés español',
  ];

  const results: SearchResult[] = [
    {
      id: 'res-spon',
      title: `${query || 'LookFind'} - Sitio Oficial en Español`,
      url: `http://www.lookfind.com/es/`,
      displayUrl: `www.lookfind.com/es/`,
      snippet: `Descubra las novedades de <b>LookFind</b> en 2010. Resultados ultrarrápidos con la nueva barra lateral y la tecnología LookFind Instant. Búsquedas precisas, imágenes de alta resolución y mapas interactivos.`,
      sponsored: true,
    },
    {
      id: 'res-1',
      title: `${query || 'LookFind'} - Todo lo que necesitas saber y guías completas`,
      url: `http://www.lookfind.org/temas/${encodeURIComponent((query || 'internet').toLowerCase())}`,
      displayUrl: `www.lookfind.org/temas/${encodeURIComponent((query || 'internet').toLowerCase())}`,
      snippet: `Información exhaustiva y actualizada sobre <b>${query || 'LookFind'}</b>. Explore análisis detallados, recursos descargables y las fuentes más autorizadas de la red organizadas por relevancia.`,
      date: 'Hace 3 horas',
    },
    {
      id: 'res-2',
      title: `¿Qué es ${query || 'LookFind'}? - Enciclopedia Digital`,
      url: `http://es.wikipedia.org/wiki/${encodeURIComponent(query || 'LookFind')}`,
      displayUrl: `es.wikipedia.org/wiki/${encodeURIComponent(query || 'LookFind')}`,
      snippet: `<b>${query || 'LookFind'}</b> es un referente en la búsqueda de contenidos digitales. Conozca su evolución desde los inicios en 1998, el histórico rediseño visual de 2010 y sus características operativas.`,
      date: '12 de mayo de 2010',
    },
    {
      id: 'res-3',
      title: `Comunidad de desarrolladores: Tutoriales y mejores prácticas para ${query || 'LookFind'}`,
      url: `http://desarrollo-web.com/articulos/${encodeURIComponent((query || 'web').toLowerCase())}`,
      displayUrl: `www.desarrollo-web.com/articulos/${encodeURIComponent((query || 'web').toLowerCase())}`,
      snippet: `Guía paso a paso sobre cómo optimizar sitios web para el algoritmo de <b>${query || 'LookFind'}</b>. Consejos sobre meta-etiquetas, velocidad de carga en navegadores modernos y usabilidad.`,
      date: 'Hace 4 días',
    },
    {
      id: 'res-4',
      title: `Noticias destacadas y artículos de prensa sobre ${query || 'LookFind'}`,
      url: `http://noticias.lookfind.com/actualidad/${encodeURIComponent((query || 'tecnologia').toLowerCase())}`,
      displayUrl: `noticias.lookfind.com/actualidad/`,
      snippet: `Los analistas destacan la velocidad del motor de búsqueda y la integración de la barra lateral izquierda en <b>${query || 'LookFind'}</b>, facilitando el filtrado por fecha, tipo de contenido y ubicación.`,
      date: 'Ayer',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-[#222] font-[Arial,Helvetica,sans-serif] text-[13px] flex flex-col justify-between">
      {/* Toast Alert */}
      {luckyToast && (
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 bg-[#fffbe6] text-[#333] border border-[#d4caa8] px-5 py-2 rounded-xs shadow-md text-xs font-bold flex items-center gap-2">
          <span>⚡</span>
          <span>{luckyToast}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. SERP 2010: GOOGLE'S FAMOUS MAY 2010 REDESIGN WITH LEFT-HAND SIDEBAR */}
      {/* ========================================================================= */}
      {isSearching ? (
        <div className="flex-1 flex flex-col min-h-screen">
          {/* 2010 SERP Header */}
          <header className="border-b border-[#e5e5e5] px-4 py-2.5 bg-[#f5f5f5]">
            <div className="flex flex-wrap items-center gap-4 max-w-[1300px] mx-auto">
              {/* 2010 Catull Logo with Slender Proportions and 3D Volumetric Depth */}
              <button
                onClick={() => setIsSearching(false)}
                className="font-['Cormorant_Garamond','Bona_Nova','EB_Garamond',Georgia,serif] font-normal text-[34px] tracking-[0.02em] select-none cursor-pointer shrink-0 pr-2 flex items-center leading-none"
                title="Volver a la portada de LookFind (2010)"
                style={{
                  filter: 'drop-shadow(0 1.5px 1px rgba(0,0,0,0.25)) drop-shadow(0 3px 4px rgba(0,0,0,0.12))',
                }}
              >
                <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent inline-block">L</span>
                <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent inline-block">o</span>
                <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent inline-block">o</span>
                <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent inline-block">k</span>
                <span className="bg-gradient-to-b from-[#18c645] via-[#009b22] to-[#006e16] bg-clip-text text-transparent inline-block">F</span>
                <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent inline-block">i</span>
                <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent inline-block">n</span>
                <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent inline-block">d</span>
              </button>

              {/* 2010 Search Box Container */}
              <div className="flex items-center flex-1 max-w-[670px] relative">
                <div className="relative flex-1 flex items-center bg-white border border-[#b9b9b9] hover:border-[#a0a0a0] focus-within:border-[#4d90fe] focus-within:shadow-[inset_0_1px_2px_rgba(0,0,0,0.25)] h-[32px] px-2.5 rounded-[1px]">
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full bg-transparent outline-none text-[#222] text-[14px] font-[Arial,sans-serif]"
                  />
                  {showClear && (
                    <button
                      onClick={handleClear}
                      className="text-[#777] hover:text-[#222] font-bold px-1.5 text-xs cursor-pointer"
                      title="Borrar texto"
                    >
                      ✕
                    </button>
                  )}
                  {/* Subtle 2010 Voice & Camera affordance */}
                  <div className="flex items-center gap-1.5 pl-1.5 border-l border-gray-200">
                    <button
                      onClick={() => setShowVoiceModal(true)}
                      className="text-gray-500 hover:text-blue-600 text-xs cursor-pointer"
                      title="Búsqueda por voz (LookFind Voice)"
                    >
                      🎙️
                    </button>
                    <button
                      onClick={() => setShowLensModal(true)}
                      className="text-gray-500 hover:text-blue-600 text-xs cursor-pointer"
                      title="Búsqueda por imagen"
                    >
                      📷
                    </button>
                  </div>
                </div>

                {/* 2010 Blue Search Button */}
                <button
                  onClick={() => handleSearch()}
                  className="ml-2 h-[32px] px-4 bg-gradient-to-b from-[#4d90fe] to-[#4787ed] hover:from-[#4387fd] hover:to-[#3b7ae8] active:to-[#316ecb] text-white font-bold text-xs border border-[#3079ed] rounded-[2px] shadow-xs cursor-pointer flex items-center justify-center gap-1"
                >
                  <Search className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Buscar</span>
                </button>
              </div>

              {/* 2010 User bar */}
              <div className="ml-auto text-xs text-[#333] flex items-center gap-3">
                {/* Custom URL Button */}
                <button
                  onClick={() => setShowUrlModal(true)}
                  className="flex items-center gap-1 px-2.5 py-1 bg-[#fffde9] hover:bg-[#fff7cc] border border-[#d4caa8] rounded-[2px] text-[#184dc5] hover:text-[#0c369e] font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                  title="Ver y copiar la URL propia de esta página"
                >
                  <span>🔗</span>
                  <span>URL propia</span>
                </button>
                <span>|</span>
                <span className="font-bold text-[#184dc5]">facundo@lookfind.com</span>
                <span>|</span>
                <a href="#configuracion" onClick={(e) => { e.preventDefault(); alert('Configuración de búsqueda de LookFind (2010)'); }} className="text-[#333] hover:underline">
                  Configuración
                </a>
                <span>|</span>
                <button onClick={handleGoHome} className="text-[#184dc5] hover:underline font-bold cursor-pointer">
                  Página principal
                </button>
              </div>
            </div>
          </header>

          {/* SERP Body: 2010 Left Sidebar + Results Column */}
          <div className="flex-1 max-w-[1300px] w-full mx-auto px-4 py-3 flex flex-col md:flex-row gap-8">
            {/* =============================================================== */}
            {/* THE ICONIC 2010 LEFT-HAND COLORFUL SIDEBAR */}
            {/* =============================================================== */}
            <aside className="w-full md:w-[170px] shrink-0 text-xs select-none">
              {/* Categories with 2010 Icons */}
              <div className="space-y-0.5">
                {[
                  { id: 'todo', label: 'Todo', icon: '🔍', color: 'text-[#184dc5]' },
                  { id: 'imagenes', label: 'Imágenes', icon: '🖼️', color: 'text-[#ea3e28]' },
                  { id: 'videos', label: 'Videos', icon: '▶️', color: 'text-[#184dc5]' },
                  { id: 'noticias', label: 'Noticias', icon: '📰', color: 'text-[#009b22]' },
                  { id: 'libros', label: 'Libros', icon: '📚', color: 'text-[#7e3794]' },
                  { id: 'lugares', label: 'Lugares', icon: '📍', color: 'text-[#ea3e28]' },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveSidebarFilter(cat.id as any)}
                    className={`w-full flex items-center gap-2 px-2 py-1 rounded-[2px] cursor-pointer text-left transition-colors ${
                      activeSidebarFilter === cat.id
                        ? 'bg-[#d5e2ff] font-bold text-[#184dc5]'
                        : 'text-[#333] hover:bg-[#f1f1f1]'
                    }`}
                  >
                    <span className="text-sm">{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* 2010 Search Tools Section */}
              <div className="mt-5 pt-3 border-t border-gray-200">
                <div className="font-bold text-[#333] mb-1.5 flex items-center justify-between">
                  <span>Más herramientas</span>
                  <ChevronDown className="w-3 h-3 text-gray-500" />
                </div>
                <div className="space-y-1 pl-1 text-[11px] text-[#666]">
                  {[
                    { id: 'any', label: 'Cualquier fecha' },
                    { id: 'hour', label: 'Última hora' },
                    { id: 'day', label: 'Últimas 24 horas' },
                    { id: 'week', label: 'Última semana' },
                    { id: 'year', label: 'Último año' },
                  ].map((time) => (
                    <button
                      key={time.id}
                      onClick={() => setTimeFilter(time.id as any)}
                      className={`block w-full text-left py-0.5 hover:underline cursor-pointer ${
                        timeFilter === time.id ? 'font-bold text-[#222]' : 'text-[#444]'
                      }`}
                    >
                      {timeFilter === time.id && <span className="text-[#184dc5] mr-1">✓</span>}
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Standard vs Instant Preview */}
              <div className="mt-4 pt-3 border-t border-gray-200 text-[11px] text-[#666]">
                <div className="font-bold text-[#333] mb-1">LookFind Instant</div>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={instantSearch}
                    onChange={(e) => setInstantSearch(e.target.checked)}
                    className="cursor-pointer"
                  />
                  <span>Resultados al escribir</span>
                </label>
              </div>
            </aside>

            {/* Main Results Column */}
            <main className="flex-1 max-w-[650px]">
              {/* Stats Bar */}
              <div className="text-xs text-[#777] mb-4">
                Aproximadamente {statsCount} resultados ({statsTime} segundos)
              </div>

              {/* SPONSORED RESULT (2010 Light Yellow Box) */}
              <div className="mb-5 p-3 bg-[#fffde9] border border-[#f5eca6] rounded-[2px]">
                <div className="text-[10px] text-[#777] font-bold uppercase tracking-wider mb-0.5">
                  Anuncio relacionado con {query}
                </div>
                <h3 className="text-[16px] leading-snug">
                  <a href={results[0].url} className="text-[#122caa] hover:underline font-normal">
                    {results[0].title}
                  </a>
                </h3>
                <div className="text-[13px] text-[#0e774a] leading-none my-0.5">
                  {results[0].displayUrl}
                </div>
                <p className="text-[13px] text-[#333] leading-relaxed mt-0.5">
                  Descubra las novedades de <b>{query}</b> en LookFind 2010. Resultados al instante con la barra lateral izquierda y la tipografía clásica Catull optimizada.
                </p>
              </div>

              {/* Standard Search Results */}
              <div className="space-y-5">
                {results.slice(1).map((res) => (
                  <article key={res.id}>
                    {/* Title */}
                    <h2 className="text-[16px] leading-snug">
                      <a
                        href={res.url}
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Navegando a: ${res.url}\n(Modo LookFind 2010)`);
                        }}
                        className="text-[#122caa] hover:underline cursor-pointer font-normal"
                        dangerouslySetInnerHTML={{ __html: res.title }}
                      />
                    </h2>

                    {/* Green URL + Cached Links */}
                    <div className="text-[13px] text-[#0e774a] leading-none my-0.5 flex items-center gap-1.5">
                      <span>{res.displayUrl}</span>
                      <span className="text-gray-400">-</span>
                      <a
                        href="#cache"
                        onClick={(e) => { e.preventDefault(); alert('Versión en caché de LookFind 2010.'); }}
                        className="text-[#777] hover:underline text-xs"
                      >
                        En caché
                      </a>
                      <span className="text-gray-400">-</span>
                      <a
                        href="#similares"
                        onClick={(e) => { e.preventDefault(); handleSearch(`${query} páginas similares`); }}
                        className="text-[#777] hover:underline text-xs"
                      >
                        Similares
                      </a>
                    </div>

                    {/* Snippet */}
                    <p className="text-[13px] text-[#333] leading-relaxed mt-0.5">
                      {res.date && <span className="text-[#777] mr-1.5">{res.date} —</span>}
                      <span dangerouslySetInnerHTML={{ __html: res.snippet }} />
                    </p>
                  </article>
                ))}
              </div>

              {/* =============================================================== */}
              {/* THE 2010 BRIGHT CATULL "LooooooooookFind" PAGINATION (3D DEPTH & SLENDER) */}
              {/* =============================================================== */}
              <div className="pt-10 pb-8 flex flex-col items-center select-none border-t border-gray-200 mt-8">
                <div
                  className="font-['Cormorant_Garamond','Bona_Nova','EB_Garamond',Georgia,serif] font-normal text-4xl tracking-widest flex items-center leading-none"
                  style={{
                    filter: 'drop-shadow(0 1.5px 1px rgba(0,0,0,0.22)) drop-shadow(0 3px 4px rgba(0,0,0,0.1))',
                  }}
                >
                  <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent">L</span>
                  <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#18c645] via-[#009b22] to-[#006e16] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#18c645] via-[#009b22] to-[#006e16] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent">o</span>
                  <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent">k</span>
                  <span className="bg-gradient-to-b from-[#18c645] via-[#009b22] to-[#006e16] bg-clip-text text-transparent">F</span>
                  <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent">i</span>
                  <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent">n</span>
                  <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent">d</span>
                </div>

                {/* Page numbers below each 'o' */}
                <div className="flex items-center gap-3 text-xs mt-2 text-[#122caa]">
                  <span className="text-black font-bold text-sm">1</span>
                  {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((pg) => (
                    <a
                      key={pg}
                      href={`#page-${pg}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setStatsTime((Math.random() * 0.12 + 0.08).toFixed(2));
                        alert(`Cargando página ${pg} de resultados...`);
                      }}
                      className="hover:underline text-xs"
                    >
                      {pg}
                    </a>
                  ))}
                  <a
                    href="#siguiente"
                    onClick={(e) => {
                      e.preventDefault();
                      alert('Cargando siguiente página...');
                    }}
                    className="hover:underline font-bold ml-2 text-xs"
                  >
                    Siguiente &gt;
                  </a>
                </div>
              </div>
            </main>
          </div>

          {/* 2010 SERP Footer */}
          <footer className="border-t border-[#e5e5e5] bg-[#f5f5f5] py-3 text-center text-xs text-[#777]">
            <div className="flex items-center justify-center gap-4 text-[#122caa] mb-1">
              <button onClick={handleGoHome} className="hover:underline cursor-pointer">Página principal de LookFind</button>
              <span>-</span>
              <a href="#publicidad" className="hover:underline">Programas de publicidad</a>
              <span>-</span>
              <a href="#soluciones" className="hover:underline">Soluciones empresariales</a>
              <span>-</span>
              <a href="#acerca" className="hover:underline">Todo acerca de LookFind</a>
              <span>-</span>
              <button onClick={() => setShowUrlModal(true)} className="hover:underline cursor-pointer font-bold text-[#184dc5]">
                🔗 URL propia
              </button>
            </div>
            <div>© 2010 LookFind - Privacidad y Condiciones</div>
          </footer>
        </div>
      ) : (
        /* ========================================================================= */
        /* 2. 2010 HOMEPAGE: THE ICONIC 2010 MAY REDESIGN WITH CATULL BQ LOGO */
        /* ========================================================================= */
        <div className="flex-1 flex flex-col justify-between items-center min-h-screen">
          {/* 2010 Top Navigation Bar (Iconic Top Left Google Menu) */}
          <div className="w-full flex items-center justify-between px-4 py-2 text-xs border-b border-gray-100 select-none">
            {/* Top Left Services Navigation */}
            <nav className="flex items-center gap-3 text-[#333]">
              <span className="font-bold text-black border-b-2 border-[#184dc5] pb-0.5">Web</span>
              <button
                onClick={() => { setActiveSidebarFilter('imagenes'); handleSearch('imágenes destacadas'); }}
                className="hover:underline cursor-pointer"
              >
                Imágenes
              </button>
              <button
                onClick={() => { setActiveSidebarFilter('videos'); handleSearch('videos'); }}
                className="hover:underline cursor-pointer"
              >
                Videos
              </button>
              <button
                onClick={() => { setActiveSidebarFilter('lugares'); handleSearch('mapas y rutas'); }}
                className="hover:underline cursor-pointer"
              >
                Maps
              </button>
              <button
                onClick={() => { setActiveSidebarFilter('noticias'); handleSearch('noticias de hoy'); }}
                className="hover:underline cursor-pointer"
              >
                Noticias
              </button>
              <button
                onClick={() => { setActiveSidebarFilter('libros'); handleSearch('libros'); }}
                className="hover:underline cursor-pointer hidden sm:inline"
              >
                Libros
              </button>
              <button
                onClick={() => handleSearch('LookMail')}
                className="hover:underline cursor-pointer"
              >
                Gmail
              </button>

              {/* Dropdown "más ▼" */}
              <div className="relative" ref={masDropdownRef}>
                <button
                  onClick={() => setIsMasDropdownOpen(!isMasDropdownOpen)}
                  className="hover:underline flex items-center gap-0.5 text-gray-700 cursor-pointer"
                >
                  <span>más</span>
                  <span className="text-[9px]">▼</span>
                </button>
                {isMasDropdownOpen && (
                  <div className="absolute left-0 mt-1 w-36 bg-white border border-[#ccc] shadow-md py-1 z-50 rounded-[2px]">
                    <a href="#traductor" onClick={(e) => { e.preventDefault(); handleSearch('Traductor'); setIsMasDropdownOpen(false); }} className="block px-3 py-1 hover:bg-[#184dc5] hover:text-white text-xs">Traductor</a>
                    <a href="#fotos" onClick={(e) => { e.preventDefault(); handleSearch('Fotos'); setIsMasDropdownOpen(false); }} className="block px-3 py-1 hover:bg-[#184dc5] hover:text-white text-xs">Fotos</a>
                    <a href="#documentos" onClick={(e) => { e.preventDefault(); handleSearch('Documentos'); setIsMasDropdownOpen(false); }} className="block px-3 py-1 hover:bg-[#184dc5] hover:text-white text-xs">Docs</a>
                    <div className="border-t border-gray-200 my-1" />
                    <a href="#todo" onClick={(e) => { e.preventDefault(); handleSearch('Todos los productos de LookFind'); setIsMasDropdownOpen(false); }} className="block px-3 py-1 hover:bg-[#184dc5] hover:text-white text-xs font-bold">Aún más...</a>
                  </div>
                )}
              </div>
            </nav>

            {/* Top Right Account, Settings, and Custom URL */}
            <div className="flex items-center gap-3 text-xs text-[#333]">
              <button
                onClick={() => setShowUrlModal(true)}
                className="flex items-center gap-1 px-2.5 py-1 bg-[#fffde9] hover:bg-[#fff7cc] border border-[#d4caa8] rounded-[2px] text-[#184dc5] hover:text-[#0c369e] font-bold text-xs cursor-pointer transition-colors shadow-2xs"
                title="Ver y compartir la URL pública de esta página"
              >
                <span>🔗</span>
                <span>URL propia</span>
              </button>
              <span>|</span>
              <span className="text-gray-600 font-medium">facundo@lookfind.com</span>
              <span>|</span>
              <a
                href="#configuracion"
                onClick={(e) => { e.preventDefault(); alert('Panel de configuración de LookFind (Estilo 2010)'); }}
                className="hover:underline cursor-pointer"
              >
                Configuración ▼
              </a>
              <span>|</span>
              <button
                onClick={() => alert('Sesión iniciada como Facundo Lecuna')}
                className="text-[#184dc5] hover:underline font-bold cursor-pointer"
              >
                Mi cuenta
              </button>
            </div>
          </div>

          {/* 2010 Main Content */}
          <main className="w-full max-w-[620px] flex flex-col items-center my-auto px-4 py-8">
            {/* =============================================================== */}
            {/* THE ICONIC 2010 GOOGLE LOGO (SLENDER CATULL, 3D VOLUMETRIC DEPTH) */}
            {/* =============================================================== */}
            <div className="text-center select-none mb-6">
              <h1
                className="font-['Cormorant_Garamond','Bona_Nova','EB_Garamond',Georgia,serif] font-normal text-8xl sm:text-9xl md:text-[116px] tracking-[0.02em] inline-flex items-center justify-center leading-none"
                style={{
                  filter: 'drop-shadow(0 2px 1.5px rgba(0,0,0,0.28)) drop-shadow(0 5px 8px rgba(0,0,0,0.14))',
                }}
              >
                {/* Authentic 2010 Colors with 3D Bevel/Specular Depth */}
                <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">L</span>
                <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">o</span>
                <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">o</span>
                <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">k</span>
                <span className="bg-gradient-to-b from-[#18c645] via-[#009b22] to-[#006e16] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">F</span>
                <span className="bg-gradient-to-b from-[#ff6048] via-[#ea3e28] to-[#b81d0c] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">i</span>
                <span className="bg-gradient-to-b from-[#ffd13b] via-[#ffb700] to-[#cb8500] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">n</span>
                <span className="bg-gradient-to-b from-[#427cf8] via-[#184dc5] to-[#0c369e] bg-clip-text text-transparent hover:scale-105 transition-transform inline-block">d</span>
              </h1>
              <div className="text-[11px] text-[#777] font-[Arial,sans-serif] mt-2 tracking-wide font-normal">
                España / Latinoamérica (Edición 2010 · Relieve 3D)
              </div>
            </div>

            {/* 2010 Search Input Box with Tactile Depth */}
            <div ref={searchContainerRef} className="w-full max-w-[540px] relative">
              <div className="relative flex items-center bg-white border border-[#b3b3b3] hover:border-[#999] focus-within:border-[#4d90fe] focus-within:shadow-[inset_0_1px_3px_rgba(0,0,0,0.22),0_0_5px_rgba(77,144,254,0.4)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.12),0_1px_0_rgba(255,255,255,0.8)] h-[38px] px-3 rounded-[2px] transition-all">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch();
                    if (e.key === 'Escape') setShowSuggestions(false);
                  }}
                  className="w-full bg-transparent outline-none text-[#222] text-[16px] font-[Arial,sans-serif]"
                  autoComplete="off"
                  spellCheck="false"
                  autoFocus
                />

                {/* Clear "X" button as requested */}
                {showClear && (
                  <button
                    onClick={handleClear}
                    className="text-[#777] hover:text-[#222] font-bold px-2 text-sm cursor-pointer"
                    title="Borrar texto"
                  >
                    ✕
                  </button>
                )}

                {/* 2010 Mic & Camera affordance icons */}
                <div className="flex items-center gap-1.5 pl-2 border-l border-gray-200">
                  <button
                    onClick={() => setShowVoiceModal(true)}
                    className="text-gray-500 hover:text-blue-600 text-sm cursor-pointer"
                    title="Búsqueda por voz (LookFind Voice)"
                  >
                    🎙️
                  </button>
                  <button
                    onClick={() => setShowLensModal(true)}
                    className="text-gray-500 hover:text-blue-600 text-sm cursor-pointer"
                    title="Búsqueda por imagen"
                  >
                    📷
                  </button>
                </div>
              </div>

              {/* 2010 Instant Predictive Autocomplete Dropdown */}
              {showSuggestions && (
                <div className="absolute left-0 right-0 top-full bg-white border border-[#b9b9b9] border-t-0 shadow-lg z-50 text-left text-xs font-[Arial,sans-serif]">
                  {trendingQueries.map((item, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSearch(item)}
                      className="px-3 py-1.5 hover:bg-[#f2f2f2] cursor-pointer flex items-center justify-between"
                    >
                      <span className="font-normal text-[#222]">
                        <span className="font-bold">{query}</span>
                        {item.replace(query, '')}
                      </span>
                      <span className="text-[#0e774a] text-[10px]">Aproximadamente {idx * 4 + 8}M resultados</span>
                    </div>
                  ))}
                  <div className="bg-[#f5f5f5] px-3 py-1.5 border-t border-gray-200 text-[11px] text-gray-500 flex justify-between items-center">
                    <span>LookFind Instant está activado</span>
                    <button onClick={() => setShowSuggestions(false)} className="text-[#184dc5] hover:underline">
                      Cerrar
                    </button>
                  </div>
                </div>
              )}

              {/* 2010 3D Tactile Buttons with Bevel Depth and Highlight */}
              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => handleSearch()}
                  className="h-[32px] px-4 bg-gradient-to-b from-[#fafafa] via-[#f3f3f3] to-[#e4e4e4] hover:from-[#ffffff] hover:via-[#f7f7f7] hover:to-[#e8e8e8] active:from-[#e4e4e4] active:to-[#f0f0f0] text-[#333] hover:text-[#111] font-bold text-[11px] font-[Arial,sans-serif] border border-[#b8b8b8] hover:border-[#999] shadow-[0_1px_2px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)] rounded-[2px] cursor-pointer select-none transition-all flex items-center justify-center"
                >
                  Buscar con LookFind
                </button>
                <button
                  type="button"
                  onClick={handleFeelingLucky}
                  className="h-[32px] px-4 bg-gradient-to-b from-[#fafafa] via-[#f3f3f3] to-[#e4e4e4] hover:from-[#ffffff] hover:via-[#f7f7f7] hover:to-[#e8e8e8] active:from-[#e4e4e4] active:to-[#f0f0f0] text-[#333] hover:text-[#111] font-bold text-[11px] font-[Arial,sans-serif] border border-[#b8b8b8] hover:border-[#999] shadow-[0_1px_2px_rgba(0,0,0,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] active:shadow-[inset_0_1px_3px_rgba(0,0,0,0.25)] rounded-[2px] cursor-pointer select-none transition-all flex items-center justify-center"
                >
                  Voy a tener suerte
                </button>
              </div>

              {/* 2010 Language selection line */}
              <div className="mt-6 text-xs text-[#333] text-center">
                LookFind.com ofrecido en:{' '}
                <button onClick={() => setLuckyToast('Idioma: Español')} className="text-[#122caa] hover:underline mx-0.5">
                  Español
                </button>
                ·
                <button onClick={() => setLuckyToast('Language: English')} className="text-[#122caa] hover:underline mx-0.5">
                  English
                </button>
                ·
                <button onClick={() => setLuckyToast('Idioma: Català')} className="text-[#122caa] hover:underline mx-0.5">
                  Català
                </button>
                ·
                <button onClick={() => setLuckyToast('Idioma: Galego')} className="text-[#122caa] hover:underline mx-0.5">
                  Galego
                </button>
                ·
                <button onClick={() => setLuckyToast('Hizkuntza: Euskara')} className="text-[#122caa] hover:underline mx-0.5">
                  Euskara
                </button>
              </div>
            </div>
          </main>

          {/* 2010 Footer */}
          <footer className="w-full bg-[#f2f2f2] border-t border-[#e4e4e4] py-3 text-xs text-[#666] text-center select-none">
            <div className="flex flex-wrap items-center justify-center gap-4 text-[#122caa] mb-1 font-normal">
              <a
                href="#publicidad"
                onClick={(e) => { e.preventDefault(); alert('LookFind AdWords 2010: Publicidad contextual de alta eficacia.'); }}
                className="hover:underline"
              >
                Soluciones publicitarias
              </a>
              <span>-</span>
              <a
                href="#empresas"
                onClick={(e) => { e.preventDefault(); alert('Soluciones para empresas de LookFind.'); }}
                className="hover:underline"
              >
                Servicios para empresas
              </a>
              <span>-</span>
              <a
                href="#acerca"
                onClick={(e) => { e.preventDefault(); handleSearch('Acerca de LookFind y el rediseño de 2010'); }}
                className="hover:underline"
              >
                Todo acerca de LookFind
              </a>
            </div>
            <div className="text-[11px] text-[#777] flex items-center justify-center gap-2 mt-1">
              <span>© 2010 LookFind · Privacidad · Condiciones</span>
              <span>·</span>
              <button
                onClick={() => setShowUrlModal(true)}
                className="text-[#184dc5] hover:underline cursor-pointer font-bold"
              >
                URL propia de LookFind
              </button>
            </div>
          </footer>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. MODALS (URL PROPIA, VOICE & LENS) */}
      {/* ========================================================================= */}

      {/* URL PROPIA (SHAREABLE LINK MODAL) */}
      {showUrlModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-2xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-[#4d90fe] rounded-[2px] shadow-2xl p-6 font-[Arial,sans-serif]">
            <div className="flex justify-between items-center pb-2 border-b border-gray-200 mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🌐</span>
                <span className="font-bold text-base text-[#184dc5]">URL Propia y Pública de LookFind</span>
              </div>
              <button
                onClick={() => setShowUrlModal(false)}
                className="text-gray-500 hover:text-black font-bold text-sm cursor-pointer p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-700 leading-relaxed mb-3">
              Esta es la dirección web pública de tu motor de búsqueda <b>LookFind</b>. Puedes usarla para acceder directamente o compartirla con cualquier persona desde cualquier dispositivo:
            </p>

            {/* URL Input Box with Copy Button */}
            <div className="flex items-center gap-2 bg-[#f8f9fa] border border-[#b9b9b9] p-2 rounded-[2px] mb-4">
              <input
                type="text"
                readOnly
                value={getPageUrl()}
                className="flex-1 bg-transparent text-xs font-mono text-[#184dc5] outline-none select-all font-semibold"
              />
              <button
                onClick={handleCopyUrl}
                className="px-3 py-1.5 bg-[#4d90fe] hover:bg-[#357ae8] text-white text-xs font-bold rounded-[2px] cursor-pointer shadow-xs whitespace-nowrap transition-colors"
              >
                {copiedUrl ? '✓ ¡Copiado!' : 'Copiar URL'}
              </button>
            </div>

            <div className="bg-[#f0f4f9] border border-[#d2e3fc] p-3 rounded-[2px] mb-4 text-xs text-[#174ea6]">
              <div className="font-bold mb-1">🔗 Enlace directo permanente:</div>
              <a
                href={getPageUrl()}
                target="_blank"
                rel="noreferrer"
                className="text-[#184dc5] hover:underline font-mono break-all font-medium"
              >
                {getPageUrl()}
              </a>
            </div>

            <div className="flex justify-between items-center text-xs text-gray-500 pt-2 border-t border-gray-200">
              <span>Soporta búsquedas automáticas con parámetros (?q=...)</span>
              <button
                onClick={() => setShowUrlModal(false)}
                className="px-4 py-1.5 bg-[#f5f5f5] hover:bg-[#e8e8e8] border border-[#dcdcdc] text-xs font-bold rounded-[2px] cursor-pointer"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {showVoiceModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white border border-[#4d90fe] rounded-[2px] shadow-2xl p-5 text-center font-[Arial,sans-serif]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm text-[#184dc5]">🎙️ Búsqueda por voz LookFind (2010)</span>
              <button onClick={() => setShowVoiceModal(false)} className="text-gray-500 hover:text-black font-bold">✕</button>
            </div>
            <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto my-4 border-2 border-red-500 animate-pulse">
              <span className="text-2xl">🎙️</span>
            </div>
            <p className="font-bold text-sm text-gray-800">Diga su consulta ahora...</p>
            <p className="text-xs text-gray-500 mt-1">LookFind Voice Search procesando audio</p>
            <div className="mt-5 flex justify-center gap-2">
              <button
                onClick={() => {
                  setShowVoiceModal(false);
                  handleSearch('computación en la nube 2010');
                }}
                className="px-4 py-1.5 bg-[#4d90fe] text-white text-xs font-bold rounded-[2px] hover:bg-[#357ae8]"
              >
                Aceptar prueba
              </button>
              <button
                onClick={() => setShowVoiceModal(false)}
                className="px-4 py-1.5 bg-[#f5f5f5] border border-[#dcdcdc] text-xs font-bold rounded-[2px]"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {showLensModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-[#4d90fe] rounded-[2px] shadow-2xl p-5 font-[Arial,sans-serif]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-bold text-sm text-[#184dc5]">📷 Búsqueda por Imágenes LookFind</span>
              <button onClick={() => setShowLensModal(false)} className="text-gray-500 hover:text-black font-bold">✕</button>
            </div>
            <p className="text-xs text-gray-600 mb-3">
              Suba o arrastre una imagen para buscar contenido visual similar en el índice de LookFind.
            </p>
            <div className="border border-dashed border-[#b9b9b9] p-6 text-center bg-[#fafafa] rounded-[2px]">
              <input type="file" className="text-xs" />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowLensModal(false);
                  setActiveSidebarFilter('imagenes');
                  handleSearch('búsqueda visual 2010');
                }}
                className="px-4 py-1.5 bg-[#4d90fe] text-white text-xs font-bold rounded-[2px] hover:bg-[#357ae8]"
              >
                Buscar imagen
              </button>
              <button
                onClick={() => setShowLensModal(false)}
                className="px-4 py-1.5 bg-[#f5f5f5] border border-[#dcdcdc] text-xs font-bold rounded-[2px]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
