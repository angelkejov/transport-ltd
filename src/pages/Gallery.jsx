import React from 'react';

const images = [
  { src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80', caption: 'Извозване на строителни отпадъци' },
  { src: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80', caption: 'Доставка на инертни материали' },
  { src: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80', caption: 'Почистване на дворове' },
  { src: 'https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=400&q=80', caption: 'Доставка на дървен материал' },
  { src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80', caption: 'Палети и товари' },
  { src: 'https://images.unsplash.com/photo-1468421870903-4df1664ac249?auto=format&fit=crop&w=400&q=80', caption: 'Извозване на метални отпадъци' },
];

const Gallery = () => (
  <div style={{ padding: '2rem', maxWidth: 1100, margin: '2rem auto' }}>
    <h2 style={{ color: '#d32f2f', textAlign: 'center', marginBottom: '2rem' }}>Галерия</h2>
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
    }}>
      {images.map((img, idx) => (
        <div key={idx} style={{ background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img src={img.src} alt={img.caption} style={{ width: '100%', height: 180, objectFit: 'cover' }} />
          <div style={{ padding: '1rem', color: '#388e3c', fontWeight: 500, textAlign: 'center' }}>{img.caption}</div>
        </div>
      ))}
    </div>
  </div>
);

export default Gallery; 