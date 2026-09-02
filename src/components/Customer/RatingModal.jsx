import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useLanguage } from '../../context/LanguageContext';
import { Modal } from '../Common/Modal';
import { Star, HeartHandshake, CheckCircle2, Award, ThumbsUp, Send } from 'lucide-react';
import { translateWorkerName, translateCategory } from '../../utils/translateHelpers';

export const RatingModal = () => {
  const { ratingModalOpen, setRatingModalOpen, ratingBooking, addNotification } = useApp();
  const { t, lang } = useLanguage();

  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!ratingBooking) return null;

  const handleRatingSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setRatingModalOpen(false);
      addNotification(`Rating & Feedback submitted for ${ratingBooking.workerName}! ⭐ ${rating}/5`, 'success');
      setReviewText('');
      setTipAmount(0);
    }, 1000);
  };

  return (
    <Modal
      isOpen={ratingModalOpen}
      onClose={() => setRatingModalOpen(false)}
      title={t('rateWorkerTitle') || 'Rate & Review Worker Performance'}
    >
      <div className="space-y-5 font-sans text-slate-800">
        
        {/* Worker Info Header */}
        <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 text-white rounded-2xl p-4 flex items-center gap-3 shadow-md">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-slate-950 font-black text-lg flex items-center justify-center shrink-0 shadow">
            {ratingBooking.workerName ? ratingBooking.workerName[0].toUpperCase() : 'W'}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-sm text-white truncate">
              {translateWorkerName(ratingBooking.workerName, lang)}
            </h3>
            <p className="text-[11px] text-teal-300 font-medium capitalize truncate">
              {translateCategory(ratingBooking.category, t)} • Booking ID #{ratingBooking.id}
            </p>
          </div>
          <span className="px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-[10px] font-bold border border-emerald-500/30 shrink-0">
            {t('tabCompleted') || 'Job Completed'}
          </span>
        </div>

        {/* Interactive 5-Star Selection */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center space-y-2">
          <label className="text-xs font-extrabold text-slate-700 uppercase tracking-wider block">
            {t('satisfactionQuestion') || 'How satisfied are you with the service quality?'}
          </label>

          <div className="flex items-center justify-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => {
              const active = (hoverRating || rating) >= star;
              return (
                <button
                  key={star}
                  type="button"
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  className="p-1 transition-transform active:scale-125 focus:outline-none"
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      active ? 'text-amber-400 fill-amber-400 drop-shadow' : 'text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <p className="text-xs font-extrabold text-teal-800">
            {rating === 5 && '🌟 Exceptional Craftsmanship & Punctual!'}
            {rating === 4 && '👍 Great Job, Very Satisfied!'}
            {rating === 3 && '😐 Average Service'}
            {rating === 2 && '👎 Below Expectations'}
            {rating === 1 && '⚠️ Poor Service Quality'}
          </p>
        </div>

        {/* Feedback Comment Box */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">Write a Review / Feedback (Optional)</label>
          <textarea
            rows={3}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your experience with this worker..."
            className="w-full p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium text-slate-900"
          ></textarea>
        </div>

        {/* Optional Tip to Worker */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-slate-700 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <ThumbsUp className="w-3.5 h-3.5 text-teal-600" />
              <span>Add a Tip (100% goes directly to worker)</span>
            </span>
            {tipAmount > 0 && <span className="text-emerald-700 font-bold text-xs">+ ₹{tipAmount} Tip</span>}
          </label>

          <div className="grid grid-cols-4 gap-2">
            {[0, 50, 100, 200].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => setTipAmount(amt)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  tipAmount === amt
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                {amt === 0 ? 'No Tip' : `₹${amt}`}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Rating Button */}
        <button
          onClick={handleRatingSubmit}
          disabled={isSubmitting}
          className="w-full py-3.5 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 active:scale-95 text-white rounded-xl font-extrabold text-xs shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{isSubmitting ? 'Submitting Feedback...' : (t('submitFeedbackBtn') || 'Submit Review & Rating')} {tipAmount > 0 ? `(Tip: ₹${tipAmount})` : ''}</span>
        </button>

      </div>
    </Modal>
  );
};
