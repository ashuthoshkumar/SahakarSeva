import React from 'react';
import { Star } from 'lucide-react';

export const StarRating = ({ rating, count }) => {
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center text-amber-500">
        <Star className="w-4 h-4 fill-amber-400 stroke-amber-500" />
      </div>
      <span className="text-sm font-semibold text-slate-800">{rating}</span>
      {count !== undefined && (
        <span className="text-xs text-slate-500">({count})</span>
      )}
    </div>
  );
};
