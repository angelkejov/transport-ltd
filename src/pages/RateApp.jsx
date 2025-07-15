import React, { useState, useEffect } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const RateApp = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [description, setDescription] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [hasRated, setHasRated] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('hasRatedApp')) {
      setHasRated(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`${API_URL}/rating`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stars: rating, description })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Грешка при изпращане на оценката.');
      }
      setSubmitted(true);
      setHasRated(true);
      localStorage.setItem('hasRatedApp', 'true');
    } catch (err) {
      setError(err.message || 'Грешка при изпращане на оценката.');
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '3rem auto', padding: '2rem', background: '#fff', borderRadius: 16, boxShadow: '0 2px 16px rgba(0,0,0,0.10)' }}>
      <h2 style={{ textAlign: 'center', color: '#d32f2f', marginBottom: '2rem' }}>Оцени приложението</h2>
      {hasRated ? (
        <div style={{ textAlign: 'center', color: '#388e3c', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Вече сте оценили приложението. Благодарим Ви!
        </div>
      ) : submitted ? (
        <div style={{ textAlign: 'center', color: '#388e3c', fontWeight: 'bold', fontSize: '1.2rem' }}>
          Благодарим Ви за обратната връзка!
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                style={{
                  fontSize: 40,
                  color: (hover || rating) >= star ? '#ffd600' : '#ccc',
                  cursor: 'pointer',
                  transition: 'color 0.2s',
                  marginRight: star !== 5 ? 8 : 0
                }}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                role="button"
                aria-label={`Оцени с ${star} звезди`}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Вашето мнение (по избор)"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={5}
            style={{ width: '100%', padding: '0.75rem', borderRadius: 8, border: '1px solid #ccc', fontSize: 16, marginBottom: '1.5rem', resize: 'vertical' }}
          />
          {error && <div style={{ color: '#d32f2f', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
          <button
            type="submit"
            disabled={rating === 0}
            style={{
              width: '100%',
              padding: '0.75rem',
              background: rating === 0 ? '#ccc' : '#388e3c',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontWeight: 'bold',
              fontSize: 18,
              cursor: rating === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s'
            }}
          >
            Изпрати
          </button>
        </form>
      )}
    </div>
  );
};

export default RateApp; 